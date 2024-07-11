const request = require('supertest');
const mongoose = require('mongoose');
const connectDB = require('../config/connectDB');
const app = require('../server');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const HOST = 'localhost';
const PORT = process.env.PORT || 3000;

jest.mock('../middlewares/ValidateTokenMiddleware', () => (req, res, next) => {
    req.user = { id: 'mockUserId' }; // Set a mock user ID
    next();
});

describe('User Controller', () => {
    beforeAll(async () => {
        await connectDB();
        console.log('MongoDB connected');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const userData = {
                "fullName": "Mustafa Mahmoud",
                "email" : "mustafa.test@gmail.com",
                "username": "hamzawytest1",
                "phoneNumber": "+201121366579",
                "password": "Open1234",
                "jobTitle": "Backend Developer"
            };

            const response = await request(app)
                .post('/api/user/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.fullName).toBe(userData.fullName);
            expect(response.body.email).toBe(userData.email);
            expect(response.body.username).toBe(userData.username);
        });
    });

    describe('POST /login', () => {
        it('should login the user and return a token', async () => {
            const password = 'Open1234';
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await UserModel.create({
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                username: 'johndoe',
                phoneNumber: '+1234567890',
                password: hashedPassword,
                jobTitle: 'Developer',
            });

            const response = await request(app)
                .post('/api/user/login')
                .send({
                    emailOrUsername: user.email,
                    password: password,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
    });

    describe('GET /profile', () => {
        it('should return the user profile', async () => {
            // Register a new user
            const userData = {
                "fullName": "Mustafa Mahmoud",
                "email" : "mustafa.test2@gmail.com",
                "username": "hamzawytest21",
                "phoneNumber": "+201121366579",
                "password": "Open1234",
                "jobTitle": "Backend Developer"
            };

            const registerResponse = await request(app)
                .post('/api/user/register')
                .send(userData);

            expect(registerResponse.status).toBe(201);

            // Retrieve the registered user's profile
            const profileResponse = await request(app)
                .get('/api/user/profile')
                .set('Authorization', `Bearer mockToken`);

            expect(profileResponse.status).toBe(200);
        });
    });

});
