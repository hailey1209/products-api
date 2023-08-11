const express = require('express')
const Product = require('../models/Products')
const Ex_asyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const router = express.Router() //라우터 정의

//전체 상품목록 조회
router.get('/', (req, res, next) => {
    res.json('전체 상품목록 조회')
})

//특정 상품 조회 (by product's id)
router.get('/:id', (req, res, next) => {
    res.json('특정 상품 조회')
})

//상품 등록
router.post('/', (req, res, next) => {
    res.json('상품등록')
})

//특정상품 변경
router.put('/:id', (req, res, next)=> {
    res.json('특정상품 변경')
})

//특정상품 삭제
router.delete('/:id', (req, res, next)=> {
    res.json('특정상품 삭제')
})

module.exports = router