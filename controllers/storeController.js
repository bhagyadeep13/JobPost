const User = require("../models/user");
const Home = require("../models/post");
const Application = require('../models/application');

exports.getIndex = async (req, res, next) => {
  //console.log("session value",req.session)
      const post = await Home.find();
      if(post) {
      const toastMessage = req.session.toastMessage;
      req.session.toastMessage = null;
      await req.session.save();
      res.render("store/index", 
      {
        registeredPosts: post,
        pageTitle: "ViewPost",
        currentPage: "ViewPost", 
        toastMessage: toastMessage,
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
    });
    }
  };

  exports.getPostDetails = async (req, res, next) => {

  const postId = req.query.postId;  // Assuming postId is passed as a query parameter
  const user = req.session.user;
  if(!user) {
    const toastMessage = {type: 'error', text: 'Please log in first to view post details.'};
    req.session.toastMessage = toastMessage;
    await req.session.save();
    res.redirect("/login");
    return;
  }
  const userType = await user.userType;
  const post = await Home.findById(postId)
  
    if (!post) {
      res.redirect("/");
    } else {
      res.render("store/post-detail", {
        home: post,
        userType: userType,
        pageTitle: "Post Detail",
        currentPage: "post-detail", 
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user,
        toastMessage: req.session.toastMessage
      });
    }
  }

exports.getDashboard = (req, res, next) => {
  const user = req.session.user;
  const userType = user ? user.userType : '';
  res.render("store/dashboard", {
    userType: userType,
    userId: user ? user._id : null,
    pageTitle: "Dashboard",
    currentPage: "Dashboard",
    IsLoggedIn : req.session.IsLoggedIn,
    user: req.session.user,
    toastMessage: null,
  });
};

exports.getPostList = (req, res, next) => {

  const user = req.session.user;
  const userType = user ? user.userType : '';

  Home.find().then((registeredHomes) => {
    res.render("store/post-list", 
      {
      userType: userType,
      registeredHomes: registeredHomes,
      pageTitle: "Post List",
      currentPage: "ViewPost", 
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user
    });
  });
};

exports.applyJob = async (req, res) => {
  try {
    const jobId = req.body.postId;
    const userId = req.session.user._id;

    // prevent duplicate application
    const alreadyApplied = await Application.findOne({
      candidate: userId,
      job: jobId
    });

    if (alreadyApplied) {
      console.log('error', 'You have already applied for this job.');
      res.render('store/post-detail',
        {
          home: await Home.findById(jobId),
          userType: req.session.user.userType,
          pageTitle: "Post Detail", 
          currentPage: "post-detail",
          IsLoggedIn : req.session.IsLoggedIn,
          user: req.session.user,
          toastMessage: { type: 'error', text: 'You have already applied for this job.' }
        });
        }
    else {
    const application = new Application({
      candidate: userId,
      job: jobId,
      status: 'applied',
      appliedAt: Date.now()
    });
  
    await application.save();

    const user = await User.findById(userId);
    user.jobsApplied.push(application._id);
    await user.save();
    
    console.log('success', 'Job applied successfully');
    req.session.toastMessage = { type: 'success', text: 'Job applied successfully!' };
    await req.session.save();
    res.redirect('/my-applications');
    }
  } catch (err) {
    console.error(err);
    res.send('An error occurred while applying for the job.');
  }
};

exports.myApplications = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const applications = await Application.find({
      candidate: userId
    })
    console.log(applications)
    res.render('store/Myapplication', {
      applications,
      pageTitle: 'My Applications',
      currentPage: 'my-applications',
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user,
      toastMessage: req.session.toastMessage
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};
