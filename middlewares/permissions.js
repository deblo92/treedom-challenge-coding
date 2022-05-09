const ROLE_LIST = require('../config/roles_list')
module.exports = (req, res, next) => {
    const user = req.user

    if(!user.UserInfo.roles.includes(ROLE_LIST.ADMIN)){
        res.status(401).send('Operazione non consentita')
    }

    next()
}
