const express = require('express');
const bcrypt = require('bcrypt');
const { validarToken } = require('../auth/auth');
const fs = require('fs');
const path = require('path');

const Producte = require(__dirname + '/../models/producte.js');


let router = express.Router();


//TODO Fer les comprovacions de que les dades estan be i no ni ha errors d'unics
router.post('/afegir', async(req,res) => {
    let token = req.headers['authorization'];
    let resultat = validarToken(token);
    
    let idClient = resultat.id;


    try{
        //Eliminar el encabeçat de dades base64 si està present
        const base64Data = req.body.imatge.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');


        //Generar un nom unic per a la imatge
        const nomImatge = `image_${Date.now()}.png`;
        const uploadPath = path.join(__dirname,"../public/productes", nomImatge);


        fs.writeFile(uploadPath, buffer, async (error) => {

            if(error){
                console.log(error);
                return res.status(500).json({error: "Error al guardar la imatge"});
            }

            let nouProducte = new Producte({
                nom: req.body.nom,
                client: idClient,
                stock: req.body.stock,
                preu: req.body.preu,
                imatge: `/public/productes/${nomImatge}`,
                lat: req.body.lat,
                lng: req.body.lng,
                enviament: req.body.enviament,
                recogida: req.body.recogida,
                temporada: req.body.temporada,
                tipus: req.body.tipus
            });

            const resultat = await nouProducte.save();
            res.status(201).send({});
        });

    }catch(error){
        res.status(400).send({error: "Error al afegir un producte"});
    }

});

module.exports = router;