const asyncHandler = require('express-async-handler');
const ProjectModel = require('../models/ProjectModel');
const status = require('../helpers/statusCodes');
const TicketModel = require("../models/TicketModel");
const mongoose = require("mongoose");

const createProject = asyncHandler(async (req, res) => {
    const { projectName } = req.body;

    if (!projectName || projectName.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project name is required.");
    }

    const duplicated = await ProjectModel.findOne({ projectName });
    if (duplicated) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project name is taken before.");
    }

    try {
        // Create new project
        const newProject = await ProjectModel.create({ projectName });
        return res.status(status.CREATED).json(newProject);

    } catch (error) {
        res.status(status.SERVER_ERROR);
        throw new Error("Failed to create project.");
    }
});

const getProjects = asyncHandler( async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const data = await ProjectModel.find({}).skip((page - 1) * limit).limit(limit);
        res.status(status.OK).json(data);
    } catch (error) {
        throw new Error("Failed to load projects");
    }
})

const groupTicketsByStatus = asyncHandler((tickets) => {
    const groupedTickets = tickets.reduce((accumulator, ticket) => {
        const { status } = ticket;
        if (!accumulator[status]) accumulator[status] = [];
        accumulator[status].push(ticket);
        return accumulator;
    }, {});
    return groupedTickets;
})

const getProjectTickets = asyncHandler( async (req, res) => {
    const {projectID} = req.body;
    try {
        const tickets = await TicketModel.find({projectID}).
        select("title name developerID status").
        populate("developerID", "fullName image");

        // Group tickets by status
        const groupedTickets = await groupTicketsByStatus(tickets);
        res.status(status.OK).json(groupedTickets);
    } catch (error) {
        throw new Error("No tickets found.");
    }
})

const updateProject = asyncHandler(async (req, res) => {
    const { projectName, projectID } = req.body;

    if (!projectName || projectName.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project name is required.");
    }

    // check if the project exists
    if (!mongoose.Types.ObjectId.isValid(projectID) || !await ProjectModel.findById(projectID)){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project not found.");
    }

    // Check if the project name is unique
    const existingProject = await ProjectModel.findOne({projectName});
    if (existingProject && existingProject._id.toString() !== projectID){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project name is taken before.");
    }

    try {
        // Update the project
        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectID,
            { projectName },
            { new: true }
        );
        res.status(status.OK).json(updatedProject);
    } catch (error) {
        throw new Error("Failed to update project.");
    }
});

const deleteProject = asyncHandler( async (req, res) =>{
    const {projectID} = req.body;

    // check if the project exists
    if (!mongoose.Types.ObjectId.isValid(projectID) || !await ProjectModel.findById(projectID)){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project not found.");
    }

    const removed = await ProjectModel.findByIdAndRemove(projectID);
    if(removed) res.status(status.OK).json({deleted: 1})
    else{
        res.status(status.NOT_FOUND);
        throw new Error("Project is not found.")
    }

})

module.exports = {
    createProject,
    getProjects,
    getProjectTickets,
    updateProject,
    deleteProject,

}