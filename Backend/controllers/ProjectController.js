const asyncHandler = require('express-async-handler');
const ProjectModel = require('../models/ProjectModel');
const status = require('../helpers/statusCodes');
const TicketModel = require("../models/TicketModel");

const createProject = asyncHandler(async (req, res) => {
    const { projectName } = req.body;

    if (!projectName){
        res.status(status.FORBIDDEN);
        throw new Error("Project name is required.");
    }

    const existingProject = await ProjectModel.findOne({ projectName });
    if (existingProject) {
        res.status(status.FORBIDDEN);
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
    try {
        const data = await ProjectModel.find({});
        res.status(status.OK).json(data);
    } catch (error) {
        throw new Error("Failed to load projects");
    }
})

const getProjectTickets = asyncHandler( async (req, res) => {
    const {projectID} = req.body;
    try {
        const tickets = await TicketModel.find({projectID});
        res.status(status.OK).json(tickets);
    } catch (error) {
        throw new Error("No tickets found.");
    }
})

const updateProject = asyncHandler(async (req, res) => {
    const { projectName, projectID } = req.body;

    if (!projectName ){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project name is required.");
    }

    // check if the project is exist
    const exist = await ProjectModel.findById(projectID);
    if (!exist){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Project not found.");
    }

    // Check if the project name is unique
    const existingProject = await ProjectModel.findOne({projectName});
    if (existingProject && existingProject._id.toString() !== projectID){
        res.status(status.FORBIDDEN);
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
    const removed = await ProjectModel.findByIdAndRemove(projectID);
    if(removed)
        res.status(status.OK).json({deleted: 1})
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