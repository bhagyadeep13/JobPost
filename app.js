require('dotenv').config();
const PORT = process.env.PORT;
const DB_PATH = process.env.DB_PATH;


// Core Module
const path = require('path');
const User = require('./models/user')
// External Module
const express = require('express');
const session = require('express-session')
const multer = require('multer');
const { default: mongoose } = require('mongoose');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const authRouter = require('./routes/authRouter');
const aboutRouter = require('./routes/aboutRouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const MongoStore = require('connect-mongo');
const store = MongoStore.create({
  mongoUrl: DB_PATH,
  collectionName: 'sessions',
});


/*const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ||file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
}

const multerOptions = {
  storage, fileFilter
};
*/
//app.use(multer(multerOptions).single('photo')); // single file upload with field name 'photo'
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
/*app.use(express.static(path.join(rootDir, 'public')))

app.use("/public/images",express.static(path.join(rootDir, 'public/images'))) //
//Agar home add karne ke samay photo upload karte hain toh public/images path  wali images ki request ko serve karne ke liye use karte hain 
app.use("/host/public/images",express.static(path.join(rootDir, 'public/images')))
app.use("/homes/public/images",express.static(path.join(rootDir, 'public/images')))
*/
app.use(session({ // session middleware
  secret : "bhagyadeep",
  resave: false,
  saveUninitialized : false,
  store: store
}))

/*app.use((req,res,next)=>{
 req.session.IsLoggedIn = req.session.IsLoggedIn
 next()
})*/
/*app.use((req,res,next)=>{
  if(req.get('Cookie'))
  {
    req.session.IsLoggedIn = req.get('Cookie')?.split('=')[1];
  }
  else
  {
    req.session.IsLoggedIn = false;
  }
  next();
})*/

app.use(storeRouter);
app.use(authRouter);
app.use(aboutRouter);

app.use('/host',(req,res,next)=>{
  if(req.session.IsLoggedIn)
  {
    next();
  }
  else
  {
    res.redirect('/login')
  }
})  
// pehle request me isLoggedIn == true ho tabhi next karo nhi toh "/" redirect ho
app.use("/host", hostRouter); 

app.use(errorsController.pageNotFound);


mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});

// hamesha trust but verify