const permissions = require('../config/permissions');
const multer = require('multer');
var fs = require('fs');
const dotEnv = require('dotenv').load();
const nodemailer = require("nodemailer");
const voyage = require('./models/voyage')
const upload = multer({ dest: 'public/images/' })

module.exports = function (app, passport) {

    // BASIC ROUTE (INDEX)

    app.get('/', function (req, res) {
        voyage.find((err, voyages) => {
            res.render('index', { mesVoyages: voyages, voyagesMenu : voyages});
        });
    });

    app.use('/voyage/:name',function (req, res, next) {
        voyage.find({}, (err, voyagesMenu) => {
            req.voyagesMenu = voyagesMenu;
            next();
        })
    })

    app.get('/voyage/:name', ((req, res) => {
        voyage.find((err, voyages) => {
            res.render('voyage.ejs', {
                voyagesMenu: req.voyagesMenu,
                voyage: req.params.name,
                mesVoyages: voyages.filter((voyage) => {
                    return voyage.name == req.params.name
                })[0]
            })
        })
    }))

  
   
    // SIGNUP 
    app.get('/signup', function (req, res) {
        res.render('layoutSignup.ejs',{ layout:'layoutSignup',
            message: req.flash('signupMessage')
        });
    });

    // PROCESS THE SIGNUP FORM 
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


   // LOGIN

    app.get('/login', function (req, res) {
        res.render('layoutLogin.ejs',{ layout:'layoutLogin',
            message: req.flash('loginMessage')
        });
    });
    
    // PROCESS THE LOGIN FORM
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

      // LOGOUT 
      app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });



 
    // PANEL ADMIN 

    app.get('/dashbord', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, carte) => {
            res.render('dashbord',{voyages:carte, layout:'layoutAdmin'})
        
        })
    });

    app.get('/card/:id/delete', permissions.can('access admin page'), (req, res) => {
        voyage.remove({ _id: req.params.id }, (err, delData) => {
            res.redirect("/dashbord");
        })
    })

    app.get('/dashbord/card', permissions.can('access admin page'), (req, res) => {
            res.render('card', { layout:'layoutAdmin' });
    });

    app.get('/dashbord/dashItineraire/', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, voyages) => {
            res.render('dashItineraire', { voyages: voyages, layout:'layoutAdmin' })
        });
    })

    // CREATE CARD PANEL ADMIN


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

    // ADD PLACE PANEL ADMIN 

    app.get('/ajoutLieux/:id', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, voyages) => {
            res.render('ajoutLieux', { 
                id: req.params.id, mesVoyages: voyages.filter((voyage) => {
                    return (voyage.id == req.params.id)
                })[0], layout : 'layoutAdmin'
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

    // DELETE PLACE PANEL ADMIN 

    app.get('/suppLieux/:id', permissions.can('access admin page'),(req, res) => {
        voyage.find((err, voyages) => {
            res.render('suppLieux', { 
                id: req.params.id, mesVoyages: voyages.filter((voyage) => {
                    return (voyage.id == req.params.id)
                })[0], layout : 'layoutAdmin'
            })
        });
    })
    
    app.get('/suppLieux/:id/delete',permissions.can('access admin page'), (req, res) => {
        console.log(req.params.id)
        voyage.update({}, 
            {
                $pull : {
                    lieux : { _id: req.params.id}
                }
            }, 
            {multi:true},
            (err, delData) => {  
                console.log(delData)
            res.redirect("/dashbord/dashitineraire");
        })
    })    

    // UPDATE CARD PANEL ADMIN

    app.get('/updatecard/:id', permissions.can('access admin page'), (req, res) => {
        voyage.find((err, voyages) => {
            res.render('updatecard', { layout : 'layoutAdmin',
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
        var target_path = 'public/images/' + fileToUpload.originalname;
        var tmp_path = fileToUpload.path;

        voyage.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, dateA: req.body.dateA, dateR: req.body.dateR, sejour: req.body.sejour, preview: req.body.preview, text: req.body.text, img: fileToUpload.originalname } }, { new: true }, (err, voyage) => {
            voyage.save().then(item => {
                var src = fs.createReadStream(tmp_path);
                var dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                //delete temp file
                fs.unlink(tmp_path);
                src.on('end', function () { res.redirect("/dashbord"); });
                src.on('error', function (err) { res.render('error'); });
            })
                .catch(err => {
                    res.status(400);
                });
        })
    })

    // CONTACT FORM

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


// MENTIONS LEGALS
 app.get('/mentionslegales', (req, res) => {
        res.render('mentions.ejs')
    })

    // PARTNERS
    app.get('/partenaires', (req, res) => {
        voyage.find((err, voyagesMenu) => {
            res.render('partenaires.ejs',{voyagesMenu : voyagesMenu})
        })
    })
}

