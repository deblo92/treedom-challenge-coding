const router =  require('express').Router()
const verify = require('../middlewares/verifytoken')
const canChangePermission = require('../middlewares/permissions');
const User = require('../models/User');
const Token = require('../models/Token');

router.post('/change', verify, canChangePermission, async (req, res) => {
    const { email, roles } = req.body;
    if(!email || !roles){
        return res.status(500).send('Dati mancanti per il cambio dei permessi')
    }

    User.findOneAndUpdate({email}, {roles}, async (err, user) => {
        if(err || !user){
            return res.status(404).send('Nessun utente trovato')
        }

        //revoco tutti i token dell'utente in modo da rifagli fare il login ed avere un token con i permessi nuovi
        const userToken = await Token.find({user_id: user._id}).update({revoked: true});
        
        return res.status(200).send('Cambio permessi effettuato con successo')
    })
})


module.exports = router;




