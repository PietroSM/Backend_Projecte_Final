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


router.get('/', async(req, res) => {

});




module.exports = router;