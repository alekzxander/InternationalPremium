// set up get all the tools we need

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const app = express();
const multer = require('multer');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const permissions = require('./config/permissions');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const configDB = require('./config/database.js');
const passportConfig = require('./config/passport')(passport); // pass passport for configuration
const nodemailer = require("nodemailer");
const routes = require('./app/routes.js');
const dotenv = require('dotenv').load();
const slug = require('mongoose-slug-generator');


mongoose.connect(configDB.url, { useMongoClient: true });
mongoose.Promise = global.Promise


// express layout de merde


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use(express.static(__dirname + '/public'));

app.use(expressLayouts);

app.use(permissions.middleware());

// required for passport
app.use(session({

    secret: process.env.SECRET, // session secret 
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use(express.static(__dirname + '/public'));


// routes
routes(app, passport); // load our routes and pass in our app and fully configured passport



module.exports = app;