const express = require('express');
const bcrypt = require('bcrypt');
const { validarToken } = require('../auth/auth');
const fs = require('fs');
const path = require('path');

const auth = require(__dirname + '/../auth/auth.js');
const User = require(__dirname + '/../models/user.js');
const Client = require(__dirname + '/../models/client.js');

let router = express.Router();


router.post('/login', async(req, res) => {
    let alies = req.body.alies;
    let contrasenya = req.body.contrasenya;

    let existeixUsuari = await User.findOne({
        alies: alies,
    });

    if(existeixUsuari && bcrypt.compareSync(contrasenya,existeixUsuari.contrasenya)){
        res.status(200).send({accesToken: auth.generarToken(existeixUsuari.id ,alies, existeixUsuari.rol)});
    }else{
        res.status(401).send({error: "login incorrecte"});
    }
});


//TODO Fer les comprovacions de que les dades estan be i no ni ha errors d'unics
router.post('/registrar', async(req, res) => {
    try{
        const hash = bcrypt.hashSync(req.body.contrasenya, 10);

        let nouUsuari = new User({
            alies: req.body.alies,
            contrasenya: hash,
            rol: 'client'
        });

        const resultatUsuari = await nouUsuari.save();
        const idUsuari = resultatUsuari._id;

        //Eliminar el encabeçat de dades base64 si està present
        const base64Data = req.body.imatge.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');



        //Generar un nom unic per a la imatge
        const nomImatge = `image_${Date.now()}.png`;
        const uploadPath = path.join(__dirname,"../public/uploads", nomImatge);
        console.log(uploadPath);
        fs.writeFile(uploadPath, buffer, async (error) => {

            if(error){
                console.log(error);
                return res.status(500).json({error: "Error al guardar la imatge"});
            }
            console.log("hola");

            let nouClient = new Client({
                _id: idUsuari,
                nom: req.body.nom,
                cognom: req.body.cognom,
                correu: req.body.correu,
                imatge: `/public/uploads/${nomImatge}`,
                lat: req.body.lat,
                lng: req.body.lng
            });

            const resultat = await nouClient.save();
            res.status(201).send({});
        });

    }catch(error){
        res.status(400).send({error: "Error al registrar un client"});
    }
});




router.get('/validar', async(req, res) => {
    let token = req.headers['authorization'];

    if(validarToken(token)){
        res.status(200).send({result: true});
    }else {
        res.send({result: false});
    }
});




module.exports = router;