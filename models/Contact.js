const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: true,
        required: 'This field is required.'
    },
    phone: {
        type: String,
        required: true,
        required: 'This field is required.'
    },
    msg: {
        type: String,
        required: true,
        required: 'This field is required.'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
   
})
  
module.exports = mongoose.model('Contact', ContactSchema);