const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')

    if(!authHeader){
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    if(!token || token===''){
        req.isAuth = false;
        return next();
    }

    try{
        const decodedToken = jwt.verify(token, 'radheradhe');
        req.isAuth = true;
        req.userId = decodedToken
        return next();
    } catch(err){
        req.isAuth = false;
        return next();
    }
}