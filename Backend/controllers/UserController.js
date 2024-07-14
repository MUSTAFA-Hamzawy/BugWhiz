const asyncHandler = require('express-async-handler');
const UserModel = require('../models/UserModel');
const TokenBlackListModel = require('../models/TokenBlackListModel');
const bcrypt = require('bcrypt');
const status = require('../helpers/statusCodes');
const jwt = require('jsonwebtoken');

/**
 * Validates the data used for login.
 *
 * @async
 * @function validateLoginData
 * @param {Object} data - The data to validate.
 * @param {string} data.emailOrUsername - The email or username provided by the user.
 * @param {string} data.password - The password provided by the user.
 * @returns {Promise<string|number>} - Returns an error message if validation fails, otherwise returns 0.
 */
const validateLoginData = async (data)=>{
    const {emailOrUsername, password} = data;

    if(!emailOrUsername) return "Email is required.";
    if(!password) return "Password is required.";


    return 0;
}

/**
 * Generates a JWT token.
 *
 * @function generateToken
 * @param {Object} userData - The user data to include in the token payload.
 * @param {number} [tokenType=1] - The type of token to generate (1 for access token, 2 for refresh token).
 * @returns {string} - The generated JWT token.
 */
const generateToken = (userData, tokenType = 1)=>{
    const SECRET_KEY = tokenType == 1 ? process.env.JWT_ACCESS_TOKEN_KEY : process.env.JWT_REFRESH_TOKEN_KEY;
    const EXPIRED_TIME = tokenType == 1 ? process.env.ACCESS_TOKEN_EXPIRED_TIME : process.env.REFRESH_TOKEN_EXPIRED_TIME;
    return jwt.sign(
        // Payload
        {
            id: userData.id,
            fullName: userData.fullName,
            username: userData.username,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            jobTitle: userData.jobTitle,
            image: userData.image,
            headerImage: userData.headerImage,
        },
        SECRET_KEY,
        { expiresIn: EXPIRED_TIME}
    )
}

/**
 * Validates the data used for registration.
 *
 * @async
 * @function validateRegistrationData
 * @param {Object} data - The data to validate.
 * @param {string} data.fullName - The full name provided by the user.
 * @param {string} data.email - The email provided by the user.
 * @param {string} data.username - The username provided by the user.
 * @param {string} data.phoneNumber - The phone number provided by the user.
 * @param {string} data.password - The password provided by the user.
 * @param {string} data.jobTitle - The job title provided by the user.
 * @returns {Promise<Object>} - Returns an object containing any validation errors.
 */
const validateRegistrationData = async(data)=>
{

    const{fullName, email, username, phoneNumber, password, jobTitle} = data;
    let errors = {};


    username.trim();

    // validate password
    /*
    * must contain one or more uppercase letter
    * must be alphanumeric
    * must be at least 8 characters
    * no need to use special character ( optional )
     */
    // (?=.*[A-Z]) : This is a positive lookahead that ensures at least one uppercase letter is present in the password.
    // (?=.*\d) : This is another positive lookahead that ensures at least one digit is present in the password.
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z0-9]{8,}$/;
    if(password && !passwordRegex.test(password))
        errors.password =  "Password is not strong enough.";

    // validate the name
    const nameRegex = /^(?!.*\s{2})[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
    if(!fullName) errors.fullName =  "Full name is required.";
    else {
        fullName.trim();
        if(!nameRegex.test(fullName))
            errors.fullName =  "Full name must contain only letters.";
    }

    // validate the job title
    if(!jobTitle) errors.jobTitle =  "Job Title is required.";
    else {
        jobTitle.trim();
        if(!nameRegex.test(jobTitle))
            errors.jobTitle =  "Job Title must contain only letters.";
    }

    // Checking if user have already registered
    if(!email) errors.email = "Email is required";
    else{
        email.trim();

        // validate email using regex
        const emailRegex = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if(!emailRegex.test(email)) errors.email = "This email is invalid.";
        else if(await UserModel.findOne({email})) errors.email  = "This email have been taken.";
    }



    // validate username
    if(!username) errors.username = "Username is required";
    else{
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if(!usernameRegex.test(username)) errors.username = "This username is invalid."
        else if(await UserModel.findOne({username})) errors.username = "This username is taken.";
    }

    // validate phoneNumber
    const phoneNumberRegex = /^(\+\d{1,15}|\d{1,15})$/;
    if(!phoneNumberRegex.test(phoneNumber)) errors.phoneNumber = "Invalid phone number.";

    return errors;
}

const getProfile = asyncHandler( async (req, res) => {
    const user = await UserModel.findById(req.user.id.toString()).populate('projects', 'projectName');
    res.status(status.OK).json(user);
})

const getUsers = asyncHandler( async (req, res) => {
    const users = await UserModel.find({}).select('fullName image');
    res.status(status.OK).json(users);
})

const updateProfile = asyncHandler( async (req, res) => {
    const {fullName, phoneNumber, jobTitle} = req.body;

    // validate fullName
    // (?!.*\s{2}) : This is a negative lookahead that ensures the string does not contain two consecutive spaces anywhere.
    // (?:\s[a-zA-Z]+)* : This is a non-capturing group that matches zero or more occurrences of a space followed by one or more alphabetic characters.
    const nameRegex = /^(?!.*\s{2})[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
    if(fullName && !nameRegex.test(fullName.trim())){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Full Name must contain only letters.");
    }

    // validate the job title
    if(jobTitle && !nameRegex.test(jobTitle.trim())){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Job Title must contain only letters.");
    }

    // validate phoneNumber
    const phoneNumberRegex = /^(\+\d{1,15}|\d{1,15})$/;
    if(phoneNumber && !phoneNumberRegex.test(phoneNumber.trim())){
        res.status(status.VALIDATION_ERROR);
        throw new Error("Invalid phone number.");
    }

    // Check if images were uploaded
    if (req.files ){
        const { image, headerImage } = req.files;
        if (image && image.length > 0) req.body.image = `uploads/${image[0].filename}`;
        if (headerImage && headerImage.length > 0) req.body.headerImage = `uploads/${headerImage[0].filename}`;
    }

    // update the user data
    const updated = await UserModel.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true }
    );
    res.status(status.OK).json(updated);
})

const login = asyncHandler( async (req, res)=>{
    const {emailOrUsername, password} = req.body;
    const error = await validateLoginData({emailOrUsername, password});

    if(error != 0){
        res.status(status.VALIDATION_ERROR);
        throw new Error(JSON.stringify(error));
    }else{
        // validate the login credentials
        emailOrUsername.trim();
        const user = emailOrUsername.indexOf('@') == -1 ? await UserModel.findOne({username: emailOrUsername}) : await UserModel.findOne({email: emailOrUsername})
        const passwordIsCorrect = user && await bcrypt.compare(password, user.password);
        if(!user || !passwordIsCorrect){
            res.status(status.NOT_FOUND);
            throw new Error(JSON.stringify("Incorrect username or password."));
        }     

        const token = generateToken(user);
        res.status(status.OK);
        res.json({token});
    }



})

const register = asyncHandler( async (req, res)=>{
    const{fullName, email, username, phoneNumber, password, image, jobTitle} = req.body;

    // validation
    const errors = await validateRegistrationData({fullName, email, username, phoneNumber, password, image, jobTitle});
    if(Object.keys(errors).length > 0){
        res.status(status.VALIDATION_ERROR);
        throw new Error(JSON.stringify(errors));
    }

    // encrypting the password
    const SALT_ROUNDS = 10;
    const encryptedPSWD = await bcrypt.hash(password, SALT_ROUNDS);
    const createdUser = await UserModel.create({fullName, email, username, phoneNumber, password: encryptedPSWD, image, jobTitle});
    if(createdUser)
        res.status(status.CREATED).json(createdUser);
    else {
        res.status(status.NOT_FOUND);
        throw new Error(JSON.stringify("Failed to register this user."))
    }

}
);

const logout = asyncHandler( async (req, res)=>{
    const authHeader = req.headers.Authorization || req.headers.authorization;
    const token = authHeader.split(' ')[1];

    // Just add this token to the TokenBlackList
    await TokenBlackListModel.create({token});
    res.status(status.OK);
    res.json({"msg": "Logged out."});
}
);

module.exports = {
    getProfile,
    login,
    register,
    logout,
    updateProfile,
    getUsers
}