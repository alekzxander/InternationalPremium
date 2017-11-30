module.exports = (app, passport) => {

    app.use((req, res, next) => {
        res.status(404).render('layout404.ejs', {
            layout: 'layout404'
        })
    })

}