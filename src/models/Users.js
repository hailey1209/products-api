const mongoose = require('mongoose')

const { Schema } = mongoose

const user_schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true, //이메일 중복 방지
    },
    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false,
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

const User = mongoose.model('User', user_schema)
module.exports = User

// const user = new User({
//     name: 'aaa',
//     email: 'aaa@aaa.com',
//     userId: 'asdfg',
//     password: 'qwerty'
// })

// user.save().then(()=> console.log('user created'))