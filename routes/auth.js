const express = require('express');
const bcrypt = require('bcrypt');

const auth = require(__dirname + '/../auth/auth.js');
const User = require(__dirname + '/../models/user.js');

let router = express.Router();


router.post('/login', async(req, res) => {
    let alies = req.body.alies;
    let contrasenya = req.body.contrasenya;


    let existeixUsuari = await User.findOne({
        alies: alies,
    });

    if(existeixUsuari && bcrypt.compareSync(contrasenya,existeixUsuari.contrasenya)){
        res.status(200).send({result: auth.generarToken(existeixUsuari.id ,alies, existeixUsuari.rol)});
    }else{
        res.status(401).send({error: "login incorrecte"});
    }
});

module.exports = router;