require('./config/db');
const path = require('path')
const express = require('express')
var flash = require('connect-flash');
const mongoose = require('mongoose')
const multer = require('multer')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const Posts = require('./models/Post')
const exphbs = require('express-handlebars')
const session = require('express-session')
dotenv.config({ path: './config/config.env' })
const MongoStore = require('connect-mongo')(session) 

//set Storage engine

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
    limits:{fileSize: 1000000},
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

const app = express()


//Body Parsar
app.use(express.urlencoded( { extended: false} ))
app.use(express.json())


require('./config/passport')(passport)
//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


//Express session middle ware
//logging


//Handlebars
app.engine('.hbs', exphbs({ 
  defaultLayout: 'main', 
  extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
	 store: new MongoStore({mongooseConnection: mongoose.connection})
}))
app.use(flash());
//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))



const PORT = process.env.PORT || 5000

app.listen(
    PORT,  
    console.log(`Server ruunning in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
)