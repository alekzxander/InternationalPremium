// LOAD THE THINGS WE NEED 
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// DEFINE THE SCHEMA FOR OUR USER MODEL
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

// GENERATING A HASH
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// CHECKING IF PASSWORD IS VALID 
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.isMember = function()  {
    return (this.role === "member");
};
userSchema.methods.isAdmin = function()  {
    return (this.role === "admin");
};


// CREATE THE MODEL FOR USERS AND EXPOSE IT TO OUR APP 
module.exports = mongoose.model('User', userSchema);