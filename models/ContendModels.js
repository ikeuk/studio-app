const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ContendantSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    ph: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
     description: {
        type: String,
        trim: true
    },
    imagename: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contendant',
    },
    createAt: {
        type: Date,
        default: Date.now
    }
   
})
  
module.exports = mongoose.model('ContendantModel', ContendantSchema);