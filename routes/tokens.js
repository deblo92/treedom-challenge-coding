const router =  require('express').Router()
const jwt = require('jsonwebtoken')
const verify = require('../middlewares/verifytoken')
const Token = require('../models/Token')
const ROLE_LIST = require('../config/roles_list')

router.post('/revoke', verify, async (req, res) => {
    const { token, created_by } =  req.body

    if(token && !created_by){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {
            if(err){
                return res.status(401).send('Token non piu valido')
            }  

            if(req.user.UserInfo.roles.includes(ROLE_LIST.ADMIN) || data.UserInfo._id === req.user._id){
                //Solo un admin puo revocare i token oppure il "proprietario del token"
                const revokeToken = await Token.findOneAndUpdate(token, {revoked: true});
                return revokeToken ? res.status(200).send('Token revocato con successo') : res.status(500).send('Errore revoca token');        

            }
    
            return res.status(200).send('Token revocato con successo');
        })
    }else if(created_by && !token){
        //se é presente il created_by non importa che passo il token principale
        if(req.user.UserInfo.roles.includes(ROLE_LIST.ADMIN) && !token){
            const revokeToken = await Token.updateMany({created_at: { $lte : created_by}}, {revoked: true})

            return revokeToken ? res.status(200).send('Token revocati con successo') : res.status(500).send('Errore revoca token con data');        

        }else{
            return res.status(401).send('Operazione non consentita');
        }
    }else{
        return res.status(500).send('Errore invio dati')
    }
    
})


module.exports = router;




