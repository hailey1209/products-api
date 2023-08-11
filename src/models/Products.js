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
    user: { //생성한 사용자의 id
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

const Product = mongoose.model('newProduct', product_Schema) //스키마 모델로 저장해줌
module.exports = Product