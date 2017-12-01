// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        nom: String,
        prenom: String,
        date: Date,
        telephone: Number,
        email: String,
        password: String,
        role: {
            type: String,
            default: "member"
        },
        isAdmin: {
            type: Boolean,
            default: "false"
        }
    }

});

<<<<<<< HEAD
// GENERATING A HASH
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// CHECKING IF PASSWORD IS VALID 
=======
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
>>>>>>> 0bbda2412aa9b6d9db1502b3a32df395941e7674
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

<<<<<<< HEAD
userSchema.methods.isMember = function()  {
    return (this.role === "member");
};
userSchema.methods.isAdmin = function()  {
=======
userSchema.methods.isMember = function() {
    return (this.role === "member");
};
userSchema.methods.isAdmin = function() {
>>>>>>> 0bbda2412aa9b6d9db1502b3a32df395941e7674
    return (this.role === "admin");
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);