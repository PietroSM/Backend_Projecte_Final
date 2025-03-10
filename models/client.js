const mongoose = require('mongoose');


let clientSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 25
    },
    cognom: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    },
    correu: {
        type: String,
        required: true
    },
    imatge:{
        type: String
    },
    lat:{
        type: Number,
        required: true,
    },
    lng:{
        type: Number,
        required: true
    },
    adresa:{
        type: String,
        required: true,
        maxlength: 100
    }
});


let Client = mongoose.model('clients', clientSchema);
module.exports = Client;