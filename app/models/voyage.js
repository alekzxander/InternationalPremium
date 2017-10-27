let mongoose = require('mongoose');

let voyageSchema = new mongoose.Schema ({
    name : String,
    dateA : String,
    dateR : String,
    sejour : String,
    preview : String,
    text : String,
    img : String,
    lieuxTableau : Array,
})
let voyage = mongoose.model('voyages', voyageSchema)
module.exports = voyage;