const mongoose = require('mongoose')

const WeddingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
     description: {
        type: String,
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
module.exports = mongoose.model('Wedding', WeddingSchema);