const asyncHandler = require('express-async-handler');
const TicketModel = require('../models/TicketModel');
const ProjectModel = require('../models/ProjectModel');
const UserModel = require('../models/UserModel');
const status = require('../helpers/statusCodes');
const mongoose = require("mongoose");
const { categories, priorities, ticketStatusObject } = require('../config/conf');
const { spawn } = require('child_process');
const path = require('path');
const {model} = require("mongoose");

const predictCategory = asyncHandler(async (bugDescription) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.resolve(__dirname, '..', 'ML_models', 'Categorization', 'predict_category.py'), bugDescription]);

        pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString().trim());
        });

        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`Python script exited with code ${code}`);
            }
        });
    });
});

const getTicketsByDevelopers = async (developers) => {
    const developersWithDescriptions = await Promise.all(developers.map(async (developer) => {

        const tickets = await TicketModel.find({ developerID: developer._id.toString() }).select('description');
        const descriptions = tickets.map(ticket => ticket.description);
        // return descriptions;
        return {
                developerID: developer._id,
                jobTitle: developer.jobTitle,
                oldBugsDescription: descriptions
            }
    }));

    return developersWithDescriptions;
};

const predictAssignee = asyncHandler(async (bugDescription, projectID) => {
    // Prepare the input to predictDev model
    const developers = await UserModel.find({ projects: projectID }).select('_id jobTitle');
    const developersData = await getTicketsByDevelopers(developers);
    const modelInput = {
        bugDescription,
        developersData
    };
    // Predict developers
    let developersPredicted = "";
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.resolve(__dirname, '..', 'ML_models', 'Developer Assign', 'dev_assign.py')]);

        pythonProcess.stdin.write(JSON.stringify(modelInput));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            developersPredicted = data.toString();
            // console.log(`Python output: ${developersPredicted}`);
            resolve(developersPredicted.trim());
        });

        pythonProcess.stderr.on('data', (data) => {
            // console.error(`Python error: ${data.toString()}`);
            reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`Python script exited with code ${code}`);
            }
        });
    });
});

const createTicket = asyncHandler(async (req, res) => {
    const { name, title, description, projectID, images } = req.body;

    // validate authority
    if (!await ProjectModel.findOne({_id: projectID, createdBy: req.user.id.toString()})){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Only the project owner is allowed to create a ticket.");
    }

    // validate name
    if (!name || name.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket Name is required.");
    }
    if (await TicketModel.findOne({name, projectID})) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket Name is taken before.");
    }

    // validate title
    if (!title || title.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket Title is required.");
    }
    // validate description
    if (!description || description.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket Description is required.");
    }
    // validate project
    if (!projectID) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project ID is required.");
    }
    // check project exists
    const project = await ProjectModel.findOne({_id: projectID});
    if (!project) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Project Name.");
    }

    // predict category
    let category = "None"  // default
    // try {
    //     category = await predictCategory(description);
    // } catch (error) {
    //     console.error(`Error while predicting the category : ${error}`);
    // }

    // TODO: predict priority

    // TODO: extract duplicates

    // predict developer to assign
    let predictedDevelopers = null
    // try {
    //     predictedDevelopers = await predictAssignee(description, projectID);
    //     if (predictedDevelopers) {
    //         predictedDevelopers = predictedDevelopers.split(',');
    //     }
    // } catch (error) {
    //     console.error(`Error while predicting the developer assignee : ${error}`);
    // }

    const newTicket = await TicketModel.create({ name, title, description, category, projectID, images, reporterID:req.user.id });
    return res.status(status.CREATED).json({newTicket, predictedDevelopers});
});

const searchForTicket = asyncHandler(async (req, res) => {
    const { projectID, keyword, ticketStatus, category, priority } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!await ProjectModel.findById(projectID)) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project ID is invalid.");
    }

    if (!keyword || keyword.trim() === "") {
        res.status(status.VALIDATION_ERROR)
        throw new Error("Keyword ID is invalid.");
    }

    try {
        // Build query object
        const query = {
            projectID,
            title: { $regex: keyword, $options: 'i' } // 'i' for case-insensitive search
        };

        // Add optional filters if they are present
        if (ticketStatus) query.status = ticketStatus;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        const tickets = await TicketModel.find(query)
            .populate('developerID', 'fullName image')
            .populate('reporterID', 'fullName image')
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(status.OK).json(tickets);
    } catch (error) {
        res.status(status.SERVER_ERROR).json({ message: "Failed to search for tickets" });
    }
});

const getTicket = asyncHandler( async (req, res) => {
    const {ticketID} = req.body;
    const data = await TicketModel.findById(ticketID)
        .populate('developerID', 'fullName image')
        .populate('reporterID', 'fullName image')
        .populate('projectID', 'projectName');

    if(data) res.status(status.OK).json(data);
    else{
        res.status(status.NOT_FOUND);
        throw new Error("Ticket is not found.")
    }
})

const updateTicket = asyncHandler(async (req, res) => {
    let {ticketID, projectID, developerID, title, description, category, ticketStatus , priority} = req.body;

    // check if the ticket exists
    if (!await TicketModel.findById(ticketID)){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket not found.");
    }

    // validate title
    if (title && title.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket Title is required.");
    }
    // validate description
    if (description && description.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket Description is required.");
    }
    // validate category
    if (category && !categories[category.toUpperCase()]) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Category.");
    }
    // validate priority
    if (priority && !priorities[priority.toUpperCase()]) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Priority.");
    }
    // validate status
    if (ticketStatus && !ticketStatusObject[ticketStatus.toUpperCase()]) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Ticket Status.");
    }
    // check project exists
    if (!await ProjectModel.findById(projectID)) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Project ID.");
    }
    // validate developer
    if (!developerID || !mongoose.Types.ObjectId.isValid(developerID)){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Developer ID.");
    }

    ticketStatus = ticketStatusObject[ticketStatus.toUpperCase()];
    category = categories[category.toUpperCase()];
    priority = priorities[priority.toUpperCase()];

    const updatedTicket = await TicketModel.findByIdAndUpdate(
        ticketID,
        {projectID, developerID, title, description, category, ticketStatus , priority},
        { new: true }
    );
    res.status(status.OK).json(updatedTicket);
});

const deleteTicket = asyncHandler( async (req, res) =>{
    const {ticketID} = req.body;
    const removed = await TicketModel.findByIdAndRemove(ticketID);
    if(removed)
        res.status(status.OK).json({deleted: 1})
    else{
        res.status(status.NOT_FOUND);
        throw new Error("Ticket is not found.")
    }

})

module.exports = {
    createTicket,
    searchForTicket,
    getTicket,
    updateTicket,
    deleteTicket,
}