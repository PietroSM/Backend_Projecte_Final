const jwt = require('jsonwebtoken');

let generarToken = (id, login, rol) => jwt.sign(
    {id: id, login: login, rol: rol},
    process.env.SECRET,
    {expiresIn: "24 hours"});

//TODO ni ha que procesar el token i llevar el bearen
let validarToken = token => {
    try {
        console.log();
        let resultat = jwt.verify(token.substring(7),process.env.SECRET);

        return resultat;
    } catch (e) {

        // console.log(e);
        return false;
    }
}


module.exports = {
    generarToken: generarToken,
    validarToken: validarToken
};