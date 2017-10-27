var ConnectRoles = require('connect-roles');
var permissions = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when user fails authorisation
        var accept = req.headers.accept || '';
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

//admin users can access all pages
permissions.use(function (req) {
    if (req.user !== undefined && req.user.local.role === 'admin') {
        return true;
    }
});

module.exports = permissions;