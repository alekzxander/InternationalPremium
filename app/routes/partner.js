const voyage = require('../models/voyage')


module.exports =  (app, passport) =>{

    // PARTNERS   
    
    app.get('/partenaires', (req, res) => {
        voyage.find((err, voyagesMenu) => {
            res.render('partenaires.ejs', {
                voyagesMenu: voyagesMenu
            })
        })
    })

    // app.use((req, res,next) =>{
    //     res.status(404).render('layout404.ejs',{layout:'layout404'})
    //    })
}

