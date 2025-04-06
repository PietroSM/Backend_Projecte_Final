const express = require('express');
const bcrypt = require('bcrypt');
const { validarToken } = require('../auth/auth');
const fs = require('fs');
const path = require('path');

const Cistella = require(__dirname+'/../models/cistella.js');


let router = express.Router();


//TODO falta restar eixa quantitat al producte
router.post('/', async(req, res) => {
    let token = req.headers['authorization'];
    let resultat = validarToken(token);
    
    let idClient = resultat.id;

    console.log(req.body);

    try{

        const existeixCistella = await Cistella.find({
            client : idClient
        });

        
        if(existeixCistella > 0){
            
            const afegirProducte = await Cistella.findOneAndUpdate(
                {client: idClient},
                { $push : {productes : {
                    producte: req.body.idProducte,
                    quantitat: req.body.quantitat,
                    preu: req.body.preuTotal
                }} },
                { new: true }
            );
            
            if(!afegirProducte){
                res.status(404).send({error: "No s'ha trobat la cistella"});
            }
            
            res.status(201).send({resultat: "S'ha afegit correctament"});
        }else{
            
            const novaCistella = new Cistella({
                client: idClient,
                productes : [{
                    producte: req.body.idProducte,
                    quantitat: req.body.quantitat,
                    preu: req.body.preuTotal
                }]
            });
            
            console.log(novaCistella);

            const resultatNovaCistella = await novaCistella.save();

            console.log("hola" + resultatNovaCistella);

            res.status(201).send({resultat: "S'ha afegit correctament" })
        }
    } catch(error){
        res.status(500).send({error: "Error al afegir a la cistella"});
    }
});


//Obtindre el llistat de productes de una cistella.
router.get('/', async(req, res) => {
    let token = req.headers['authorization'];
    let resultat = validarToken(token);
    
    let idClient = resultat.id;

    let productes = [];
    let preuTotal = 0;

    try {
        // const existeixCistella = await Cistella.findOne({
        //     client : idClient
        // }).populate('productes.producte').populate('productes.producte.client').lean();
        const existeixCistella = await Cistella.findOne({ client: idClient })
            .populate({
                path: 'productes.producte',
                populate: {
                    path: 'client',
                    model: 'clients'
                }
            })
            .lean();


        if(existeixCistella) {
            
            existeixCistella.productes.forEach(element => {

                console.log(element);
                productes.push({
                    producte: {
                                'nom': element.producte.nom,
                                'stock': element.producte.stock,
                                'preu': element.producte.preu,
                                'imatge': element.producte.imatge,
                                'lat': element.producte.lat,
                                'lng': element.producte.lng,
                                'enviament':element.producte.enviament,
                                'temporada': element.producte.temporada,
                                'tipus': element.producte.tipus,
                                'id': element.producte._id,
                                'client': {
                                    'id': element.producte.client._id,
                                    'nom': element.producte.client.nom,
                                    'cognom': element.producte.client.cognom,
                                    'correu': element.producte.client.correu,
                                    'imatge': element.producte.client.imatge,
                                    'lat': element.producte.client.lat,
                                    'lng': element.producte.client.lng
                            }
                    },
                    quantitat: element.quantitat,
                    preu: element.preu
                });

                console.log("preu" + element.preu);
                preuTotal += element.preu
                console.log(preuTotal);


            });
            // console.log(JSON.stringify(productes, null, 2));



            const resultatCistella = {
                productes: productes,
                idCistella: existeixCistella._id,
                preuTotal: preuTotal
            };

            console.log(resultatCistella);

            res.status(200).send({Cistella: resultatCistella});

        } else {

        }



    } catch (error) {
        
    }


});




module.exports = router;