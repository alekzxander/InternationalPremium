const permissions = require('../../config/permissions');
const voyage = require('../models/voyage')

module.exports = (app, passport) => {

    // SIGNUP 

    app.get('/signup', (req, res) => {
        voyage.find((err, voyages) => {
            res.render('layoutSignup.ejs', {
                layout: 'layoutSignup',
                message: req.flash('signupMessage'),
                voyagesMenu: voyages
            });
        })

    });


    // PROCESS THE SIGNUP FORM 
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // LOGIN


    app.get('/login', (req, res) => {
        res.render('layoutLogin.ejs', {
            layout: 'layoutLogin',
            message: req.flash('loginMessage')
        });
    });


    // PROCESS THE LOGIN FORM
    app.post('/login', (req, res) => {
        //Redirect user according to role
        passport.authenticate('local-login', (err, user, info) => {
                if (err) {
                    return res.redirect('/login');
                }
                if (!user) {
                    return res.redirect('/login');
                }
                //Log in the user
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }

                    //redirect the user to dashboard when it's an admin
                    if (user.local.role === 'admin') {
                        return res.redirect('/dashbord');
                    }
                    //redirect user to the homepage for no admin user
                    return res.redirect('/');
                });
            })
            (req, res); //<-- give access to req and res for the callback of authenticate
    });

    // LOGOUT 
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });



}