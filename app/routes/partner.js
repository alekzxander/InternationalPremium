const voyage = require('../models/voyage')


module.exports =  (app, passport) =>{

    // PARTNERS

    app.use('/partenaires',(err,req, res,next) =>{
        res.status(404);
       res.render('layout404.ejs',{layout:'layout404'})
      next()
    })
    
    
    app.get('/partenaires', (req, res) => {
        voyage.find((err, voyagesMenu) => {
            res.render('partenaires.ejs', {
                voyagesMenu: voyagesMenu
            })
        })
    })
}

