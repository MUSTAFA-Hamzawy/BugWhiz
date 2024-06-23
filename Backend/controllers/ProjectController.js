const asyncHandler = require('express-async-handler');
const ProjectModel = require('../models/ProjectModel');
const status = require('../helpers/statusCodes');
const TicketModel = require("../models/TicketModel");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");

const createProject = asyncHandler(async (req, res) => {
    const { projectName } = req.body;

    if (!projectName || projectName.trim() === '') {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project name is required.");
    }

    const duplicated = await ProjectModel.findOne({ projectName, createdBy:req.user.id });
    if (duplicated) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project name is taken before.");
    }

    try {
        // Create new project
        const newProject = await ProjectModel.create({ projectName, createdBy: req.user.id });

        // Add this project to the user's projects
        await UserModel.findByIdAndUpdate(
            req.user.id,
            { $push: { projects: newProject._id } },
            { new: true, useFindAndModify: false }
        );

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
        const user = await UserModel.findById(req.user.id).select('projects');
        const data = await ProjectModel.find({ _id: { $in: user.projects } })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(status.OK).json(data);
    } catch (error) {
        throw new Error("Failed to load projects");
    }
})

const groupTicketsByStatus = asyncHandler((tickets) => {
    return tickets.reduce((accumulator, ticket) => {
        const {ticketStatus} = ticket;
        if (!accumulator[ticketStatus]) accumulator[ticketStatus] = [];
        accumulator[ticketStatus].push(ticket);
        return accumulator;
    }, {});
})

const getProjectTickets = asyncHandler( async (req, res) => {
    const {projectID} = req.body;

    if (!await ProjectModel.findById(projectID)){
        res.status(status.NOT_FOUND);
        throw new Error("Project is not found.");
    }
    try {
        const tickets = await TicketModel.find({projectID}).
        select("title name developerID ticketStatus").
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
        throw new Error("Project new name is required.");
    }

    // check if the project exists
    if (!mongoose.Types.ObjectId.isValid(projectID) || !await ProjectModel.findById(projectID)){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project is not found.");
    }

    // Check if the project name is unique
    const existingProject = await ProjectModel.findOne({projectName, createdBy:req.user.id});
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
    if (!await ProjectModel.findById(projectID)){
        res.status(status.NOT_FOUND);
        throw new Error("Project not found.");
    }

    const removed = await ProjectModel.findByIdAndRemove(projectID);
    if(removed){
        res.status(status.OK).json({deleted: 1})
    }
    else{
        res.status(status.NOT_FOUND);
        throw new Error("Project is not found.")
    }

    // TODO: need to remove all tickets that associated to this project
    // TODO: need to remove all comments associated to each ticket that deleted
    // TODO: need to remove this projectID from the user projects list

})

const addUserToProject = asyncHandler( async (req, res) =>{
    const {projectID, username} = req.body;

    try {
        // Check if the project exists
        const project = await ProjectModel.findById(projectID);
        if (!project) {
            res.status(status.NOT_FOUND).json({ message: 'Project not found' });
            return;
        }

        // Check if the user exists
        const user = await UserModel.findOne({ username });
        if (!user) {
            res.status(status.NOT_FOUND).json({ message: 'User not found' });
            return;
        }

        // Check if the user already has this project
        if (user.projects.includes(project._id)) {
            res.status(status.VALIDATION_ERROR).json({ message: 'User already assigned to this project' });
            return;
        }

        // Add the project's ID to the user's projects array
        user.projects.push(project._id);
        await user.save();

        res.status(status.OK).json({ message: 'Project successfully added to user' });
    } catch (error) {
        res.status(status.SERVER_ERROR).json({ message: 'Failed to add project to user' });
        console.error(error);
    }


})

module.exports = {
    createProject,
    getProjects,
    getProjectTickets,
    updateProject,
    deleteProject,
    addUserToProject
}