const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ContendantSchema = new mongoose.Schema({
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
    ph: {
        type: String,
        required: true,
        required: 'This field is required.'
    },
    imagename: {
        type: String,
        required: 'This field is required.'
    },
    contend: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContendModels',
    }], 
    createAt: {
        type: Date,
        default: Date.now
    }
   
})
  
module.exports = mongoose.model('Contendant', ContendantSchema);