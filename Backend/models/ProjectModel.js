const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, 'Project Name is required'],
        unique: true
    },
}, {
    timestamps: true
})


module.exports = mongoose.model('project', ProjectSchema);