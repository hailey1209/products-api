const express = require('express')
const app = express()
const cors = require('cors')
const looger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios') //외부 api 사용시 사용
const config = require('./config')


const users_router = require('./src/routers/users')
const products_router = require('./src/routers/products')

//CORS OPTION
const CORS_OPTIONS = {
    origin: 'http://127.0.0.1:4000',
    credentials: true
}

//Mongo DB 연결
mongoose.connect(config.MONGODB_URL)
.then(()=> console.log('Mongo DB connected...'))
.catch( e => console.log(`Failed to connect Mongo DB: ${e}`))

//공통 미들웨어 함수
app.use(cors(CORS_OPTIONS))//cors 설정
app.use(express.json()) //request body parsing
app.use(looger('tiny')) //logger 설정


app.use('/api/users', users_router) //User Router
app.use('/api/products', products_router) //Products Router


//찾는 페이지가 없을 경우 띄워주는 에러
app.use( (req, res, next)=> {
    res.status(404).send('Page not found...')
})


//서버 내부 오류 처리
app.use( (err, req, res, next)=> {
    console.log(err.stack)
    res.status(500).send('서버에 오류가 발생하였습니다!')
})


app.listen(4000, ()=> {
    console.log('Server is running on port 4000...')
})