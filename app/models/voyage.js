let mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

let voyageSchema = new mongoose.Schema ({
    name : String,
    dateA : String,
    dateR : String,
    sejour : String,
    preview : String,
    text : String,
    img : String,
    lieux : Array,
})

let voyage = mongoose.model('voyages', voyageSchema)
module.exports = voyage;    