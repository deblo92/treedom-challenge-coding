const router =  require('express').Router()
const authEndPoint = require('./config/authConfig') 
const User = require('../models/User')
const validation = require('../middlewares/validators')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify = require('../middlewares/verifytoken')
const Token = require('../models/Token')

//register call
router.post(authEndPoint.registerEndPoint, validation('registerSchema'), async (req, res) => {
    const emailExist = await User.findOne({email : req.body.email});

    if(emailExist) {
        return res.status(422).send('Utente gia presente nel sistema con questa email')
    }
    const {name, email, roles, password} = req.body
    //hash password
    var salt =  bcrypt.genSaltSync(10);
    var HashedPassword = bcrypt.hashSync(password, salt)
    
    const user = new User({
        name: name,
        email: email,
        roles: roles,
        password: HashedPassword
    })
    
    try{

        const saveUser = await user.save()

        return res.send(saveUser)

    }catch(err){
       return res.status(400).send(err)
    }
})

//login call
router.post(authEndPoint.loginEndPoint, validation('loginSchema'), async (req, res) => {
    const user = await User.findOne({email : req.body.email});
    if(!user) {
        return res.status(422).send('Email non trovata nel sistema')
    }

    //Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if(!validPassword) {
        return res.status(422).send('Email errata')
    }

    const roles = Object.values(user.roles);

    //Creo il token
    const accessToken = jwt.sign({
            "UserInfo": {
                "_id": user._id,
                 "roles" : roles
            },   
        },  process.env.TOKEN_SECRET,  {expiresIn : '1h'});

    const createToken = await Token.create({
        "user_id" : user._id,
        "token" : accessToken,
        "revoked":  false,
        "created_at": Date.now(),
        "exp_at": Date.now() + (2*60*60*1000)
    });
    
    res.header('Authorization', 'Bearer '+accessToken)

    res.status(200)

    return res.send({message: 'Benvenuto ' + user.name, user: user});
})

router.get(authEndPoint.logoutEndPoint, verify, async (req, res) => {
    //recupero il token per ritrovare l'user connesso
    const removeAllToken = await Token.find({user_id: user._id}).update({revoked: true}, (err, succ)=>{
        if(err) {
            return res.status(500).send('Errore di disconnessione')
        }

        res.removeHeader('Authorization')

        return res.status(200).send({message: "Disconnesione avvenuta con successo", redirectTo : '/login'})
    })

})

router.get('/private', verify, (req, res) => {
    res.status(200).send('Sono qui')
})

module.exports = router;