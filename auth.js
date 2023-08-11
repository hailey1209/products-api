const config = require('./config')
const JWT = require('jsonwebtoken')
const { userInfo } = require('os')

//generate Token
const generateToken = (user) => {
    return JWT.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
    },
    config.JWT_SECRET,
    {
        expiresIn: '1d',
        issuer: 'hailey'
    })
}

//사용자 권한 검증
const isAuth = (req, res, next)=> {
    const bearerToken = req.headers.authorization
    if(!bearerToken){
        res.status(401).json({code:401, message: '사용자 권한의 기간이 만료 되었습니다.'})
    }else{
        const token = bearerToken.slice(7, bearerToken.length)
       JWT.verify(token, config.JWT_SECRET, (err, userInfo) => {
        if(err && err.name === 'TokenExpiredError'){
            res.status(419).json ({ code: 419, message: 'Token has been expired!'})
        }else if(err){
            res.status(401).json({ code: 401, message: 'Invalid token'})
        }else{
            req.user = userInfo
            next()
        }
       })
    }
}

//사용자의 관리자 권한 검증
const isAdmin = (req, res, next)=> {
    if(req.user.isAdmin && req.user){
        next()
    }else{
        res.status(401).json({ code: 401, message: '관리자 권한이 없습니다.'})
    }
}

module.exports = {
    generateToken,
    isAuth,
    isAdmin
}