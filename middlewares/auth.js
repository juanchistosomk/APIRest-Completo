// Token
const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware
let verificarToken = (req, res, next) => {
    let token = req.get('Autentication');
    console.log(token);
                // Verificar TOKEN:  (token, secret,  funcion callback)
    jwt.verify( token, config.get('configToken.SEED'), (err, decoded) =>{
        if(err)
        {
            // 401 No Autorizado
           return res.status(401).json({err})
        } else {
            req.usuario=decoded.usuario;
            next();
            //res.send(token);
        }

    });
}

module.exports=verificarToken;