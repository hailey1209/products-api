const express = require('express')
const User = require('../models/Users')
const Ex_asyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')
const { MongoUnexpectedServerResponseError } = require('mongodb')

const router = express.Router() //라우터 정의

//회원가입
router.post('/register', Ex_asyncHandler(async (req, res, next)=>{
    console.log(req.body)
    //새로운 유저의 정보 저장
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        password: req.body.password,
    })
    const newUser = await user.save()

    if(!newUser){
        res.status(401).json({ code: 401, message: 'Invalid User Data'})
    }else{
        const {name, email, userId, isAdmin, createdAt} = newUser
        res.json({
            code: 200,
            token: generateToken(newUser),
            name, email, userId, isAdmin, createdAt,
        })
    }
}))

//로그인
router.post('/login', isAuth, Ex_asyncHandler(async (req, res, next)=>{
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    if(!user){
        res.status(404).json({code: 404, message: '아이디 / 비밀번호를 확인해 주세요.'})
    }else{
        const { name, email, userId, isAdmin, createdAt} = user
        res.json({
            code: 200,
            token: generateToken(user),
            name, email, userId, isAdmin, createdAt
        })
    }
}))

//로그아웃
router.post('/logout', (req, res, next) => {
    res.json('로그아웃')
})

//사용자정보 변경
router.put('/:id', (req, res, next)=> {
    res.json('사용자정보 변경')
})

//사용자정보 삭제
router.delete('/:id', (req, res, next)=> {
    res.json('사용자정보 삭제')
})

module.exports = router //이거 없으면 데이터 생성 안됨
