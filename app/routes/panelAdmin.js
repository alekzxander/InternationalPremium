    const permissions = require('../../config/permissions');
    const multer = require('multer');
    const fs = require('fs');
    const voyage = require('../models/voyage')
    const upload = multer({
        dest: 'public/images/'
    })

    module.exports = (app, passport) => {



        // PANEL ADMIN 

        app.get('/dashbord', permissions.can('access admin page'), (req, res) => {
            voyage.find((err, carte) => {
                res.render('dashbord', {
                    voyages: carte,
                    layout: 'layoutAdmin'
                })

            })
        });

        app.get('/card/:id/delete', permissions.can('access admin page'), (req, res) => {
            voyage.remove({
                _id: req.params.id
            }, (err, delData) => {
                res.redirect("/dashbord");
            })
        })

        app.get('/dashbord/card', permissions.can('access admin page'), (req, res) => {
            res.render('card', {
                layout: 'layoutAdmin'
            });
        });

        app.get('/dashbord/dashItineraire/', permissions.can('access admin page'), (req, res) => {
            voyage.find((err, voyages) => {
                res.render('dashItineraire', {
                    voyages: voyages,
                    layout: 'layoutAdmin'
                })
            });
        })

        // CREATE CARD PANEL ADMIN


        app.post('/dashbord/card', permissions.can('access admin page'), upload.single('img'), (req, res) => {
            var fileToUpload = req.file;
            var target_path = 'public/images/' + fileToUpload.originalname;
            var tmp_path = fileToUpload.path;

            let myData = new voyage({
                name: req.body.name,
                url: req.body.url,
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
                    src.on('end', () => {
                        res.redirect("/dashbord/card");
                    });
                    src.on('error', (err) => {
                        res.render('error');
                    });

                })
                .catch(err => {
                    res
                        .status(400)
                });
        });

        // ADD PLACE PANEL ADMIN 

        app.get('/modifLieux/:id', permissions.can('access admin page'), (req, res) => {
            voyage.find((err, voyages) => {
                res.render('modifLieux', {
                    id: req.params.id,
                    mesVoyages: voyages.filter((voyage) => {
                        return (voyage.id == req.params.id)
                    })[0],
                    layout: 'layoutAdmin'
                })
            });
        })

        app.post('/modifLieux/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
            // Create Var for img
            let fileToUpload = req.file;
            let target_path;
            let tmp_path;
            let img_path;
            if (fileToUpload != undefined || fileToUpload != null) {
                target_path = 'public/images/' + fileToUpload.originalname;
                tmp_path = fileToUpload.path;
                img_path = fileToUpload.originalname;
            } else {
                img_path = req.body.img;
            }
            console.log(req.params.id)
            voyage.update({
                    lieux: {
                        $elemMatch: {
                            _id: req.params.id
                        }
                    }
                }, {
                    $set: {
                        "lieux.$.titre": req.body.titre,
                        "lieux.$.text": req.body.text,
                        "lieux.$.img": img_path
                    }
                }, {
                    multi: true

                },
                (err, voyage) => {
                    if (fileToUpload != undefined || fileToUpload != null) {
                        let src = fs.createReadStream(tmp_path);
                        let dest = fs.createWriteStream(target_path);
                        src.pipe(dest);

                        fs.unlink(tmp_path);
                    }
                    res.redirect('/dashbord/dashitineraire');

                })
        })



        app.get('/ajoutLieux/:id', permissions.can('access admin page'), (req, res) => {
            voyage.find((err, voyages) => {
                res.render('ajoutLieux', {
                    id: req.params.id,
                    mesVoyages: voyages.filter((voyage) => {
                        return (voyage.id == req.params.id)
                    })[0],
                    layout: 'layoutAdmin'
                })
            });
        })

        app.post('/ajoutLieux/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
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
            }, {
                new: true
            }, (err, voyages) => {
                voyages.save()
                    .then(item => {
                        var src = fs.createReadStream(tmp_path);
                        var dest = fs.createWriteStream(target_path);
                        src.pipe(dest);
                        fs.unlink(tmp_path);
                        src.on('end', () => {
                            res.redirect("/dashbord/dashItineraire");
                        })
                        src.on('error', (err) => {
                            res.render('error');
                        })

                    })
                    .catch(err => {
                        res.status(400);
                    });
            })
        })

        // DELETE PLACE PANEL ADMIN 

        app.get('/suppLieux/:id', permissions.can('access admin page'), (req, res) => {
            voyage.find((err, voyages) => {
                res.render('suppLieux', {
                    id: req.params.id,
                    mesVoyages: voyages.filter((voyage) => {
                        return (voyage.id == req.params.id)
                    })[0],
                    layout: 'layoutAdmin'
                })
            });
        })

        app.get('/suppLieux/:id/delete', permissions.can('access admin page'), (req, res) => {

            voyage.update({}, {
                    $pull: {
                        lieux: {
                            _id: req.params.id
                        }
                    }
                }, {
                    multi: true
                },
                (err, delData) => {
                    console.log(delData)
                    res.redirect("/dashbord/dashitineraire");
                })
        })

        // UPDATE CARD PANEL ADMIN

        app.get('/updatecard/:id', permissions.can('access admin page'), (req, res) => {
            voyage.find((err, voyages) => {
                res.render('updatecard', {
                    layout: 'layoutAdmin',
                    voyage: req.params.id,
                    card: voyages.filter((voyage) => {
                        return voyage.id == req.params.id
                    })[0]
                })
            })
        })

        app.post('/updatecard/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
            // Create Var for img
            let fileToUpload = req.file;
            let target_path;
            let tmp_path;
            let img_path;
            if (fileToUpload != undefined || fileToUpload != null) {
                console.log('file est defini')
                target_path = 'public/images/' + fileToUpload.originalname;
                tmp_path = fileToUpload.path;
                img_path = fileToUpload.originalname;

            } else {
                console.log('pas ok')
                img_path = req.body.img;
            }
            voyage.findByIdAndUpdate(req.params.id, {
                $set: {
                    name: req.body.name,
                    url: req.body.url,
                    dateA: req.body.dateA,
                    dateR: req.body.dateR,
                    sejour: req.body.sejour,
                    preview: req.body.preview,
                    text: req.body.text,
                    img: img_path
                }
            }, {
                new: true
            }, (err, voyage) => {
                voyage.save().then(item => {
                        // console.log('Ca marche')
                        if (fileToUpload != undefined || fileToUpload != null) {
                            let src = fs.createReadStream(tmp_path);
                            let dest = fs.createWriteStream(target_path);
                            src.pipe(dest);
                            //delete temp file
                            fs.unlink(tmp_path);
                            console.log('Ca marche toujours')
                        }
                        res.redirect('/dashbord')
                    })
                    .catch(err => {
                        res.status(400);
                    });

            })
        })

    }