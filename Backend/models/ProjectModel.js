const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, 'Project Name is required'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Id of the ticket is required."],
        ref: 'user'
    },
}, {
    timestamps: true
})


module.exports = mongoose.model('project', ProjectSchema);