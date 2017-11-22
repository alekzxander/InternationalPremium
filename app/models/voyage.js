let mongoose = require('mongoose');

let voyageSchema = new mongoose.Schema ({
    name : String,
    dateA : String,
    dateR : String,
    sejour : String,
    preview : String,
    text : String,
    img : String,
    lieux : [{_id: false,
            titre : {type : String},
            text : {type : String},
            img : {type : String}
            }]
})
let voyage = mongoose.model('voyages', voyageSchema)
module.exports = voyage;