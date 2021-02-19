const mongoose = require('mongoose')

const CoronationSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
     description: {
        type: String,
        trim: true,
        required: true
    },
    imagename: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    }
   
})
module.exports = mongoose.model('Coronation', CoronationSchema);