const jwt = require('jsonwebtoken');

// Verificar Token

let verifyToken = (req, res, next) => {
    let token = req.get('Auth');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.user = decoded.user;
        next();
    });

}

let verifyAdmin = (req, res, next) => {
    let user = req.user;
    if(user.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

let verifyImageToken = (req, res, next) => {
    let token = req.query.token;
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
}

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyImageToken
}