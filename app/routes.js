const permissions = require('../config/permissions');
const multer = require('multer');
var fs = require('fs');

module.exports = function (app, passport) {
    let voyage = require('./models/voyage')
    const findOrCreate = require('mongoose-findorcreate')
    var upload = multer({ dest: 'public/images/' })


    // normal routes ===============================================================
    app.get('/dashbord', (req, res) => {
        res.render('dashbord.ejs')

    })
    //TODO : renommer pour card/:id/delete
    app.get('/cardSupp/:id', (req, res) => {
        voyage.remove({ _id: req.params.id }, (err, delData) => {
            res.render("validation.ejs");
        })
    })
    app.get('/dashbord/card', (req, res) => {
        voyage.find((err, carte) => {
            res.render('card.ejs', { cartes: carte });
        });
    });

    app.get('/dashbord/dashItineraire/', (req, res) => {
        voyage.find((err, voyages) => {
            res.render('dashItineraire.ejs', { voyages: voyages })
        });
    })
    app.get('/ajoutLieux/:id', (req, res) => {
        voyage.find((err, voyages) => {
            res.render('ajoutLieux.ejs', {
                id: req.params.id, mesVoyages: voyages.filter((voyage) => {
                    return (voyage.id == req.params.id)
                })[0]
            })
        });
    }) 
    app.post('/ajoutLieux/:id', (req, res) => { 
        voyage.findByIdAndUpdate(req.params.id,{ $addToSet :{ lieux : req.body.lieux }}, {new : true },(err, voyages)=>{
            voyages.save()
                .then(item => {
                    res.redirect("/dashbord/dashItineraire");
                })
                .catch(err => {
                    res.status(400).send("Impossible de sauvegarder dans la db");
                });
        })

    })


    // create card
    // process the card form
    app.post('/dashbord/card', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        /** The original name of the uploaded file
         stored in the variable "originalname". **/
        var fileToUpload = req.file;
        var target_path = 'public/images/' + fileToUpload.originalname;

        /** When using the "single"
             data come in "req.file" regardless of the attribute "name". **/
        var tmp_path = fileToUpload.path;

        let myData = new voyage({
            name: req.body.name,
            dateA: req.body.dateA,
            dateR: req.body.dateR,
            sejour: req.body.sejour,
            preview: req.body.preview,
            img: fileToUpload.originalname,
            text: req.body.text,

        });


        myData
            .save()
            .then(item => {
                //Upload image 
                /** A better way to copy the uploaded file. **/
                var src = fs.createReadStream(tmp_path);
                var dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                //delete temp file
                fs.unlink(tmp_path);
                src.on('end', function () { res.redirect("/dashbord/card"); });
                src.on('error', function (err) { res.render('error'); });

            })
            .catch(err => {
                res
                    .status(400)
                    .send("Impossible de sauvegarder dans la db");
            });
    });

    update
    app.get('/updatecard/:id', (req, res) => {

        voyage.find((err, voyages) => {
            res.render("updatecard.ejs", {
                voyage: req.params.id, card: voyages.filter((voyage) => {
                    return voyage.id == req.params.id
                })[0]
            })
        })
    })

    app.post('/updatecard/:id', (req, res) => {
        voyage.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                dateA: req.body.dateA,
                dateR: req.body.dateR,
                sejour: req.body.sejour,
                preview: req.body.preview,
                text: req.body.text
            }
        },
            { new: true },
            (err, voyages) => {
                voyages.save()
                    .then(item => {
                        res.redirect("/dashbord/card");
                    })
                    .catch(err => {
                        res.status(400).send("Maj non possible");
                    });
            })

    })





    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        voyage.find((err, voyages) => {
            res.render('index.ejs', { mesVoyages: voyages });
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
        res.render('profile.ejs', { user: req.user });
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
