const express = require('express');
const bcrypt = require('bcrypt');
const { validarToken } = require('../auth/auth');
const fs = require('fs');
const path = require('path');

const Producte = require(__dirname + '/../models/producte.js');


let router = express.Router();


//Llistat dels productes. Afegir mine
router.get('/', async(req, res) => {
    try{
        let token = req.headers['authorization'];
        let validar = validarToken(token);
        
        let idClient = validar.id;
        let propietat = false


        const resultat = await Producte.find().populate("client");
        let productes = [];
        if(resultat.length > 0){

            
            resultat.forEach(element => {
                if(idClient == element.client._id){
                    propietat = true;
                }

                const producte = {
                    'nom': element.nom,
                    'stock': element.stock,
                    'preu': element.preu,
                    'imatge': element.imatge,
                    'lat': element.lat,
                    'lng': element.lng,
                    'enviament': element.enviament,
                    'temporada': element.temporada,
                    'tipus': element.tipus,
                    'id': element._id,
                    'client': {
                        'id': element.client._id,
                        'nom': element.client.nom,
                        'cognom': element.client.cognom,
                        'correu': element.client.correu,
                        'imatge': element.client.imatge,
                        'lat': element.client.lat,
                        'lng': element.client.lng
                    },
                    'propietat': propietat
                };
                productes.push(producte);
            });


            res.status(200).send({productes: productes});
        }else{
            res.status(404).send({error: "No hi ha productes en el sistema"});
        }

    }catch(error){
        res.status(500).send({error: "Error obtenint productes"});
    }
});


//Detalls d'un producte específic.
router.get('/:id', async(req, res) => {
    try{
        console.log("hola");
        const resultat = await Producte.findById(req.params.id).populate('client');
        let token = req.headers['authorization'];
        let validar = validarToken(token);
        
        let idClient = validar.id;
        let propietat = false


        if(resultat){
            if(idClient == resultat.client._id){
                propietat = true;
            }

            const producte = {
                'nom': resultat.nom,
                'stock': resultat.stock,
                'preu': resultat.preu,
                'imatge': resultat.imatge,
                'lat': resultat.lat,
                'lng': resultat.lng,
                'enviament': resultat.enviament,
                'temporada': resultat.temporada,
                'tipus': resultat.tipus,
                'id': resultat._id,
                'client': {
                    'id': resultat.client._id,
                    'nom': resultat.client.nom,
                    'cognom': resultat.client.cognom,
                    'correu': resultat.client.correu,
                    'imatge': resultat.client.imatge,
                    'lat': resultat.client.lat,
                    'lng': resultat.client.lng
                },
                'propietat': propietat
            }

            res.status(200).send({producte: producte});
        }else{
            res.status(404).send({error: "Producte no trobat"});
        }
    }catch(error){
        res.status(500).send({error: "Error buscant el producte indicat"});
    }
});


//TODO faltaria la ruta de imatges en desplegament
//Inserta un nou producte asociat a un client
router.post('/afegir', async(req, res) => {
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
                return res.status(500).json({error: "Error al guardar la imatge"});
            }

            let nouProducte = new Producte({
                nom: req.body.nom,
                client: idClient,
                stock: req.body.stock,
                preu: req.body.preu,
                imatge: `http://localhost:8080/public/productes/${nomImatge}`,
                lat: req.body.lat,
                lng: req.body.lng,
                enviament: req.body.enviament,
                recogida: req.body.recogida,
                temporada: req.body.temporada,
                tipus: req.body.tipus,
                adresa: req.body.adresa
            });

            const resultat = await nouProducte.save();
            res.status(201).send({id: resultat._id});
        });

    }catch(error){
        
        let errors = {
            general: 'Error al afegir un producte'
        }
        
        if(error.errors){
            if(error.errors.nom){
                errors.nom = error.errors.nom.message;
            }
            if(error.errors.stock){
                errors.stock = error.errors.stock.message;
            }
            if(error.errors.preu){
                errors.preu = error.errors.preu.message;
            }
            if(error.errors.lat){
                errors.lat = error.errors.lat.message;
            }
            if(error.errors.lng){
                errors.lng = error.errors.lng.message;
            }
            if(error.errors.adresa){
                errors.adresa = error.errors.adresa.message;
            }
            if(error.errors.temporada){
                errors.temporada = error.errors.temporada.message;
            }
            if(error.errors.tipus){
                errors.tipus = error.errors.tipus.message;
            }
        }        
        res.status(400).send({errors});
    }

});

module.exports = router;