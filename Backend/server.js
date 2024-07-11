// Importing required modules
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/connectDB');
const ErrorHandlerMiddleware = require('./middlewares/ErrorHandlerMiddleware');
const status = require('./helpers/statusCodes');

// Import route files
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const ticketRoutes = require('./routes/ticket');
const commentRoutes = require('./routes/comment');
const notificationRoutes = require('./routes/notification');

// Loading env file
require('dotenv').config();

const app = express();

// Use the cors middleware
app.use(cors());
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json()); // Built-in Middleware To parse any request body

/***************************   Routes  *************************************/
app.get('/', async (req, res) => { res.send("Testing Bugwhiz (-_-).") });
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/notify', notificationRoutes);

/***************************   Middlewares  *************************************/
app.use(ErrorHandlerMiddleware);

// Fallback route for any non-existing requested routes.
app.all('*', (req, res) => {
    res.status(status.NOT_FOUND);
    throw new Error("Not found route.");
});

// Connect to database and start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        const PORT = process.env.PORT || 3005;
        app.listen(PORT, () => {
            console.log(`Server is running on port : ${PORT}`);
        });
    }).catch(err => {
        console.error('Database connection failed', err);
    });
}

module.exports = app;