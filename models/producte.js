const mongoose = require('mongoose');


let producteSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clients',
        required: true
    },
    stock: {
        type: Number,
        min: 0,
        required: true
    },
    preu: {
        type: Number,
        min: 0.01,
        required: true
    },
    imatge: {
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
        maxlength: 100
    },
    enviament: {
        type: Boolean
    },
    recogida: {
        type: Boolean
    },
    temporada: {
        type: String,
        required: true,
        enum: ['Hivern', 'Tardor', 'Primavera', 'Estiu']
    },
    tipus: {
        type: String,
        required: true,
        enum: ['Creilla', 'Taronja', 'Raim', 'Coliflor', 'Tomaca', 'Maduixa'] //TODO
    }
});


let Producte = mongoose.model('products', producteSchema);
module.exports = Producte;