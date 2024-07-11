const asyncHandler = require('express-async-handler');
const status = require('../helpers/statusCodes');
const {validateNotEmpty} = require('../helpers/utils');
const CommentModel = require("../models/CommentModel");
const TicketModel = require("../models/TicketModel");
const mongoose = require('mongoose');
const { formatDistanceToNow } = require('date-fns');

/**
 * Validates the existence of a ticket in the database.
 *
 * @async
 * @function validateTicketExists
 * @param {string} ticketID - The ID of the ticket to validate.
 * @throws {Error} Will throw an error if the ticket is not found.
 * @returns {Promise<void>} - Resolves if the ticket exists, otherwise throws an error.
 *
 */
const validateTicketExists = async (ticketID) => {
    if (!await TicketModel.findById(ticketID)) {
        throw new Error("Ticket is not found.");
    }
};

/**
 * Validates the existence of a comment in the database.
 *
 * @async
 * @function validateCommentExists
 * @param {string} commentID - The ID of the comment to validate.
 * @throws {Error} Will throw an error if the comment is not found.
 * @returns {Promise<void>} - Resolves if the comment exists, otherwise throws an error.
 *
 */
const validateCommentExists = async (commentID) => {
    if (!await CommentModel.findById(commentID)) {
        throw new Error("Comment is not found.");
    }
};

const createComment = asyncHandler(async (req, res) => {
    const { ticketID, comment } = req.body;
    const userID = req.user.id;

    try {
        // validation
        await validateTicketExists(ticketID);
        validateNotEmpty(comment, 'Comment');

        // create the comment
        const newComment = await CommentModel.create({ ticketID, comment, userID });

        const responseComment = {
            ...newComment.toObject(),
            createdAt : formatDistanceToNow(new Date(newComment.createdAt), { addSuffix: true }),
            updatedAt : formatDistanceToNow(new Date(newComment.updatedAt), { addSuffix: true })
        };
        res.status(status.CREATED).json(responseComment);
    } catch (error) {
        res.status(status.VALIDATION_ERROR);
        throw new Error(error.message);
    }
});

const getTicketComments = asyncHandler( async (req, res) => {
    const { ticketID } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        // validation
        await validateTicketExists(ticketID);

        // Fetch the comments with pagination
        const comments = await CommentModel.find({ ticketID  })
            .populate('userID', 'fullName image')
            .skip((page - 1) * limit)
            .limit(limit);

        // Modify createdAt and updatedAt for each comment
        const formattedComments = comments.map(comment => {
            return {
                ...comment.toObject(),
                createdAt : formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }),
                updatedAt : formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })
            };
        });
        res.status(status.OK).json(formattedComments);
    } catch (error) {
        res.status(status.VALIDATION_ERROR);
        throw new Error(error.message);
    }

})

const updateComment = asyncHandler(async (req, res) => {
    const { commentID, comment } = req.body;

    try {
        // validation
        await validateCommentExists(commentID);
        validateNotEmpty(comment, 'Comment');

        // update the comment
        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentID,
            { comment },
            { new: true }
        );
        const responseComment = {
            ...updatedComment.toObject(),
            createdAt : formatDistanceToNow(new Date(updatedComment.createdAt), { addSuffix: true }),
            updatedAt : formatDistanceToNow(new Date(updatedComment.updatedAt), { addSuffix: true })
        };
        res.status(status.OK).json(responseComment);
    } catch (error) {
        res.status(status.VALIDATION_ERROR).json({ message: error.message });
    }
});

const deleteComment = asyncHandler( async (req, res) =>{
    const {commentID} = req.body;
    try {
        await validateCommentExists(commentID);
        await CommentModel.findByIdAndDelete(commentID);
        res.status(status.OK).json({deleted: 1})
    } catch (error) {
        res.status(status.VALIDATION_ERROR);
        throw new Error(error.message);
    }

})

module.exports = {
    getTicketComments,
    createComment,
    deleteComment,
    updateComment,
}