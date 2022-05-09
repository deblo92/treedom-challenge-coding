const router =  require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const validation = require('../middlewares/validators')
const bcrypt = require('bcryptjs')
const Token = require('../models/Token')

router.post('/forgot-password', async(req, res) => {
    const { email } = req.body

    if(!email){
        return res.status(422).send("Inserire una email")
    }
    
    //controllo che esiste l'utente con quella email
    User.findOne({email}, async (err, user) => {
        if(err || !user) {
            return res.status(404).send("Utente non trovato")
        }

        //invalido i token che puo aver creato precedentemente
        const userToken = await Token.updateMany({user_id: user._id}, {revoked: true});
        
        //creo il token da mettere nella email
        jwt.sign({_id: user._id}, process.env.TOKEN_SECRET,  {expiresIn : '1h'}, async (err, token) => {
            if(err || !token){
                return res.status(500).send('Errore reset password');
            }
            
            const createToken = await Token.create({
                "user_id" : user._id,
                "token" : token,
                "revoked":  false,
                "created_at": Date.now(),
                "exp_at": Date.now() + (2*60*60*1000)
            });

            res.status(200).send('Abbiamo inviato una email per il reset della password')
        })
    })
})

router.post('/reset-password', validation('resetPasswordSchema'), async (req, res) => {
    //verifico il token che mi viene mandato nel url
    const { token, password } = req.body

    if(!token){
        return res.status(500).send('Link non valido')
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {

        const checkValidToken = await Token.findOne({token}).where({revoked: false})

        if(err || !checkValidToken){
            return res.status(401).send('Link non piu valido')
        }

        var salt =  bcrypt.genSaltSync(10);
        var HashedPassword = bcrypt.hashSync(password, salt)
        
        User.findOneAndUpdate(data._id, {password: HashedPassword}, async (error, user) => {
            if(error || !data){
                return res.status(404).send('Errore salvataggio password')
            }

            //Revoke all user token for resend to login page
            const userToken = await Token.find({user_id: user._id}).update({revoked: true});

            return res.status(200).send(user)
        })
    })

})

module.exports = router