const connectDB = require('../config/connectDB');
require('dotenv').config();

// Models
const UserModel = require('../models/UserModel');
const ProjectModel = require('../models/ProjectModel');

// data files
const users = require('../database/userSeed');
const projects = require('../database/projectSeed');

const usersSeeding = async ()=>{
    UserModel.insertMany(users)
    .then(docs => console.log(`${docs.length} users have been inserted into the database.`))
    .catch(err => {
    console.error(err);
    console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    });
}
const projectsSeeding = async ()=>{
    ProjectModel.insertMany(projects)
    .then(docs => console.log(`${docs.length} projects have been inserted into the database.`))
    .catch(err => {
    console.error(err);
    console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    });
}


if(connectDB()){
    console.log('connected to db.');

    // seeding 
    usersSeeding();
    projectsSeeding();

}
