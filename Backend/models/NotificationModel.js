const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    ticketID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket',
        default: null,
    },
    projectID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        default: null,
    },
    projectName: {
        type: String,
        default: null,
    },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true
})


module.exports = mongoose.model('notification', NotificationSchema);