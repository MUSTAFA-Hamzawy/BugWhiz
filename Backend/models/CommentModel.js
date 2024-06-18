const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment:{
        type: String,
        required: [true, "comment is required."],
    },
    ticketID:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Id of the ticket is required."],
        ref: 'ticket'
    },
    userRef:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
}, {
    timestamps: true
})


module.exports = mongoose.model('comment', CommentSchema);