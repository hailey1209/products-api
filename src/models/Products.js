const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: {ObjectId} } = Schema

const product_Schema = new Schema({
    category: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    imgURL: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now,
    }
})

const Product = mongoose.model('newProduct', product_Schema)
module.exports = Product

// const product = new Product({
//     category: '가전',
//     name: '이름',
//     user: '123456789012345678901234',
//     imgURL: 'https://www.aaaaa.com/gjdjdjf.png',
// })
// product.save().then(()=> console.log('product created'))