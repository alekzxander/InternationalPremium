const permissions = require('../config/permissions');

module.exports = function (app , passport) {
let voyage = require('./models/voyage')


    // normal routes ===============================================================
    app.get('/dashbord', permissions.can('access admin page'), (req, res) => {
        res.render('dashbord.ejs')

    })
    //TODO : renommer pour card/:id/delete
    app.get('/cardSupp/:id', permissions.can('access admin page'), (req, res)=>{
        voyage.remove({_id : req.params.id}, (err, delData)=>{
            res.render("validation.ejs");
        })
    })
    app.get('/dashbord/card', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, carte)=>{
            res.render('card.ejs',{cartes : carte});
        });
    });

    app.get('/dashbord/dashItineraire', permissions.can('access admin page'), (req, res) => {
        res.render('dashItineraire.ejs')
    })
    
    // create card
    // process the card form
    app.post('/dashbord/card', permissions.can('access admin page'), (req, res) => {
        let myData = new voyage({
            name: req.body.name,
            dateA: req.body.dateA,
            dateR: req.body.dateR,
            sejour: req.body.sejour,
            preview: req.body.preview,
            img : req.body.img
        });
        myData.save()
            .then(item => {
                res.redirect("/dashbord/card");
            })
            .catch(err => {
                res.status(400).send("Impossible de sauvegarder dans la db");
            });
    });

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        voyage.find((err, voyages) => {
            res.render('index.ejs', {mesVoyages: voyages});
        });
    });
    app.get('/voyage/:id', ((req, res) => {
        voyage.find((err, voyages) => {
            res.render('voyage.ejs', {
                voyage: req.params.id,
                mesVoyages: voyages.filter((voyage) => {
                    return voyage.id == req.params.id
                })[0]
            })
        })
    }))

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {user: req.user});
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/mentionslegales', (req, res) => {
        res.render('mentions.ejs')
    })
    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN)
    // ==================================================
    // =============================================================================
    // locally -------------------------------- LOGIN
    // =============================== show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP ================================= show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
    // =============
    // =============================================================================
    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS
    // =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token for local
    // account, remove email and password user account will stay active in case they
    // want to reconnect in the future local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        let user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // ============ Formulaire de Contact ======================
    app.get('/contact', (req, res) => {
        res.render('contact.ejs')
    })

}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) 
        return next();
    
    res.redirect('/');
}
