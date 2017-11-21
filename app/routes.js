const permissions = require('../config/permissions');
const multer = require('multer');
var fs = require('fs');
module.exports = function (app, passport) {
    const dotEnv = require('dotenv').load();
    const nodemailer = require("nodemailer");
    const voyage = require('./models/voyage')
    const upload = multer({ dest: 'public/images/' })

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
        res.render('layoutLogin.ejs',{ layout:'layoutLogin',
            message: req.flash('loginMessage')
        });
    });
    
    // process the login form
    app.post('/login', function(req,res){
        //Redirect user according to role
        passport.authenticate('local-login', function(err, user, info){
            if (err) {
                return res.redirect('/login');
            }
            if (!user) {
                return res.redirect('/login');
            }
            //Log in the user
            req.logIn(user, function(err) {
                if (err) { return next(err); }

                //redirect the user to dashboard when it's an admin
                if(user.local.role==='admin'){
                    return res.redirect('/dashbord');
                }
                //redirect user to the homepage for no admin user
                return res.redirect('/');
              });
        })(req, res); //<-- give access to req and res for the callback of authenticate
    });
    // SIGNUP ================================= show the signup form
    app.get('/signup', function (req, res) {
        res.render('layoutSignup.ejs',{ layout:'layoutSignup',
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

    // normal routes ===============================================================
    app.get('/dashbord', permissions.can('access admin page'), (req, res) => {
            res.render('dashbord',{layout:'layoutAdmin'})
            

    });
    app.get('/card/:id/delete', permissions.can('access admin page'), (req, res) => {
        voyage.remove({ _id: req.params.id }, (err, delData) => {
            res.render("validation.ejs");
        })
    })
    app.get('/dashbord/card', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, carte) => {
            res.render('card.ejs', { cartes: carte });
        });
    });

    app.get('/dashbord/dashItineraire/', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, voyages) => {
            res.render('dashItineraire.ejs', { voyages: voyages })
        });
    })
    app.get('/ajoutLieux/:id', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, voyages) => {
            res.render('ajoutLieux.ejs', {
                id: req.params.id, mesVoyages: voyages.filter((voyage) => {
                    return (voyage.id == req.params.id)
                })[0]
            })
        });
    })

    app.post('/ajoutLieux/:id', upload.single('img'), (req, res) => {
        let fileToUpload = req.file;
        let target_path = 'public/images/' + fileToUpload.originalname;
        let tmp_path = fileToUpload.path;
        voyage.findByIdAndUpdate(req.params.id, {
            $push: {
                lieux: {
                    titre: req.body.titre,
                    text: req.body.text,
                    img: fileToUpload.originalname
                }
            }
        },
            { new: true }, (err, voyages) => {
                voyages.save()
                    .then(item => {
                        var src = fs.createReadStream(tmp_path);
                        var dest = fs.createWriteStream(target_path);
                        src.pipe(dest);
                        fs.unlink(tmp_path);
                        src.on('end', function () {
                            res.redirect("/dashbord/dashItineraire");
                        })
                        src.on('error', function (err) {
                            res.render('error');
                        })

                    })
                    .catch(err => {
                        res.status(400);
                    });
            })
    })

    // create card
    // process the card form
    app.post('/dashbord/card', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        var fileToUpload = req.file;
        var target_path = 'public/images/' + fileToUpload.originalname;
        var tmp_path = fileToUpload.path;

        let myData = new voyage({
            name: req.body.name,
            dateA: req.body.dateA,
            dateR: req.body.dateR,
            sejour: req.body.sejour,
            preview: req.body.preview,
            text: req.body.text,
            img: fileToUpload.originalname
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
            });
    });

    /* update card */
    app.get('/updatecard/:id', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, voyages) => {
            res.render("updatecard.ejs", {
                voyage: req.params.id, card: voyages.filter((voyage) => {
                    return voyage.id == req.params.id
                })[0]
            })
        })
    })

    app.post('/updatecard/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        // Create Var for img
        var fileToUpload = req.file;
        console.log(fileToUpload)
        var target_path = upload + fileToUpload;
        var tmp_path = fileToUpload.path;

        voyage.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, dateA: req.body.dateA, dateR: req.body.dateR, sejour: req.body.sejour, preview: req.body.preview, text: req.body.text, img: fileToUpload.originalname } }, { new: true }, (err, voyage) => {
            voyage.save().then(item => {
                var src = fs.createReadStream(tmp_path);
                var dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                //delete temp file
                fs.unlink(tmp_path);
                src.on('end', function () { res.redirect("/dashbord/card"); });
                src.on('error', function (err) { res.render('error'); });
            })
                .catch(err => {
                    res.status(400);
                });
        })
    })

    app.get('/', function (req, res) {
        voyage.find((err, voyages) => {
            res.render('index', { mesVoyages: voyages, voyagesMenu : voyages});
        });
    });

    app.use('/voyage/:id', function (req, res, next) {
        voyage.find({}, (err, voyagesMenu) => {
            req.voyagesMenu = voyagesMenu
            next();
        })
    })

    app.get('/voyage/:id', ((req, res) => {
        voyage.find((err, voyages) => {
            res.render('voyage.ejs', {
                voyagesMenu: req.voyagesMenu,
                voyage: req.params.id,
                mesVoyages: voyages.filter((voyage) => {
                    return voyage.id == req.params.id
                })[0]
            })
        })
    }))

    // ============ Formulaire de Contact ====================== //

    app.get('/contact', (req, res) => {
        voyage.find((err,voyagesMenu)=>{
            res.render('layoutContact.ejs',{voyagesMenu:voyagesMenu , layout:'layoutContact'});
        })
       
    })
    app.post('/email',(req,res)=> {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            host : 'smtp.gmail.com',
            secure : true,
            port : 465,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            } 
        });

        let mail = {
            from:req.body.email,
            to: process.env.EMAIL ,
            subject: req.body.subject,
            html: req.body.name.toUpperCase() + req.body.email  + req.body.message 
        }

        transporter.sendMail(mail, function(error, response){
            if(error){
                console.log("Mail non envoyé");
               res.redirect('/contact')
            }else{
                console.log("Mail envoyé avec succès!")
                res.redirect('/')
            }
            transporter.close();
        });
    })
    // ================= Qui sommes Nous ========================= //
    app.get('/partenaires', (req, res) => {
        voyage.find((err, voyagesMenu) => {
            res.render('partenaires.ejs',{voyagesMenu : voyagesMenu})
        })
    })
}
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (isAuthenticated()){
    }
}
function getLoggedUser(req, res, next){
    if(req.isAuthenticated() && req.user.local.role === 'admin'){       
        res.redirect('/dashbord'),permissions.can('access admin page')
    }next()
  
}
