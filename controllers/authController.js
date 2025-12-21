const { check, validationResult } = require("express-validator");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const { use } = require("react");

exports.getLogIn = async (req, res, next) => {
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after displaying it
  await req.session.save();
  res.render("auth/login", {
    pageTitle: "Login Page",
    currentPage: "Login",
    IsLoggedIn: false,
    toastMessage: toastMessage,
    error: [],
    oldInput: {
      email: '',
      password: ''
    },
    user: {}
})
};

exports.postLogIn = async (req, res, next) => {
  console.log(req.body)
  const { email, password } = req.body;
  console.log(email, password)
  const User = await user.findOne({ email: email })
  {
    console.log("User: ", User);
    if (!User) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login Page",
        currentPage: "Login",
        IsLoggedIn: false,
        toastMessage: null,
        error: ["Invalid email or password"],
        oldInput: {
          email: email,
          password: password
        },
        toastMessage: null,
        user: {}
      });
    }
    else{
      const doMatch = await bcrypt.compare(password, User.password)
    if (!doMatch) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login Page",
        currentPage: "Login",
        IsLoggedIn: false,
        toastMessage: null,
        error: ["Invalid password"],
        oldInput: {
          email: email,
          password: password
        },
        toastMessage: null,
        user: {}
      });
    }
    else
    {
      console.log("User logged in Successfully");
      req.session.user = User; // Store the user in the session
      req.session.toastMessage = {type: 'success', text: 'User LoggedIn successfully!.'};
      req.session.IsLoggedIn = true;
      await req.session.save();
      res.redirect("/about"); // Redirect to the home page after successful login
    }
  }
}
};
  //res.cookie("IsLoggedIn",true);  // cookies res ke sath jayegi or client ke server
  //req.session.IsLoggedIn = true;          // me store ho jayegi 
  // get method with index page) ki request gayi localhost ko with cookie == "IsLoggedIn",true on browser

exports.postLogOut = async (req, res, next) => {
  //res.cookie("IsLoggedIn",false);
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after displaying it
    await req.session.destroy();
    res.render('auth/login',
      {
        pageTitle: "Login Page",
        currentPage: "Login",
        IsLoggedIn: false,
        toastMessage: toastMessage,
        error: [],
        oldInput: {
          email: '',
          password: ''
        },
        toastMessage: null,
        user: {}
      }
    ); // Redirect to the login page after logout
  }

exports.getSignUp = async (req, res, next) => {
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after displaying it 
  await req.session.save();
  res.render("auth/signup", {
    pageTitle: "Sign Page",
    currentPage: "signup",
    IsLoggedIn: false,
    error: [],
    toastMessage: toastMessage,
    oldInput: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: ''
    }
})
};

exports.postSignUp = [
  check('firstName')
  .trim()
  .isLength({ min: 2 })  // minimum length of 2 characters
  .withMessage('First name is atleast 2 characters long')
  .matches(/^[A-Za-z]+$/) // matches only alphabetical characters
  .withMessage('First name must contain only contains Alphabetical characters'),
  // + --> minimum 1 character
  // * --> 0 or more characters

  check('lastName')
  .matches(/^[A-Za-z]*$/) // matches only alphabetical characters
  .withMessage('Last name must contain only contains Alphabetical characters'),

  check('email')
  .isEmail()
  .withMessage('Please enter a valid email address')
  .normalizeEmail() ,// normalize the email address,

  check('password')
  .isLength({ min: 8 }) // minimum length of 6 characters
  .withMessage('Password must be atleast 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  .trim(), // remove leading and trailing spaces

  check('userType')
  .notEmpty() // ensure the field is not empty
  .withMessage('User type is required')
  .isIn(['Candidate', 'Recruiter']) // check if the value is either 'host' or 'guest'
  .withMessage('User type must be either Candidate or Recruiter')
  .notEmpty(),// ensure the field is not empty

   check("confirmPassword")
  .trim()
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("terms")
  .custom((value, {req}) => {
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),

  async (req, res, next) => {
    const {firstName, lastName, email, password, userType} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {   // if there are validation errors
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up Page",
        currentPage: "signup",
        IsLoggedIn: false,
        error: errors.array().map(err => err.msg),
        oldInput: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          userType: userType
        },
        toastMessage: null,
        user: {}
      });
    }

        const exists = await User.exists({ email: email});
        if (exists) {
              return res.render("auth/signup", {
                pageTitle: "Sign Up Page",
                currentPage: "signup", 
                IsLoggedIn: false,
                error: ["User already exists with this email address"],
                toastMessage: null,
                oldInput: {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  userType: userType 
            }
          });  
          }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
          userType: userType
        });
        await newUser.save(); // Store the user in the session
        req.session.toastMessage = {type: 'success', text: 'User registered successfully!'};
        await req.session.save();
        res.redirect("/login"); // Redirect to the home page after successful registration
  }
];

// session - server ke pass store hota h (internal cokkie banake)
// cookie - client ke pass store hota h (not use easily accessable)