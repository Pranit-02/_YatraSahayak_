import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
const cors = require('cors');
import { spawn } from 'child_process';

// Private route authorization config
// import privateRouteConfig from "./config/route.config";
// import googleAuthConfig from "./config/google.config";

// Database connection
import ConnectDB from "./database/connection";

// import Auth from "./api/auth";
// import User from "./api/user";

dotenv.config();

// privateRouteConfig(passport);
// googleAuthConfig(passport);

const yatra = express();
const corsOptions = {
  origin: 'http://127.0.0.1:5173',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
};

// Apply CORS middleware
yatra.use(cors(corsOptions));

yatra.use(express.json());
yatra.use(session({ secret: process.env.JWTSECRET }));
yatra.use(passport.initialize());
yatra.use(passport.session());

yatra.post('/generate-itinerary', (req, res) => {
  // Get the input data = the request body
  const inputData = req.body;

  // Execute the Python script and pass the input data as an argument
  const pythonProcess = spawn('python', ['./python_model/generate_itinerary.py', JSON.stringify(inputData)]);

  // Collect data = the Python script's stdout
  pythonProcess.stdout.on('data', (data) => {
    const result = JSON.parse(data);
    res.json(result);
  });

  // Handle any errors
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error = Python script: ${data}`);
    res.status(500).json({ error: 'An error occurred while generating the itinerary.' });
  });
});

// yatra.post('/transportation-check', (req, res) => {
//   // Get the input data = the request body
//   const inputData = req.body;

//   // Execute the Python script and pass the input data as an argument
//   const pythonProcess = spawn('python', ['./python_model/transportation_check.py', JSON.stringify(inputData)]);

//   // Collect data = the Python script's stdout
//   pythonProcess.stdout.on('data', (data) => {
//     const result = JSON.parse(data);
//     res.json(result);
//   });

//   // Handle any errors
//   pythonProcess.stderr.on('data', (data) => {
//     console.error(`Error = Python script: ${data}`);
//     res.status(500).json({ error: 'An error occurred while generating the itinerary.' });
//   });
// });

yatra.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

// /auth/signup
// yatra.use("/auth", Auth);
// yatra.use("/user", User);

const PORT = 4000;

yatra.listen(PORT, () => {
  ConnectDB()
    .then(() => {
      console.log("Server is running !!!");
    })
    .catch((error) => {
      console.log("Server is running, but database connection failed...");
      console.log(error);
    });
});
