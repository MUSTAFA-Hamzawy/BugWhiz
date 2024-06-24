// Importing required modules
const express = require('express');
const connectDB = require('./config/connectDB');
const ErrorHandlerMiddleware = require('./middlewares/ErrorHandlerMiddleware');
const status = require('./helpers/statusCodes');
const cors = require('cors');
// Import route files
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const ticketRoutes = require('./routes/ticket');
const commentRoutes = require('./routes/comment');

// Loading env file
require('dotenv').config();

const app = express();

app.use(cors(
    {
        origin: ["https://bugwhiz-mustafa-hamzawys-projects.vercel.app"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }
));


// Listening for any request, if connected to db successfully
const PORT = process.env.PORT || 3005;
if(connectDB()){
    console.log('connected to db.');

    // Listening for any request, if connected to db successfully
    app.listen(PORT, ()=>{
        console.log(`Server is running on port : ${PORT}`);
    })
}

app.use(express.json()) // Built-in Middleware To parse any request body



/***************************   Routes  *************************************/
app.get('/', (req, res) => {res.json("Hello Bugwhiz.")})
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/comment', commentRoutes);

/***************************   Middlewares  *************************************/
app.use(ErrorHandlerMiddleware);


// Fallback route for any non-existing requested routes.
app.all('*', (req, res)=>{
    res.status(status.NOT_FOUND);
    throw new Error("Not found route.");
});



