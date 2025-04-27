const Missatge = require('../models/missatge');
const Conversa = require('../models/conversa');
const Client = require('../models/client');

const { validarToken } = require('../auth/auth');


//TODO
module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Connectat: ${socket.id}`);


    // Unir a una conversa (si existeix)
    socket.on('joinConversa', (conversaId) => {
      socket.join(conversaId);
      console.log(`📥 Socket ${socket.id} s'ha unit a la conversa ${conversaId}`);
    });


    // Enviar un missatge
    socket.on('enviarMissatge', async (missatge) => {
      try {
        // let token = req.headers['authorization'];
        let validar = validarToken('bearer ' + missatge.token);
        let idClient = validar.id;


        // console.log(missatge);

        let conversaResultat = await Conversa.findById(missatge.idConversa);
        let emisorResultat = await Client.findById(idClient);
        

        // Guardar el missatge
        const nouMissatge = new Missatge({
          conversa: conversaResultat,
          emisor: emisorResultat,
          text: missatge.text
        });

        // console.log(nouMissatge);

        const guardat = await nouMissatge.save();

        let missatgeEnviar = {
          idMissatge: guardat._id,
          conversaId: guardat.conversa._id,
          emisorId: guardat.emisor._id,
          data: guardat.data,
          text: guardat.text
        };

        // Reenviar-lo a la sala de la conversa
        io.to(missatge.idConversa.toString()).emit('nouMissatge', missatgeEnviar);

      } catch (error) {
        console.error('❌ Error:', error);
        socket.emit('errorMissatge', { error: 'No s’ha pogut enviar el missatge.' });
      }
    });



    // Quan un client es desconnecta
    socket.on('disconnect', () => {
      console.log(`❌ Desconnectat: ${socket.id}`);
    });
  });
};
