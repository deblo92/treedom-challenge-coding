const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header('Authorization')

    if(!token){ return res.status(401).send('Accesso negato') }

    try{
        const verify = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET)
        req.user = verify
        next()
    }catch(err){
        res.status(401).send('Token non valido')
    }
}
