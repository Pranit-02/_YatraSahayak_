"use strict";

var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _passport = _interopRequireDefault(require("passport"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _child_process = require("child_process");
var _connection = _interopRequireDefault(require("./database/connection"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const cors = require('cors');
// import Auth from "./api/auth";
// import User from "./api/user";

_dotenv.default.config();

// privateRouteConfig(passport);
// googleAuthConfig(passport);

const yatra = (0, _express.default)();
const corsOptions = {
  origin: 'http://127.0.0.1:5173',
  credentials: true,
  //access-control-allow-credentials:true
  optionSuccessStatus: 200
};

// Apply CORS middleware
yatra.use(cors(corsOptions));
yatra.use(_express.default.json());
yatra.use((0, _expressSession.default)({
  secret: process.env.JWTSECRET
}));
yatra.use(_passport.default.initialize());
yatra.use(_passport.default.session());
yatra.post('/generate-itinerary', (req, res) => {
  // Get the input data = the request body
  const inputData = req.body;

  // Execute the Python script and pass the input data as an argument
  const pythonProcess = (0, _child_process.spawn)('python', ['./python_model/generate_itinerary.py', JSON.stringify(inputData)]);

  // Collect data = the Python script's stdout
  pythonProcess.stdout.on('data', data => {
    const result = JSON.parse(data);
    res.json(result);
  });

  // Handle any errors
  pythonProcess.stderr.on('data', data => {
    console.error(`Error = Python script: ${data}`);
    res.status(500).json({
      error: 'An error occurred while generating the itinerary.'
    });
  });
});
yatra.get("/", (req, res) => {
  res.json({
    message: "Server is running"
  });
});

// /auth/signup
// yatra.use("/auth", Auth);
// yatra.use("/user", User);

const PORT = 4000;
yatra.listen(PORT, () => {
  (0, _connection.default)().then(() => {
    console.log("Server is running !!!");
  }).catch(error => {
    console.log("Server is running, but database connection failed...");
    console.log(error);
  });
});