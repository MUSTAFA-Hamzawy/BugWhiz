const asyncHandler = require('express-async-handler');
const status = require('../helpers/statusCodes');
const CommentModel = require("../models/CommentModel");
const TicketModel = require("../models/TicketModel");
const mongoose = require('mongoose');

const createComment = asyncHandler(async (req, res) => {
    const { ticketID, comment } = req.body;
    const userRef = req.user.id;

    // Validate that the ticket exists
    if (!mongoose.Types.ObjectId.isValid(ticketID) || !await TicketModel.findById(ticketID)) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket is not found.");
    }

    // validate comment is not empty
    if (comment.trim() == ''){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Comment is required.");
    }

    const newComment = await CommentModel.create({ ticketID, comment, userRef });
    return res.status(status.CREATED).json(newComment);

});

const getTicketComments = asyncHandler( async (req, res) => {
    const { ticketID } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate that the ticket exists
    if (!mongoose.Types.ObjectId.isValid(ticketID) || !await TicketModel.findById(ticketID)) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Ticket is not found.");
    }

    // Fetch the comments with pagination
    const comments = await CommentModel.find({ ticketID })
        .populate('userRef', 'fullName image')
        .skip((page - 1) * limit)
        .limit(limit);

    res.status(status.OK).json(comments);
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentID, comment } = req.body;

    // Validate that the comment exists
    if (!mongoose.Types.ObjectId.isValid(commentID) || !await CommentModel.findById(commentID)) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Comment is not found.");
    }

    // validate comment is not empty
    if (comment.trim() == ''){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Comment can not be empty.");
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(
        commentID,
        { comment },
        { new: true }
    );
    res.status(status.OK).json(updatedComment);
});

const deleteComment = asyncHandler( async (req, res) =>{
    const {commentID} = req.body;

    // Validate that the comment exists
    if (!mongoose.Types.ObjectId.isValid(commentID) || !await CommentModel.findById(commentID)) {
        res.status(status.VALIDATION_ERROR);
        throw new Error("Comment is not found.");
    }

    const removed = await CommentModel.findByIdAndRemove(commentID);
    if(removed)
        res.status(status.OK).json({deleted: 1})
    else{
        res.status(status.NOT_FOUND);
        throw new Error("Comment is not found.")
    }

})

module.exports = {
    getTicketComments,
    createComment,
    deleteComment,
    updateComment,
}