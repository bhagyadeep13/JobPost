require('dotenv').config();

const DB_PATH="mongodb+srv://root:root@cluster0.njruhao.mongodb.net/Job?appName=Cluster0"
const PORT = 3000;


// Core Module
const path = require('path');
const User = require('./models/user')
// External Module
const express = require('express');
const session = require('express-session')
const { default: mongoose } = require('mongoose');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
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

app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(session({ // session middleware
  secret : "bhagyadeep",
  resave: false,
  saveUninitialized : false,
  store: store
}))


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