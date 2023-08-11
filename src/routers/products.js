const express = require('express')
const Product = require('../models/Products')
const User = require('../models/Users')
const Ex_asyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const mongoose = require('mongoose')
const { Types: {ObjectId}} = mongoose

const router = express.Router() //라우터 정의

//전체 상품목록 조회
router.get('/', isAuth, Ex_asyncHandler(async (req, res, next)=> {
    const products = await Product.find({user: req.user._id})
    if(products.length === 0 ){
        res.status(404).json({code: 404, message: '상품을 찰을 수 없습니다.'})
    }else{
        res.json({ code: 200, products})
    }
}))

//특정 상품 조회 (by product's id)
router.get('/:id', isAuth, Ex_asyncHandler(async (req, res, next)=> {
    const product = await Product.find({
        user: req.user._id,
        _id: req.params.id
    })
    if(!product){
        res.status(404).json({code: 404, message: '해당 상품을 찾을 수 없습니다.'})
    }else{
        res.status(200).json({code: 200, product})
    }
}))

//상품 등록
router.post('/', isAuth, Ex_asyncHandler(async (req, res, next)=> {
    const searchProduct = await Product.findOne({
        category: req.body.category,
        name: req.body.name,
    })
    
    if(!searchProduct){
        //새로운 상품 등록 저장
        const product = new Product({
            category: req.body.category,
            name: req.body.name,
            imgURL: req.body.imgURL,
            user: req.user._id,
            description: req.body.description
        })
        const newProduct = await product.save()
        
        if(!newProduct){
            //상품등록 실패시
            res.status(401).json({code: 401, message: '상품 저장에 실패하였습니다.'})
        }else{
            //상품등록 성공시
            res.status(201).json({
                code: 201,
                message: '새로운 상품이 등록되었습니다.',
                newProduct
            })
        }
    }else{
        //중복 상품이 있을시
        res.status(204).json({code: 204, message: '추가하시려는 상품이 이미 존재합니다.'})
    }
}))

//특정상품 변경
router.put('/:id', isAuth, Ex_asyncHandler( async (req, res, next)=> {
    const product = await Product.findOne({
        user: req.user._id,
        _id: req.params.id
    })
    if(!product){
        res.status(404).json({code: 404, message: '해당 상품을 찾을 수 없습니다.'})
    }else{
        product.category = req.body.category || product.category
        product.name = req.body.name || product.name
        product.imgURL = req.body.imgURL || product.imgURL
        product.lastModifiedAt = Date.now()
        
        const updatedProduct = await product.save()
        const {category, name, imgURL, user,createdAt } = updatedProduct
        res.json({
            code: 200,
            category, name, imgURL, user, createdAt
        })
    }
}))

//특정상품 삭제
router.delete('/:id', isAuth, Ex_asyncHandler(async (req, res, next)=> {
    const product = await Product.findOneAndDelete({
        user: req.user._id,
        _id: req.params.id
    })
    if(!product){
        res.status(404).json({ code: 404, message: '해당 상품을 찾을 수 없습니다.'})
    }else{
        res.status(204).json({ code: 204, message: '해당 상품이 삭제되었습니다.'})
    }
}))

//관리자 권한 사용자 데이터 그룹핑 (by field)
router.get('/group/:field', isAuth, Ex_asyncHandler(async (req, res, next)=> {
    if(!req.user.isAdmin){
        res.status(401).json({code: 401, message: '해당 서비스에 관한 권한이 없습니다.'})
    }else{
        const documents = await Product.aggregate([
            {
                $group: {
                    _id: `$${req.params.field}`,
                    count: {$sum: 1}
                }
            }
        ])

        console.log(`Num of Group: ${documents.length}`)
        documents.sort( (doc1, doc2) => doc1._id - doc2._id)
        res.json({code: 200, documents})
    }
}))
//관리자 권한 사용자 데이터 그룹핑 (by date)
router.get('/group/date/:field', isAuth, Ex_asyncHandler(async (req, res, next)=> {
    if(!req.user.isAdmin){
        res.status(401).json({code: 401, message: '해당 서비스에 관한 권한이 없습니다.'})
    }else{
        if(req.params.field === 'createdAt'|| req.params.field === 'lastModifiedAt'){
            const documents = await Product.aggregate([
                {
                    $group: {
                        _id: {  year: {$year: `$${req.params.field}`}, 
                                month: {$month: `$${req.params.field}`}
                             },
                        count: {$sum: 1}
                    }
                }
            ])
    
            console.log(`Num of Group: ${documents.length}`)
            documents.sort( (doc1, doc2) => doc1._id - doc2._id)
            res.json({code: 200, documents})
        }
    }
}))

//일반 사용자 데이터 그룹핑(by field)
router.get('/group/mine/:field', isAuth, Ex_asyncHandler(async (req, res, next)=> {
    const documents = await Product.aggregate([
        {
            $match: {
                user: new ObjectId(req.user._id)
            }
        },
        {
            $group: {
                _id: `$${req.params.field}`,
                count: {$sum: 1}
            }
        }
    ])

    console.log(`Num of Group: ${documents.length}`)
    documents.sort( (doc1, doc2) => doc1._id - doc2._id)
    res.json({code: 200, documents})
}))

//일반 사용자 데이터 그룹핑(by date)
router.get('/group/mine/date/:field', isAuth, Ex_asyncHandler(async (req, res, next)=> {
    if(req.params.field === 'createdAt'|| req.params.field === 'lastModifiedAt'){
        const documents = await Product.aggregate([
            {
                $match: {
                    user: new ObjectId(req.user._id)
                }
            },
            {
                $group: {
                    _id: {  year: {$year: `$${req.params.field}`}, 
                            month: {$month: `$${req.params.field}`}
                         },
                    count: {$sum: 1}
                }
            }
        ])
    
        console.log(`Num of Group: ${documents.length}`)
        documents.sort( (doc1, doc2) => doc1._id - doc2._id)
        res.json({code: 200, documents})
    }
}))


module.exports = router