const jwt = require('jsonwebtoken');

let generarToken = (id, login, rol) => jwt.sign(
    {id: id, login: login, rol: rol},
    process.env.SECRET,
    {expiresIn: "24 hours"});

let validarToken = token => {
    try {
        let resultat = jwt.verify(token,process.env.SECRET);
        return resultat;
    } catch (e) {
        console.log(e);
    }
}

let protegirRuta = (req, res, next) => {
    let token = req.headers['authorization'];
    if (validarToken(token))
        next();
    else
        res.send({ok: false, error: "Usuari no autoritzat"});
};

module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegirRuta: protegirRuta
};