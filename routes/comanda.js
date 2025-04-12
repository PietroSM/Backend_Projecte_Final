const express = require('express');
const bcrypt = require('bcrypt');
const { validarToken } = require('../auth/auth');
const fs = require('fs');
const path = require('path');

const Comanda = require(__dirname+'/../models/comanda.js');
const Cistella = require(__dirname+'/../models/cistella.js');



let router = express.Router();



router.get('/client', async(req, res) => {
    let token = req.headers['authorization'];
    let resultat = validarToken(token);
    let idClient = resultat.id;



    try {

        const existeixComanda = await Comanda.findOne({ client: idClient })
            .populate({
                path: 'productes.producte',
                populate: {
                    path: 'client',
                    model: 'clients'
                }
            })
            .lean();




        
    } catch (error) {
        
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