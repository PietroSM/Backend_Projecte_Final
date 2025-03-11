const mongoose = require('mongoose');


let userSchema = new mongoose.Schema({
    alies: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    contrasenya: {
        type: String,
        required: true,
        minlength: 8
    },
    rol: {
        type: String,
        required: true,
        enum: ['client', 'admin']
    }
});


let User = mongoose.model('users', userSchema);
module.exports = User;