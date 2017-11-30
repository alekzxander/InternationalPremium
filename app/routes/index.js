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


    app.use('/voyage/:slug', (req, res, next) => {
        voyage.find({}, (err, voyagesMenu) => {
            req.voyagesMenu = voyagesMenu;
            next();
        })
    })
    
    
    app.get('/voyage/:slug', ((req, res) => {
        voyage.find((err, voyages) => {
            res.render('voyage', {
                voyagesMenu: req.voyagesMenu,
                voyage: req.params.slug,
                mesVoyages: voyages.filter((voyage) => {
                    return voyage.slug == req.params.slug
                })[0]
            })
        })
    }))



}