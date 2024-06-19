const asyncHandler = require('express-async-handler');
const TicketModel = require('../models/TicketModel');
const ProjectModel = require('../models/ProjectModel');
const status = require('../helpers/statusCodes');
const mongoose = require("mongoose");
const { categories, priorities, ticketStatusObject } = require('../config/conf');

const createTicket = asyncHandler(async (req, res) => {
    const { name, title, description, projectName, images } = req.body;

    // validate name
    if (!name || name.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket Name is required.");
    }
    if (await TicketModel.findOne({name})) {
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
    if (!projectName || projectName.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project Name is required.");
    }
    // check project exists
    const project = await ProjectModel.findOne({projectName}).select('_id');
    if (!project) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Project Name.");
    }

    const newTicket = await TicketModel.create({ name, title, description, projectID:project._id.toString(), images, reporterID:req.user.id });
    return res.status(status.CREATED).json(newTicket);
});

const searchForTicket = asyncHandler(async (req, res) => {
    const { projectID, keyword, ticketStatus, category, priority } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!projectID || !mongoose.Types.ObjectId.isValid(projectID)) {
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
            projectID: projectID,
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
    const {name} = req.body;
    const data = await TicketModel.findOne({name})
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
    let {name, projectName, developerID, title, description, category, ticketStatus , priority} = req.body;

    // check if the ticket exists
    const ticket = await TicketModel.findOne({name}).select('_id');
    if (!ticket){
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
    const project = await ProjectModel.findOne({projectName}).select('_id');
    if (!project) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid Project Name.");
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
        ticket._id.toString(),
        {projectID:project._id.toString(), developerID, title, description, category, ticketStatus , priority},
        { new: true }
    );
    res.status(status.OK).json(updatedTicket);
});

const deleteTicket = asyncHandler( async (req, res) =>{
    const {name} = req.body;
    const removed = await TicketModel.findOneAndRemove({name});
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