const dotEnv = require('dotenv').load();
const nodemailer = require("nodemailer");
const voyage = require('../models/voyage')
module.exports = (app, passport) => {


    // CONTACT FORM

    app.get('/contact', (req, res) => {
        voyage.find((err, voyagesMenu) => {
            res.render('contact.ejs', {
                voyagesMenu: voyagesMenu,
                layout: 'layoutContact'
            });
        })

    })
    app.get('/validationEmail', (req, res) => {
        voyage.find((err, voyagesMenu) => {
            res.render('validationEmail', {
                voyagesMenu: voyagesMenu,
                layout: 'layoutContact'
            })
        })
    })
    app.post('/email', (req, res) => {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });
        let mail = {
            from: req.body.email,
            to: process.env.EMAIL,
            subject: req.body.subject,
            html: req.body.name.toUpperCase() + req.body.email + req.body.message
        }
        transporter.sendMail(mail, (error, response) => {
            if (error) {
                console.log("Mail non envoyé");
                res.redirect('/contact')
            } else {
                console.log("Mail envoyé avec succès!")
                res.redirect('/validationEmail')
            }
            transporter.close();
        });
    })


}