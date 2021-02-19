const express = require('express')
const bcrypt = require('bcrypt')
const multer = require('multer')
var flash = require('connect-flash');
const path = require('path')
const User = require('../models/User')
const Posts = require('../models/Post')
const Contendant = require('../models/Contendant')
const Tradition = require('../models/Tradition')
const Braider = require('../models/Braider')
const Birthday = require('../models/Birthday')
const Wedding = require('../models/Wedding')
const Coronation = require('../models/Coronation')
const Advert = require('../models/Advert')
const passport = require('passport')
const { ensureAuth, ensureGuest } = require('../config/auth');
const ContendModels = require('../models/ContendModels');


module.exports = {
    upload: async function (req, res) {
        const DepositCreate = { 
            currency1: 'USD',
            currency2: req.body.coin,  
            amount: req.body.amount,       
            address: '',
            buyer_email: req.body.email,  
            invoice: '',
            custom: '',
            item_name: '',  
            item_number: '1',   
            success_url: '/',
            cancel_url: '/',
            ipn_url: 'niceipn'
          }
        const transaction = await client.createTransaction(DepositCreate)
        //console.log(transaction)
        const newTransaction = { 
            user: req.user.id, 
            amount: transaction.amount,
            txn_id: transaction.txn_id,
            timeout: transaction.timeout,
            coin: req.body.coin,
            email: req.body.email,
            purpose: req.body.purpose,
            qrcode_url: transaction.qrcode_url
        }
         //console.log(newTransaction)
        try { 
            const userId = req.user.id 
        if(transaction){   
           const newT = new Transaction(newTransaction)
            const usermodel = await User.findById(userId)
            newT.user = usermodel  
            await Transaction.create(newTransaction)
             usermodel.transaction.push(newT)
            // usermodel.deposit.push(newT)
            await usermodel.save()  
            res.render('deposit', {   
               transaction     
            })
        } else { 
            res.redirect('/deposit') 
        }     
    } 
    catch (error) { 
        console.log(error)
        res.redirect('/dashboard')  
    }
},
}