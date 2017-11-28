var ConnectRoles = require('connect-roles');
var permissions = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // OPTIONAL FUNCTION TO CUSTOMISE CODE THAT RUNS WHEN USER FAILS AUTHORISATION 
        res.status(403);
        if (~ accept.indexOf('html')) {
            res.render('access-denied', {action: action});
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});


permissions.use('access admin page', function (req) {
    if (req.user !== undefined && req.user.local.role === 'admin') {
        return true;
    }
})

// ADMIN USERS CAN ACCESS ALL PAGES 
permissions.use(function (req) {
    if (req.user !== undefined && req.user.local.role === 'admin') {
        return true;
    }
});

module.exports = permissions;