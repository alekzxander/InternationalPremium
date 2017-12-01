var ConnectRoles = require('connect-roles');
var permissions = new ConnectRoles({
    failureHandler:  (req, res, action) => {
        // OPTIONAL FUNCTION TO CUSTOMISE CODE THAT RUNS WHEN USER FAILS AUTHORISATION 
        res.status(403);
        if (~ accept.indexOf('html')) {
            res.render('Accès Refusé', {action: action});
        } else {
            res.send("Accès Refusé- Vous n'avez pas la permission " + action);
        }
    }
});


permissions.use('Accès page admin',  (req) => {
    if (req.user !== undefined && req.user.local.role === 'admin') {
        return true;
    }
})

// ADMIN USERS CAN ACCESS ALL PAGES 
permissions.use((req) => {
    if (req.user !== undefined && req.user.local.role === 'admin') {
        return true;
    }
});

module.exports = permissions;