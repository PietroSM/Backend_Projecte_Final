const express = require('express');
const bcrypt = require('bcrypt');
const { validarToken } = require('../auth/auth');
const fs = require('fs');
const path = require('path');

const Comanda = require(__dirname+'/../models/comanda.js');
const Cistella = require(__dirname+'/../models/cistella.js');



let router = express.Router();


router.get('/', async(req, res) => {
    let token = req.headers['authorization'];
    let resultat = validarToken(token);
    let idClient = resultat.id;

    try {

        const existeixComanda = await Comanda.find({ client: idClient })
            .populate({
                path: 'productes.producte',
                populate: {
                    path: 'client',
                    model: 'clients'
                }
            }).populate('client').populate('Vendedor')
            .lean();

            let comandes = [];
            
            if(existeixComanda) {
                
            existeixComanda.forEach(comanda => {
                    
                let productes = [];

                comanda.productes.forEach(element => {

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
                                'preu': element.producte.client.preu,
                                'imatge': element.producte.client.imatge,
                                'lat': element.producte.client.lat,
                                'lng': element.producte.client.lng,
                                'enviament': element.producte.client.enviament,
                                'recogida': element.producte.client.recogida,
                                'temporada': element.producte.client.temporada,
                                'tipus': element.producte.client.tipus
                            }
                        },
                        quantitat: element.quantitat,
                        preu: element.preu
                    });

                });

                comandes.push({
                    id: comanda._id,
                    client : {
                        'id': comanda.client._id,
                        'nom': comanda.client.nom,
                        'cognom': comanda.client.cognom,
                        'correu': comanda.client.correu,
                        'imatge': comanda.client.imatge,
                        'lat': comanda.client.lat,
                        'lng': comanda.client.lng,
                    },
                    productes: productes,
                    preuTotal: comanda.preuTotal,
                    estatComanda: comanda.estatComanda,
                    enviament: comanda.enviament,
                    puntRecogida: comanda.puntRecogida,
                    Vendedor: {
                        'id': comanda.Vendedor._id,
                        'nom': comanda.Vendedor.nom,
                        'cognom': comanda.Vendedor.cognom,
                        'correu': comanda.Vendedor.correu,
                        'imatge': comanda.Vendedor.imatge,
                        'lat': comanda.Vendedor.lat,
                        'lng': comanda.Vendedor.lng,
                    }
                });


            });

            console.log(comandes);
            res.status(200).send({comandes});
        }
        
    } catch (error) {
        
    }
});



router.get('/vendes', async(req, res) => {
    let token = req.headers['authorization'];
    let resultat = validarToken(token);
    let idClient = resultat.id;

    try {
        const existeixComanda = await Comanda.find({ client: idClient })
        .populate({
            path: 'productes.producte',
            populate: {
                path: 'client',
                model: 'clients'
            }
        }).populate('client').populate('Vendedor')
        .lean();

        let comandes = [];
            
        if(existeixComanda) {
            
        existeixComanda.forEach(comanda => {
                
            let productes = [];

            comanda.productes.forEach(element => {

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
                            'preu': element.producte.client.preu,
                            'imatge': element.producte.client.imatge,
                            'lat': element.producte.client.lat,
                            'lng': element.producte.client.lng,
                            'enviament': element.producte.client.enviament,
                            'recogida': element.producte.client.recogida,
                            'temporada': element.producte.client.temporada,
                            'tipus': element.producte.client.tipus
                        }
                    },
                    quantitat: element.quantitat,
                    preu: element.preu
                });

            });

            comandes.push({
                id: comanda._id,
                client : {
                    'id': comanda.client._id,
                    'nom': comanda.client.nom,
                    'cognom': comanda.client.cognom,
                    'correu': comanda.client.correu,
                    'imatge': comanda.client.imatge,
                    'lat': comanda.client.lat,
                    'lng': comanda.client.lng,
                },
                productes: productes,
                preuTotal: comanda.preuTotal,
                estatComanda: comanda.estatComanda,
                enviament: comanda.enviament,
                puntRecogida: comanda.puntRecogida,
                Vendedor: {
                    'id': comanda.Vendedor._id,
                    'nom': comanda.Vendedor.nom,
                    'cognom': comanda.Vendedor.cognom,
                    'correu': comanda.Vendedor.correu,
                    'imatge': comanda.Vendedor.imatge,
                    'lat': comanda.Vendedor.lat,
                    'lng': comanda.Vendedor.lng,
                }
            });


        });

        console.log(comandes);
        res.status(200).send({comandes});
    }
        
    } catch (error) {
        
    }


});


router.get('/:id', async(req, res) => {
    let token = req.headers['authorization'];
    let resultat = validarToken(token);
    let idClient = resultat.id;

    try{
        const comanda = await Comanda.findById(req.params.id)
                .populate({
                    path: 'productes.producte',
                    populate: {
                        path: 'client',
                        model: 'clients'
                    }
                }).populate('client').populate('Vendedor')
                .lean();

        if(comanda) {
            let productes = [];

            comanda.productes.forEach(element => {
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
                            'preu': element.producte.client.preu,
                            'imatge': element.producte.client.imatge,
                            'lat': element.producte.client.lat,
                            'lng': element.producte.client.lng,
                            'enviament': element.producte.client.enviament,
                            'recogida': element.producte.client.recogida,
                            'temporada': element.producte.client.temporada,
                            'tipus': element.producte.client.tipus
                        }
                    },
                    quantitat: element.quantitat,
                    preu: element.preu
                });


            });


            res.status(200).send({comanda: {
                id: comanda._id,
                client : {
                    'id': comanda.client._id,
                    'nom': comanda.client.nom,
                    'cognom': comanda.client.cognom,
                    'correu': comanda.client.correu,
                    'imatge': comanda.client.imatge,
                    'lat': comanda.client.lat,
                    'lng': comanda.client.lng,
                },
                productes: productes,
                preuTotal: comanda.preuTotal,
                estatComanda: comanda.estatComanda,
                enviament: comanda.enviament,
                puntRecogida: comanda.puntRecogida,
                Vendedor: {
                    'id': comanda.Vendedor._id,
                    'nom': comanda.Vendedor.nom,
                    'cognom': comanda.Vendedor.cognom,
                    'correu': comanda.Vendedor.correu,
                    'imatge': comanda.Vendedor.imatge,
                    'lat': comanda.Vendedor.lat,
                    'lng': comanda.Vendedor.lng,
                },
                me: comanda.Vendedor._id == idClient ? true : false
            }});


        } else {

        }

    } catch (error){

    }

});


router.post('/', async(req, res) => {
    let token = req.headers['authorization'];
    let resultat = validarToken(token);
    let idClient = resultat.id;

    try {

        let productesNou = [];

        req.body.productes.forEach(element => {
            // console.log(element);
            productesNou.push({
                producte: element.producte.id,
                quantitat: element.quantitat,
                preu: element.preu
            });
        });

        let novaComanda = new Comanda ({
            client: idClient,
            productes: productesNou,
            preuTotal: req.body.preuTotal,
            estatComanda: 'Preparacio',
            enviament: true,
            puntRecogida: true,
            Vendedor: req.body.idVendedor
        });

        const resultaComanda = await novaComanda.save();

        const esborrarCistella = await Cistella.findByIdAndDelete(req.body.idCistella);

        let idComanda = resultaComanda._id;

        res.status(200).send({idComanda});

    } catch (error) {
        console.log(error);
        res.status(500).send({error});

    }
});



module.exports = router;