const express = require('express')
const bcrypt = require('bcrypt')
const multer = require('multer')
var flash = require('connect-flash');
const path = require('path')
const User = require('../models/User')
const Posts = require('../models/Post')
const Contact = require('../models/Contact')
const Contendant = require('../models/Contendant')
const Tradition = require('../models/Tradition')
const Braider = require('../models/Braider')
const Birthday = require('../models/Birthday')
const ShootBooking = require('../models/ShootBooking')
const Wedding = require('../models/Wedding')
const Coronation = require('../models/Coronation')
const Advert = require('../models/Advert')
const passport = require('passport')
const { ensureAuth, ensureGuest } = require('../config/auth');
const ContendModels = require('../models/ContendModels');

// const { upload } = require('../middleware/auth')



const router = express.Router()

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-'+ Date.now() +
        path.extname(file.originalname))
    }
})

//init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 15000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('myImage')

function checkFileType(file, cb){
    //Allow ext
    const filetypes = /jpeg|jpg|png|gif/
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
        if(mimetype && extname){
            return cb(null, true)
        } else {
            cb('Error: Images Only')
        }
}
//@routr GET /

router.get('/', async (req, res) => {
    try {
        const list = await Advert.find().lean()
        list.sort().reverse()
       
        if(!list){
            return res.render('/')
        } else {
            res.render('home', { 
                layout: 'main',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 
//Register Routes
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'register',
    })
}) 

router.post('/register', async (req, res) => {
    const {name, email, password } = req.body
     User.findOne({email: email })
     .then(user => {
         if(user){
             res.render('userregister')
         } else {
             const newUser = new User({
                 name,
                 email,
                 password
             })
             
             bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
             if(err) throw err
                 newUser.password = hash
                 newUser.save()
                 .then(user => {
                     res.redirect('/login')
                 })
                 .catch(err => console(err))
             }))
         }
     })
 })
//@routr GET /
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'login',
    })
}) 

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/tradition',
    failureRedirect: '/login',
    failureFlash: true
    })(req, res, next)
}) 
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        layout: 'main',
    })
}) 


router.get('/create', ensureAuth, (req, res) => {
    res.render('create', {
        layout: 'trade',
    })
}) 

//FOR COLLECTION AND VIEWING OF INFORMATION/SHOW
router.get('/show', ensureAuth, async (req, res) => {
    try {
        const list = await ShootBooking.find().lean()
        list.sort().reverse()
        if(!list){
            return res.render('users')
        } else {
            res.render('show', { 
                layout: 'trade',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 
router.post('/show', async (req, res) => {
    const newShoot = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        photo: req.body.photo,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    }

    if (newShoot) {
        const newtake = new ShootBooking(newShoot)
        newtake.save((err, doc) => {
            if(!err) {
                res.redirect('/')
            }  else {
                console.log("Error during validation Check Your Email")
                res.redirect('viewTraditional')
            }
        })
    }

}) 
router.get('/delete/:id', (req, res) => {
    ShootBooking.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err){
            res.redirect('/show')
        } else {
            res.redirect('/show')
        }
    })
})

router.get('/deleteContendant/:id', (req, res) => {
    Contendant.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err){
            res.redirect('/display')
        } else {
            res.redirect('/display')
        }
    })
})

router.post('/upload', async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('create', {
                msg: err
            })
        } else {
            var myFile = req.file.filename
            const newFile = { 
                img: myFile,
                title: req.body.title,
                description: req.body.description
            }
             //console.log(newFile)
            if(newFile){
                $posts = new  Posts({
                    imagename: myFile,
                    title:req.body.title,
                    description: req.body.description
                })
                 $posts.save()
                 res.render('create', {
                    msg: "You have Successfully Uploaded a file"
                 })
            }
            
        }
    })
}) 

router.get('/tradition', ensureAuth, (req, res) => {
    res.render('tradition', {
        layout: 'trade',
    })
}) 

router.post('/uploads', async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('tradition', {
                msg: err
            })
        } else {
            var myFile = req.file.filename
            const newFile = { 
                img: myFile,
                title: req.body.title,
                description: req.body.description
            }
             //console.log(newFile)
            if(newFile){
                $tradition = new  Tradition({
                    imagename: myFile,
                    title:req.body.title,
                    description: req.body.description
                })
                 $tradition.save()
                 res.render('tradition', {
                    msg: "You have Successfully Uploaded a file"
                 })
                //  res.redirect('/tradition')
            } else {
                res.render('tradition', {
                    msg: "Error the file was To large"
                 })
            }
           
        }
    })
}) 
//For Braider
router.get('/braider', ensureAuth, (req, res) => {
    res.render('braider', {
        layout: 'trade',
    })
}) 

router.post('/uploadb', async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('braider', {
                msg: err
            })
        } else {
            var myFile = req.file.filename
            const newFile = { 
                img: myFile,
                title: req.body.title,
                description: req.body.description
            }
             //console.log(newFile)
            if(newFile){
                $braider = new  Braider({
                    imagename: myFile,
                    title:req.body.title,
                    description: req.body.description
                })
                 $braider.save()
                 res.render('braider', {
                    msg: "You have Successfully Uploaded a file"
                 })
            }
           
        }
    })
}) 
//View Beauty
router.get('/viewBeauty', async (req, res) => {

    try {
        const list = await Posts.find().limit(8).lean()
        list.sort().reverse()
        if(!list){
            return res.render('users')
        } else {
            res.render('viewBeauty', { 
                layout: 'others',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 
//View Traditionals 
router.get('/viewTraditional', async (req, res) => {

    try {
        const listBanner = await Advert.find().limit(1).lean()
        listBanner.sort().reverse()
        const list = await Tradition.find().limit(8).lean()
        list.sort().reverse()
        if(!list){
            return res.render('users')
        } else {
            res.render('viewTraditional', { 
                layout: 'others',
                list,
                listBanner
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 

//View Beauty
router.get('/bride', async (req, res) => {

    try {
        const list = await Braider.find().limit(8).lean()
        list.sort().reverse()
        if(!list){
            return res.render('users')
        } else {
            res.render('bride', { 
                layout: 'others',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 


router.get('/addBirthday', ensureAuth, (req, res) => {
    res.render('addBirthday', { 
        layout: 'trade',
    })
})


router.post('/uploadbirthday', async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('addBirthday', {
                msg: err
            })
        } else {
            var myFile = req.file.filename
            const newFile = { 
                img: myFile,
                title: req.body.title,
                description: req.body.description
            }
             //console.log(newFile)
            if(newFile){
                $birthday = new  Birthday({
                    imagename: myFile,
                    title:req.body.title,
                    description: req.body.description
                })
                 $birthday.save()
                 res.render('addBirthday', {
                    msg: "You have Successfully Uploaded a file"
                 })
            } else {
                res.render('addBirthday', {
                    msg: "Images Size is too large"
                })
            }
           
        }
    })
}) 

router.get('/addWedding', ensureAuth, (req, res) => {
    res.render('addWedding', { 
        layout: 'trade',
    })
})


router.post('/uploadwedding', async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('addWedding', {
                msg: err
            })
        } else {
            var myFile = req.file.filename
            const newFile = { 
                img: myFile,
                title: req.body.title,
                description: req.body.description
            }
             //console.log(newFile)
            if(newFile){
                $wedding = new  Wedding({
                    imagename: myFile,
                    title:req.body.title,
                    description: req.body.description
                })
                 $wedding.save()
                 res.render('addWedding', {
                    msg: "You have Successfully Uploaded a file"
                 })
                // return res.redirect("/addWedding")

            } else {
                res.redirect('addWedding', {
                    msg: "Images Size is too large"
                })
            }
           
        }
    })
}) 

router.get('/addcoronation', ensureAuth, (req, res) => {
    res.render('addcoronation', { 
        layout: 'trade',
    })
})


router.post('/uploadcoronation', async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('addcoronation', {
                msg: err
            })
        } else {
            var myFile = req.file.filename
            const newFile = { 
                img: myFile,
                title: req.body.title,
                description: req.body.description
            }
             //console.log(newFile)
            if(newFile){
                $coronation = new  Coronation({
                    imagename: myFile,
                    title:req.body.title,
                    description: req.body.description
                })
                 $coronation.save()
                 res.render('addCoronation', {
                    msg: "You have Successfully Uploaded a file"
                 })
                // return res.redirect("/addCoronation")

            } else {
                res.redirect('addWedding', {
                    msg: "Images Size is too large"
                })
            }
           
        }
    })
})

//View Birthday
router.get('/birthday', async (req, res) => {

    try {
        const list = await Birthday.find().limit(8).lean()
        list.sort().reverse()
        if(!list){
            return res.render('/')
        } else {
            res.render('viewBeauty', { 
                layout: 'others',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 

//View Wedding
router.get('/wedding', async (req, res) => {
    try {
        const list = await Wedding.find().limit(8).lean()
        list.sort().reverse()
        if(!list){
            return res.render('/')
        } else {
            res.render('viewBeauty', { 
                layout: 'others',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})
//View Coronation
router.get('/coronation', async (req, res) => {

    try {
        const list = await Coronation.find().limit(8).lean()
        list.sort().reverse()
        if(!list){
            return res.render('/')
        } else {
            res.render('viewBeauty', { 
                layout: 'others',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 

router.get('/addAdvert', ensureAuth, (req, res) => {
    res.render('addAdvert', { 
        layout: 'trade',
    })
})


router.post('/uploadadvert', async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('tradition', {
                msg: err
            })
        } else {
            var myFile = req.file.filename
            const newFile = { 
                img: myFile,
                title: req.body.title,
                description: req.body.description
            }
             //console.log(newFile)
            if(newFile){
                $advert = new  Advert({
                    imagename: myFile,
                    title:req.body.title,
                    description: req.body.description
                })
                 $advert.save()
                 res.render('addAdvert', {
                    msg: "You have Successfully Uploaded a file"
                 })
                // res.redirect('/addAdvert')
            } else {
                res.render('addAdvert', {
                    msg: "Images Size is too large"
                })
            }
           
        }
    })
}) 
//View Coronation
router.get('/advert', async (req, res) => {

    try {
        const list = await Advert.find().lean()
        list.sort().reverse()
       
        if(!list){
            return res.render('/')
        } else {
            res.render('advert', { 
                layout: 'main',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 

router.get('/bookings', (req, res) => {
    res.render('bookings', {
        layout: 'trade'
    })
})

//Client Register Contendant Page
router.get('/addbookings', ensureAuth, (req, res) => {
    res.render('addbookings', { 
        layout: 'trade',
    })
})

router.post('/addbookings', ensureAuth, (req, res) => {
       upload (req, res, (err) => {
        // const {name, email, ph } = req.body
        // let user = Contendant.findOne({email: email })
        //     if(user){
        //         res.render('addbookings', {
        //             msg: "This Email Already Exit"
        //         })
        //     } else {
                var myFile = req.file.filename
                const newFile = { 
                    img: myFile,
                    name: req.body.name,
                    email: req.body.email,
                    ph: req.body.ph
                }
    
                if(newFile){
                    $advert = new  Contendant({
                        imagename: myFile,
                        name:req.body.name,
                        email: req.body.email,
                        ph: req.body.ph
                    })
                     $advert.save()
                     res.render('addbookings', {
                        msg: "Contendant Was Successfully Added"
                    })
                } else {
                    res.render('addbookings', {
                        msg: "Contendant Already Exits"
                    })
                }
            //} 
      
        }) 
 
})
//Display Contendant Page
router.get('/display', ensureAuth, async (req, res) => {
    try {
        const list = await Contendant.find().lean()
        list.sort().reverse()
       
        if(!list){
            return res.render('/')
        } else {
            res.render('display', { 
                layout: 'trade',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})
//Contendant Upload Page
router.get('/contendantUploadPage/:id', ensureAuth, async (req, res) => {
    const user = req.params.id
    try {
        const list = await Contendant.findById({_id: user}).lean()
        if(!list){
            return res.render('/')
        } else {
            res.render('contendantUploadPage', { 
                layout: 'trade',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }

})

router.post('/uploadContendant', ensureAuth, async (req, res) => {
    upload (req, res, async (err) => {
        try {
            var myFile = req.file.filename
            const newFile = { 
                img: myFile,
                title: req.body.title,
                description: req.body.description,
                user: req.body.user
            }
            const userId = req.body.user 
            const newT = new  ContendModels({
                imagename: myFile,
                title:req.body.title,
                description: req.body.description,
                user: userId
            })

           if(newT) {
             const usermodel = await Contendant.findById(userId)
             newT.user = usermodel  
             await ContendModels.create(newT)
             usermodel.contend.push(newT)
             await usermodel.save() 
             res.render('contendantUploadPage', {   
                msg: "Successfull"     
             })
           }
        } catch (error) {
            console.log(error)
        }

    })
}) 

//Display Contendant Page
router.get('/publicview', async (req, res) => {
    try {
        const list = await Contendant.find().lean()
        list.sort().reverse()
       
        if(!list){
            return res.render('/')
        } else {
            res.render('publicview', { 
                layout: 'contendLayout',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})


router.get('/contendants/:id', async (req, res) => {
    const query = { 
        user: req.params.id
    }
    try {
        const userId = req.params.id
        const user = userId
         const list = await ContendModels.find({user: user}).limit(3).lean()
         const list1 = await ContendModels.find({user: user}).limit(1).lean()
         const list2 = await ContendModels.find({user: user}).limit(1).lean()
          const list3 = await ContendModels.find({user: user}).limit(1).lean()
         const countRecord = await ContendModels.countDocuments(query);
         list.sort().reverse()
         if(!list){
            return res.render('/error/404')
        } else { 
        //    let t = users[0].timeout/3600
            res.render('contendants', {  
                layout: 'contendLayout',  
                list,
                list1,
                list2,
                list3,
                countRecord
             })  
        }  
        } catch (error) { 
            console.log(error) 
        }

})


router.post('/contendants', async (req, res) => {
    const newVote = {
        // name: req.body.name,
        // email: req.body.email,
        // ph: req.body.ph,
        user: req.body.user
    }
    try {
        // let voter = await ContendModels.findOne({ email: req.body.email})
        if(!newVote) {
            res.render("contendants", {
                msg: "Email Exits"
            })
        } else {
            await ContendModels.create(newVote)
            res.render("contendants", {
                msg: "You Have Voted Successfully!!!"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/contact", async (req, res) => {
   res.render("contact", {
       layout: "others"
   })
})
router.post("/contact", async (req, res) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        msg: req.body.msg
    }
   
    try {
        // let voter = await ContendModels.findOne({ email: req.body.email})
        if(!contact) {
            res.render("contact")
        } else {
            await Contact.create(contact)
            res.render("contact", {
                msg: "Your message has been recieved we get back shortly"
            })
        }
    } catch (error) {
        console.log(error)
    }
    
 })

 //FOR COLLECTION AND VIEWING OF INFORMATION/SHOW
router.get('/contact_show', ensureAuth, async (req, res) => {
    try {
        const list = await Contact.find().lean()
        list.sort().reverse()
        if(!list){
            return res.render('contact_show')
        } else {
            res.render('contact_show', { 
                layout: 'trade',
                list
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
}) 

router.get('/delete_contact/:id', (req, res) => {
    Contact.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err){
            res.redirect('/contact_show')
        } else {
            res.redirect('/contact_show')
        }
    })
})
module.exports = router


