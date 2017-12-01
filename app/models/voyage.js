const mongoose = require('mongoose');


let voyageSchema = new mongoose.Schema({
    name: String,
    url: String,
    dateA: String,
    dateR: String,
    sejour: String,
    preview: String,
    text: String,
    img: String,
    lieux: [{
        titre: {
            type: String
        },
        text: {
            type: String
        },
        img: {
            type: String
        }
    }],
})

let voyage = mongoose.model('voyages', voyageSchema)
module.exports = voyage;