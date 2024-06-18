const asyncHandler = require('express-async-handler');
const status = require('../helpers/statusCodes');
const CommentModel = require("../models/CommentModel");

const createComment = asyncHandler(async (req, res) => {
    const { ticketID, comment } = req.body;
    const userRef = req.user.id;

    const newComment = await CommentModel.create({ ticketID, comment, userRef });
    return res.status(status.CREATED).json(newComment);

});

const getTicketComments = asyncHandler( async (req, res) => {
    const { ticketID } = req.body;
    const comments = await CommentModel.find({ticketID}).populate('userRef', 'fullName username jobTitle image');
    res.status(status.OK).json(comments);
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentID, comment } = req.body;
    const updatedComment = await CommentModel.findByIdAndUpdate(
        commentID,
        { comment },
        { new: true }
    );
    if (updatedComment){
        res.status(status.OK).json(updatedComment);
    }else{
        res.status(status.NOT_FOUND);
        throw new Error("Comment not found.");
    }
});

const deleteComment = asyncHandler( async (req, res) =>{
    const {commentID} = req.body;
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