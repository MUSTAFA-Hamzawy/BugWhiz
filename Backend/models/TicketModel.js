const mongoose = require('mongoose');

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
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    },
    category: {
        type: String,
        enum: ['None', 'Backend', 'Frontend', 'Security', 'Documentation'],
        default: 'None'
    },
    priority: {
        type: String,
        enum: ['P1', 'P2', 'P3', 'P4'],
        default: 'P1'
    },
    status: {
        type: String,
        enum: ['TODO', 'In Progress', 'Testing', 'Done'],
        default: 'TODO'
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
}, {
    timestamps: true
})


module.exports = mongoose.model('ticket', TicketSchema);