var ConnectRoles = require('connect-roles');
var permissions = new ConnectRoles({
    failureHandler: (req, res, action) => {
        // OPTIONAL FUNCTION TO CUSTOMISE CODE THAT RUNS WHEN USER FAILS AUTHORISATION 
        res.status(403);
        if (~accept.indexOf('html')) {
            res.render('Accès Refusé', {
                action: action
            });
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});


permissions.use('Accès page admin', (req) => {
    if (req.user !== undefined && req.user.local.role === 'admin') {
        return true;
    }
})

//admin users can access all pages
permissions.use(function (req) {
    if (req.user !== undefined && req.user.local.role === 'admin') {
        return true;
    }
});

module.exports = permissions;