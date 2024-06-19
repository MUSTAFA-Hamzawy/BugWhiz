const mongoose = require('mongoose');
const { categories, priorities, ticketStatusObject } = require('../config/conf');

const TicketSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Ticket name is taken before'],
        required: [true, 'Ticket name is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    images: {
        type: [String], // Array of strings for image paths
        validate: {
            validator: function(value) {
                return Array.isArray(value);
            },
            message: 'Images should be an array of strings'
        },
        default: []
    },
    category: {
        type: String,
        enum: Object.values(categories), // Use enum values from config
        default: categories.DEFAULT
    },
    priority: {
        type: String,
        enum: Object.values(priorities), // Use enum values from config
        default: priorities.DEFAULT
    },
    ticketStatus: {
        type: String,
        enum: Object.values(ticketStatusObject), // Use enum values from config
        default: ticketStatusObject.DEFAULT
    },
    projectID:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Id of the project is not provided."],
        ref: 'project'
    },
    developerID: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'user'
    },
    reporterID: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'user'
    },
}, {
    timestamps: true
})


module.exports = mongoose.model('ticket', TicketSchema);