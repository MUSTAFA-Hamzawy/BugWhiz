const asyncHandler = require('express-async-handler');
const ProjectModel = require('../models/ProjectModel');
const NotificationModel = require('../models/NotificationModel');
const status = require('../helpers/statusCodes');
const TicketModel = require("../models/TicketModel");
const CommentModel = require("../models/CommentModel");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");
const {validateNotEmpty} = require('../helpers/utils');

/**
 * Validates if a project exists by its ID.
 *
 * @async
 * @function validateProjectExists
 * @param {string} projectID - The ID of the project to validate.
 * @returns {Promise<Object>} - Returns the project if it exists.
 * @throws {Error} - Throws an error if the project ID is invalid or the project is not found.
 */
const validateProjectExists = async (projectID) => {
    const project = await ProjectModel.findById(projectID);
    if (!mongoose.Types.ObjectId.isValid(projectID) || !project) {
        throw new Error("Project is not found.");
    }
    return project;
};

/**
 * Validates if a project name is unique for a given user.
 *
 * @async
 * @function validateProjectNameUnique
 * @param {string} projectName - The name of the project to validate.
 * @param {string} userID - The ID of the user creating the project.
 * @param {string} [projectID=null] - The ID of the project to exclude from the check (optional).
 * @returns {Promise<void>} - Returns nothing if the project name is unique.
 * @throws {Error} - Throws an error if the project name is already taken by the user.
 */
const validateProjectNameUnique = async (projectName, userID, projectID = null) => {
    const existingProject = await ProjectModel.findOne({ projectName, createdBy: userID });
    if (existingProject && (!projectID || existingProject._id.toString() !== projectID)) {
        throw new Error("Project name is taken before.");
    }
};

const createProject = asyncHandler(async (req, res) => {
    const { projectName } = req.body;

    try {
        validateNotEmpty(projectName, 'Project Name');
        await validateProjectNameUnique(projectName, req.user.id);

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
        res.status(status.VALIDATION_ERROR);
        throw new Error(error.message);
    }
});

const getProjects = asyncHandler( async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const user = await UserModel.findById(req.user.id).select('projects');

        // Get total count of matching projects
        const totalCount = await ProjectModel.countDocuments({ _id: { $in: user.projects } });

        // preparing the data for response
        const data = await ProjectModel.find({ _id: { $in: user.projects } })
            .populate("createdBy", 'fullName image')
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(status.OK).json({
            totalCount,
            projects: data,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        throw new Error("Failed to load projects");
    }
})

const getProjectTickets = asyncHandler( async (req, res) => {
    const {projectID} = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        await validateProjectExists(projectID);

        // Get total count of matching tickets
        const totalCount = await TicketModel.countDocuments({ projectID });

        const tickets = await TicketModel.find({projectID}).
        select("title name developerID ticketStatus priority category createdAt updatedAt").
        populate("developerID", "fullName image").
        populate("reporterID", "fullName image")
        .skip((page - 1) * limit)
        .limit(limit);

        res.status(status.OK).json({
            totalCount,
            tickets,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("No tickets found.");
    }
})

const updateProject = asyncHandler(async (req, res) => {
    const { projectName, projectID } = req.body;

    try {
        // validation
        validateNotEmpty(projectName, 'Project new name');
        await validateProjectExists(projectID);
        await validateProjectNameUnique(projectName, req.user.id, projectID);

        // Update the project
        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectID,
            { projectName },
            { new: true }
        );
        res.status(status.OK).json(updatedProject);
    } catch (error) {
        res.status(status.VALIDATION_ERROR);
        throw new Error(error.message);
    }
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectID } = req.body;

    try {
        await validateProjectExists(projectID);

        const removed = await ProjectModel.findByIdAndDelete(projectID);
        if (removed) {
            // Find and delete all tickets associated with the project
            const tickets = await TicketModel.find({ projectID });
            for (const ticket of tickets) {
                // Find and delete all comments associated with each ticket
                await CommentModel.deleteMany({ ticketID: ticket._id });
            }
            // Delete all tickets associated with the project
            await TicketModel.deleteMany({ projectID });

            // Remove this projectID from the user's projects list
            await UserModel.updateMany(
                { projects: projectID },
                { $pull: { projects: projectID } }
            );

            res.status(status.OK).json({ deleted: 1 });
        } else {
            res.status(status.NOT_FOUND).json({ message: "Project is not found." });
        }

    } catch (error) {
        res.status(status.NOT_FOUND);
        throw new Error(error.message);
    }
});

const addUserToProject = asyncHandler( async (req, res) =>{
    const {projectID, username} = req.body;

    try {
        // Check if the project exists
        const project = await validateProjectExists(projectID);
        // Check if the user exists
        const user = await UserModel.findOne({ username });
        if (!user) {
            res.status(status.NOT_FOUND).json({ message: 'User not found' });
            return;
        }

        // Check if the user already has this project
        if (user.projects.includes(projectID)) {
            res.status(status.VALIDATION_ERROR).json({ message: 'User already assigned to this project' });
            return;
        }

        // Add the project's ID to the user's projects array
        user.projects.push(projectID);
        await user.save();

        // send a notification to inform user who has been added to the project
        const notificationBody = {
            content : `You are assigned by ${req.user.fullName} to work on project ${project.projectName}`,
            userID : user._id.toString(),
            projectID: project._id.toString(),
            projectName : project.projectName
        }
        const notification = new NotificationModel(notificationBody);
        await notification.save();

        res.status(status.OK).json({ message: 'Project successfully added to user' });
    } catch (error) {
        res.status(status.SERVER_ERROR).json({ message: 'Failed to add project to user' });
        console.error(error);
    }


})

const getAnalytics = asyncHandler(async (req, res) => {
    const { projectID } = req.query;

    try {
        // Check if the project exists
        if (!await ProjectModel.findById(projectID)) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // 1. Total Tickets
        const totalTickets = await TicketModel.countDocuments({ projectID });

        // 2. Ticket Status
        const ticketStatusAggregation = await TicketModel.aggregate([
            { $match: { projectID: new mongoose.Types.ObjectId(projectID) } },
            { $group: { _id: "$ticketStatus", count: { $sum: 1 } } }
        ]);

        const ticketStatus = ticketStatusAggregation.reduce((acc, status) => {
            acc[status._id] = status.count;
            return acc;
        }, {});

        // 3. Ticket Priority
        const ticketPriorityAggregation = await TicketModel.aggregate([
            { $match: { projectID:new mongoose.Types.ObjectId(projectID) } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        const ticketPriority = ticketPriorityAggregation.reduce((acc, priority) => {
            acc[priority._id] = priority.count;
            return acc;
        }, {});

        // 4. Ticket Category
        const ticketCategoryAggregation = await TicketModel.aggregate([
            { $match: { projectID: new mongoose.Types.ObjectId(projectID) } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        const ticketCategory = ticketCategoryAggregation.reduce((acc, category) => {
            acc[category._id] = category.count;
            return acc;
        }, {});

        // 5. Developers
        const developersAggregation = await TicketModel.aggregate([
            { $match: { projectID: new mongoose.Types.ObjectId(projectID) } },
            { $group: {
                    _id: "$developerID",
                    ticketsAssigned: { $sum: 1 },
                    todo: { $sum: { $cond: [{ $eq: ["$ticketStatus", "TODO"] }, 1, 0] } },
                    progress: { $sum: { $cond: [{ $eq: ["$ticketStatus", "Progress"] }, 1, 0] } },
                    done: { $sum: { $cond: [{ $eq: ["$ticketStatus", "Done"] }, 1, 0] } }
                }},
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "developer" } },
            { $unwind: "$developer" },
            { $project: {
                    _id: 1,
                    ticketsAssigned: 1,
                    todo: 1,
                    progress: 1,
                    done: 1,
                    "developer._id": 1,
                    "developer.fullName": 1,
                    "developer.image": 1
                }}
        ]);

        const developers = developersAggregation.map(dev => ({
            _id: dev._id,
            fullName: dev.developer.fullName,
            image: dev.developer.image,
            ticketsAssigned: dev.ticketsAssigned,
            todo: dev.todo,
            progress: dev.progress,
            done: dev.done
        }));

        res.status(200).json({
            totalTickets,
            ticketStatus,
            ticketPriority,
            ticketCategory,
            developers
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to get project analytics', error: error.message });
    }
});

const getProjectDevelopers = asyncHandler( async (req, res) => {
    const {projectID} = req.query;

    try {
        await validateProjectExists(projectID);

        // Find users who are working on this project
        const developers = await UserModel.find({ projects: projectID }, 'fullName _id image');

        // Respond with the developers' details
        res.status(200).json(developers);

    } catch (error) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("No developers found.");
    }
})

module.exports = {
    createProject,
    getProjects,
    getProjectTickets,
    updateProject,
    deleteProject,
    addUserToProject,
    getAnalytics,
    getProjectDevelopers
}