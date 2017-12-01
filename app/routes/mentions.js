const voyage = require('../models/voyage')


module.exports = (app, passport) => {

    // MENTIONS LEGALS
    app.get('/mentionslegales', (req, res) => {
        voyage.find((err, voyagesMenu) => {
            res.render('mentions.ejs', {
                voyagesMenu: voyagesMenu
            })
        })
    })

}