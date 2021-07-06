// app debugging
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");


const express = require("express");
const app = express();


// connecting to a database:
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/vidly_genres_app",{useUnifiedTopology: true, useNewUrlParser: true})
    .then(()=>dbDebugger("Connected to MongoDB..."))
    .catch((err)=>console.err("Could not connect to MongoDB", err));


// setting templating engine
app.set("view engine", "pug");
// setting default views folder
app.set("views", "./views");

// middleware to parse json in request body
app.use(express.json()); // req.body
// middleware to parse url-encoded parameters in the request body
app.use(express.urlencoded({extended:true}));


// Custom middlewares:
const logger = require("./middlewares/logger");
const authenticator = require("./middlewares/authenticator");
app.use(logger);
app.use(authenticator);


//third party middlewares
// to apply HTTP headers
const helmet = require("helmet");
app.use(helmet());
// to log HTTP requests to the console
const morgan = require("morgan");
if(app.get("env") === "development"){
    app.use(morgan("tiny"));
    startupDebugger("Morgan enabled");
}


// app configurations
const config = require("config");
startupDebugger(`Application Name: ${config.get("name")}`);
startupDebugger(`Mail Server Name: ${config.get("mail.host")}`);
startupDebugger(`Mail Server Password: ${config.get("mail.password")}`);


// loading routes
const genres = require("./routes/genres");
const home = require("./routes/home");
const customers = require("./routes/customers");
// routing
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);


// listening for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));