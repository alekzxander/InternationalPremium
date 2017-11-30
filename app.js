// SET UP GET ALL THE TOOLS WE NEED 
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
const dotenv = require('dotenv').load();


// Set up the all routes 
const index = require ('./app/routes/index');
const connexion = require ('./app/routes/connexion');
const panelAdmin = require ('./app/routes/panelAdmin');
const partner = require('./app/routes/partner');
const contact = require('./app/routes/contact');
const mentions = require('./app/routes/mentions');
const error404 = require('./app/routes/error404');


//  Use mongoose for connect to database 

mongoose.connect(configDB.url, { useMongoClient: true });
mongoose.Promise = global.Promise


// use  your engine template and configure the folder

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')

// Set up our express application

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css/')); // expression static for bootstrap ( in node_modules)
app.use(express.static(__dirname + '/public'));  // search all ressources 
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

// routes
index(app , passport);
connexion(app, passport);
panelAdmin(app, passport);
partner(app, passport);
contact(app, passport);
mentions(app , passport);
error404(app,passport);




module.exports = app;