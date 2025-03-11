const jwt = require('jsonwebtoken');

let generarToken = (id, login, rol) => jwt.sign(
    {id: id, login: login, rol: rol},
    process.env.SECRET,
    {expiresIn: "10 hours"});

// let validarToken = token => {
//     try {
//         let resultat = jwt.verify(token,process.env.SECRET);
//         return resultat;
//     } catch (e) {
//         console.log(e);
//     }
// }

module.exports = {
    generarToken: generarToken
};