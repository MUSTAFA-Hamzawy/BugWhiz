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
const multer = require('multer');
const NotificationModel = require('../models/NotificationModel');

// multer.diskStorage is a method provided by multer to set up the storage engine.
// It specifies how and where to store the uploaded files on the disk.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

// Initialization multer with the defined storage configuration.
// storage : is the storage engine defined earlier using multer.diskStorage.
const upload = multer({ storage });

/**
 * Retrieves tickets assigned to developers and includes their descriptions.
 * This method is used to prepare the input to the model which predicts the developers to be assigned to a ticket
 *
 * @async
 * @function getTicketsByDevelopers
 * @param {Array<Object>} developers - An array of developer objects.
 * @param {string} developers._id - The ID of the developer.
 * @param {string} developers.jobTitle - The job title of the developer.
 * @returns {Promise<Array<Object>>} - Returns a promise that resolves to an array of developer objects with their ticket descriptions.
 * @throws {Error} - Throws an error if any operation fails.
 */
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

const predictPriority = asyncHandler(async (bugDescription) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.resolve(__dirname, '..', 'ML_models', 'Prioritization', 'predict_priority.py'), bugDescription]);

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

const extractDuplicates = asyncHandler(async (bugDescription, projectID) => {
    // Prepare the input to the model
    const projectTickets = await TicketModel.find({ projectID }).select('_id description');
    const modelInput = {
        bugDescription,
        projectTickets
    };

    // Predict developers
    let duplicates = "";
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.resolve(__dirname, '..', 'ML_models', 'Duplication', 'extract_duplicates.py')]);
        pythonProcess.stdin.write(JSON.stringify(modelInput));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            duplicates = data.toString();
            resolve(duplicates.trim());
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

const predictAssignee = asyncHandler(async (bugDescription, projectID, jobTitle) => {
    // Prepare the input to predictDev model
    const developers = await UserModel.find({ projects: projectID, jobTitle }).select('_id jobTitle');
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
            resolve(developersPredicted.trim());
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

const createTicket = asyncHandler(async (req, res) => {
    const { name, title, description, projectID } = req.body;

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

    // Handle image uploads
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => file.path);
    }

    // predict category using ML model
    let category = "None"  // default
    try {
        category = await predictCategory(description);
    } catch (error) {
        console.error(`Error while predicting the category : ${error}`);
    }

    // predict priority using ML model
    let priority = "P1"  // default
    try {
        priority = await predictPriority(description);
    } catch (error) {
        console.error(`Error while predicting the priority : ${error}`);
    }

    // extract duplicates using NLP model
    let duplicateTickets = [];
    try {
        duplicates = await extractDuplicates(description, projectID);
        if (duplicates) {
            duplicates = duplicates.split(',');

            for (const duplicate of duplicates) {
                const [id, similarity] = duplicate.split(' ');
                const ticket = await TicketModel.findById(id, 'name');
                if (ticket) {
                    duplicateTickets.push({
                        _id: ticket._id,
                        name: ticket.name,
                        similarity: `${parseFloat(similarity)}%`
                    });
                }
            }

        }
    } catch (error) {
        console.error(`Error while extracting duplicates : ${error}`);
    }


    // predict developer to assign using ML model
    let developerDetails = [];
    try {
        let predictedDevelopers = await predictAssignee(description, projectID, `${category} Developer`);
        if (predictedDevelopers) {
            predictedDevelopers = predictedDevelopers.split(',');
            for (const id of predictedDevelopers) {
                const user = await UserModel.findById(id, 'fullName image');
                if (user) {
                    developerDetails.push({
                        _id: user._id,
                        fullName: user.fullName,
                        image: user.image
                    });
                }
            }
        }
    } catch (error) {
        console.error(`Error while predicting the developer assignee : ${error}`);
    }

    const newTicket = await TicketModel.create({ name, title, description, priority,category, projectID, images: imagePaths,reporterID:req.user.id });
    return res.status(status.CREATED).json({newTicket, predictedDevelopers:developerDetails, duplicates:duplicateTickets});
});

const searchForTicket = asyncHandler(async (req, res) => {
    const { projectID, keyword, ticketStatus, category, priority } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // validation
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
            // filtering the documents by the title field using a regular expression ($regex).
            title: { $regex: keyword, $options: 'i' } // 'i' for case-insensitive search
        };

        // Add optional filters if they are present
        if (ticketStatus) query.ticketStatus = ticketStatus;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        // Get total count of matching tickets
        const totalCount = await TicketModel.countDocuments(query);

        const tickets = await TicketModel.find(query)
            .populate('developerID', 'fullName image')
            .populate('reporterID', 'fullName image')
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(status.OK).json({
            totalCount,
            tickets,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(status.SERVER_ERROR).json({ message: "Failed to search for tickets" });
    }
});

const getTicket = asyncHandler( async (req, res) => {
    const { ticketID } = req.query;
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
    let {ticketID, developerID, title, description, category, ticketStatus , priority} = req.body;

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
    // validate developer
    if (!developerID || !mongoose.Types.ObjectId.isValid(developerID)){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Developer ID.");
    }

    // preprocessing for some strings
    ticketStatus = ticketStatusObject[ticketStatus.toUpperCase()];
    category = categories[category.toUpperCase()];
    priority = priorities[priority.toUpperCase()];

    // update the ticket
    const updatedTicket = await TicketModel.findByIdAndUpdate(
        ticketID,
        { developerID, title, description, category, ticketStatus , priority},
        { new: true }
    );

    // send a notification to the assigned developer
    const notificationBody = {
        content : `You are assigned by ${req.user.fullName} to work on ticket ${updatedTicket.name}`,
        userID : developerID,
        ticketID
    }
    const notification = new NotificationModel(notificationBody);
    await notification.save();
    res.status(status.OK).json(updatedTicket);
});

const deleteTicket = asyncHandler( async (req, res) =>{
    const {ticketID} = req.body;
    const removed = await TicketModel.findByIdAndDelete(ticketID);
    if(removed) res.status(status.OK).json({deleted: 1})
    else{
        res.status(status.NOT_FOUND);
        throw new Error("Ticket is not found.")
    }

})

const getTicketDuplicates = asyncHandler( async (req, res) =>{
    const {ticketID, projectID} = req.query;
    let ticketDescription = '';
    try{
        const ticket = await TicketModel.findById(ticketID)?.select('description');
        if (ticket) ticketDescription = ticket['description'];

        // extract duplicates using NLP model
        let duplicateTickets = [];
        try {
            duplicates = await extractDuplicates(ticketDescription, projectID);
            if (duplicates) {
                duplicates = duplicates.split(',');

                for (const duplicate of duplicates) {
                    const [id, similarity] = duplicate.split(' ');
                    if (id === ticketID) continue; // Skip this iteration if the id matches ticketID
                    const ticket = await TicketModel.findById(id, 'name');
                    if (ticket) {
                        duplicateTickets.push({
                            _id: ticket._id,
                            name: ticket.name,
                            similarity: `${parseFloat(similarity)}%`
                        });
                    }
                }

            }
            res.json(duplicateTickets);
        } catch (error) {
            console.error(`Error while extracting duplicates : ${error}`);
        }
    }catch(error){
        console.error(`Error while predicting the developer assignee : ${error}`);
    }

})

module.exports = {
    createTicket,
    searchForTicket,
    getTicket,
    updateTicket,
    deleteTicket,
    getTicketDuplicates
}