const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path') 

const ShootBookingSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: 'This field is required.'
    },
      lastname: {
        type: String,
        trim: true,
        required: 'This field is required.'
    },
      phone: {
        type: String,
        trim: true,
        required: 'This field is required.'
    },
      photo: {
        type: String,
        trim: true,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: true,
        required: 'This field is required.'
    },
    subject: {
        type: String,
        required: true,
        required: 'This field is required.'
    },
     message: {
        type: String,
        required: true,
        required: 'This field is required.'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
   
})


ShootBookingSchema.path('email').validate((val) => {
   const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return emailRegex.test(val);
}, 'Invalid Email');

module.exports = mongoose.model('ShootBooking', ShootBookingSchema);