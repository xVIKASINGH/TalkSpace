const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const { createServer } = require("node:http");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const { verifytoken } = require("./Middleware/Auth");
const ExpressError = require("./Middleware/ExpressError");
const server = createServer(app);
const { connectToServer } = require('./Controllers/Socketmanager');
const io = connectToServer(server);  
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/', authRoutes);

server.listen(3000,'0.0.0.0', async () => {
    console.log("Server is listening on port 3000");
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed:", error.message);
    }
});

app.all("*", (req, res, next) => {
    return next(new ExpressError(400, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Server error, please try again later." } = err;
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
