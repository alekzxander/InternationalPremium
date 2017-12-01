const voyage = require('../models/voyage');


module.exports = (app, passport) => {

    // BASIC ROUTE (INDEX)

    app.get('/', (req, res) => {
        voyage.find((err, voyages) => {
            res.render('index', {
                mesVoyages: voyages,
                voyagesMenu: voyages
            });
        });
    });


    app.use('/voyage/:url', (req, res, next) => {
        voyage.find({}, (err, voyagesMenu) => {
            req.voyagesMenu = voyagesMenu;
            next();
        })
    })


    app.get('/voyage/:url', ((req, res) => {
        voyage.find((err, voyages) => {
            res.render('voyage', {
                voyagesMenu: req.voyagesMenu,
                voyage: req.params.url,
                mesVoyages: voyages.filter((voyage) => {
                    return voyage.url == req.params.url
                })[0]
            })
        })
    }))



}