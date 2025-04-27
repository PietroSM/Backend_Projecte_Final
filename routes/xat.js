const express = require('express');
const { validarToken } = require('../auth/auth');


const Conversa = require(__dirname + '/../models/conversa.js');
const Missatge = require(__dirname + '/../models/missatge.js');

let router = express.Router();

//Llistat de les converses del usuario que ha iniciat sessió
router.get('/', async(req, res) => {
    try {
        let token = req.headers['authorization'];
        let validar = validarToken(token);
        let idClient = validar.id;


        const resultat = await Conversa.find({ membres: idClient })
        .populate('membres')
        .lean();
        
        if(resultat){

          let xats = [];
          let vendedor;

          resultat.forEach(conversa => {

            conversa.membres.forEach(membre => {

              if(membre._id != idClient){
                   vendedor = {
                    'id': membre._id,
                    'nom': membre.nom,
                    'cognom': membre.preu,
                    'correu': membre.correu,
                    'imatge': membre.imatge,
                    'lat': membre.lat,
                    'lng': membre.lng,
                  }

              }
            });

            xats.push({
              id: conversa._id,
              vendedor: vendedor
            });

          });
          

          console.log(xats);

          res.status(200).send({xats});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/receptor/:id', async(req, res) => {
  const conversaId = req.params.id
  let token = req.headers['authorization'];
  let validar = validarToken(token);
  let idClient = validar.id;

  try {
    const resultatConversa = await Conversa.findById(conversaId).populate('membres');
    let client;

    resultatConversa.membres.forEach(membre => {
      if(membre._id != idClient){
        client = {
          'id': membre._id,
          'nom': membre.nom,
          'cognom': membre.cognom,
          'correu': membre.correu,
          'imatge': membre.imatge,
          'lat': membre.lat,
          'lng': membre.lng,
          }
      }
    });

    res.status(200).send({client});

  } catch (error) {
    
  }

});




//Obtindre missatges d'una conversa
router.get('/:id', async(req, res) => {
  const conversaId = req.params.id

  try {
    const resultat = await Missatge.find({ conversa: conversaId }).sort({ data: 1 }).populate('emisor');



    missatges = [];

    resultat.forEach(missatge => {

      missatges.push({
        emisor: missatge.emisor._id,
        text: missatge.text,
        data: missatge.data
      });

    });

    // console.log(missatges);

    res.status(200).json(missatges);
  } catch (error) {
    console.error('Error carregant missatges:', error);
    res.status(500).json({ error: 'Error carregant missatges' });
  }
});






//Crear Nova Conversa
//TODO repassar sintaxis
router.post('/', async (req, res) => {
    let token = req.headers['authorization'];
    let validar = validarToken(token);
  
    let idClient = validar.id;
    let idVendedor = req.body.idVendedor;
  
    if (!idClient || !idVendedor) {
      return res.status(400).json({ error: 'Falten participants' });
    }
  
    try {
      let conversa = await Conversa.findOne({
        membres: { $all: [idClient, idVendedor], $size: 2 }
      });
  
      if (!conversa) {
        conversa = new Conversa({ membres: [idClient, idVendedor] });
        await conversa.save();
      }
  
      res.status(200).json(conversa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en crear o trobar la conversa' });
    }
  });
  






module.exports = router;