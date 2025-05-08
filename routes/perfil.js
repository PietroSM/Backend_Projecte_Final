const express = require('express');
const { validarToken } = require('../auth/auth');


const Client = require(__dirname + '/../models/client.js');

let router = express.Router();



router.get('/me', async(req, res) => {
    try {
        let token = req.headers['authorization'];
        let validar = validarToken(token);
        
        let idClient = validar.id;

        const resultat = await Client.findById(idClient);

        if(resultat) {
            const client = {
                'nom': resultat.nom,
                'cognom': resultat.cognom,
                'correu': resultat.correu,
                'imatge': resultat.imatge,
                'lat': resultat.lat,
                'lng': resultat.lng,
                'adresa': resultat.adresa,
                'propietat': true
            };

            res.status(200).send({usuari: client});
        }else{
            res.status(404).send({error: "Client no trobat."});
        }

    } catch (error) {
        res.status(500).send({error: "Error obtenint client"});        
    }
});



router.put('/:id/edit', async(req, res) => {

    try {
        
        const resultatClient = await Client.findById(req.params.id);

        if(resultatClient) {

            resultatClient.nom = req.body.nom;
            resultatClient.cognom = req.body.cognom;
            resultatClient.correu = req.body.correu;
            resultatClient.lat = req.body.lat;
            resultatClient.lng = req.body.lng;
            resultatClient.adresa = req.body.adresa;

            const result = await resultatClient.save();

            res.status(201);
        } else {
            res.status(400).send({error: "Client no trobat."});
        }
    } catch (error) {
        res.status(500).send({error: "Error actualitzant client"});        
    }
});



router.get('/:id', async(req, res) => {
    try {
        let token = req.headers['authorization'];
        let validar = validarToken(token);
        
        let idClient = validar.id;

        const resultat = await Client.findById(req.params.id);

        if(resultat) {
            const client = {
                'nom': resultat.nom,
                'cognom': resultat.cognom,
                'correu': resultat.correu,
                'imatge': resultat.imatge,
                'lat': resultat.lat,
                'lng': resultat.lng,
                'adresa': resultat.adresa,
                'propietat': resultat._id == idClient ? true : false
            };

            res.status(200).send({client});
        }else{
            res.status(404).send({error: "Client no trobat."});
        }

    } catch (error) {
        res.status(500).send({error: "Error obtenint client"});        
    }
});





module.exports = router;