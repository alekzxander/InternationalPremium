const voyage = require('../models/voyage')


module.exports =  (app, passport) =>{

    // BASIC ROUTE (INDEX)

    app.get('/', (req, res) =>{
        voyage.find((err, voyages) => {
            res.render('index', {
                mesVoyages: voyages,
                voyagesMenu: voyages
            });
        });
    });


    app.use('/voyage/:name',(req, res, next) =>{
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

   
}