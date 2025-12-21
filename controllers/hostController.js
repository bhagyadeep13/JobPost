const Home = require("../models/post"); // new model
const fs = require('fs');
const User = require('../models/user');

// Render Add Job page
exports.getAddPost = (req, res, next) => {
  res.render("host/details", {
    pageTitle: "Add Job",
    currentPage: "AddNewPost",
    editing: false,
    IsLoggedIn : req.session.IsLoggedIn,
    user: req.session.user,
    toastMessage: null
  });
};

// Render Edit Job page
exports.getEditHome = async (req, res, next) => {
  try {
    const homeId = req.params.homeId; // still using homeId param for consistency
    const editing = req.query.editing === "true";

    const home = await Home.findById(homeId);
    if (!home) {
      console.log("Job not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    res.render("host/details", {
      home: job,
      pageTitle: "Edit your Job",
      currentPage: "EditPost",
      editing,
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Render all Jobs for Host
exports.getHostHomes = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const toastMessage = req.session.toastMessage;
    req.session.toastMessage = null;

    const user = await User.findById(userId).populate('homes');

    res.render("host/author-post-list", {
      registeredPosts: user.homes,
      pageTitle: "Host Jobs List",
      toastMessage,
      currentPage: "host-homes",
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Add new Job
exports.postAddPost = async (req, res, next) => {
  try {
    const { jobTitle, companyName, jobDescription, location, salary, createdAt } = req.body;

    if(!req.file) {
      return res.status(400).send("Only image files are allowed.");
    }

    const photo_path = req.file.path;

    const home = new Home({
      jobTitle,
      companyName,
      jobDescription,
      location,
      salary,
      photo: photo_path,
      createdAt
    });

    await home.save();
    console.log("Job saved successfully");

    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user.homes.includes(home._id)) {
      user.homes.push(home._id);
      await user.save();
    }

    req.session.toastMessage = { type: 'success', text: 'Job added successfully!.' };
    await req.session.save();

    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
};  

// Edit Job
exports.postEditPost = async (req, res, next) => {
  try {
    const { id, jobTitle, companyName, jobDescription, location, salary, createdAt } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      console.log("Job not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    home.jobTitle = jobTitle;
    home.companyName = companyName;
    home.jobDescription = jobDescription;
    home.location = location;
    home.salary = salary;
    home.createdAt = createdAt;

    if(req.file) {
      fs.unlink(home.photo, (err) => {
        if(err) console.error("Error deleting old photo:", err);
      });
      home.photo = req.file.path;
    }

    await home.save();

    req.session.toastMessage = { type: 'info', text: 'Job edited successfully!.' };
    await req.session.save();

    res.redirect("/host/host-home-list");
  } catch (err) { 
    console.error(err);
    next(err);
  }
};

// Delete Job page
exports.getDeletePost = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const toastMessage = req.session.toastMessage;
    req.session.toastMessage = null;

    const user = await User.findById(userId).populate('homes');

    if(user) {
      res.render("host/delete-post", {
        registeredPosts: user.homes ,
        pageTitle: "Delete Job",
        currentPage: "DeletePost",
        toastMessage,
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
      });
    } else {
      res.render('404', {
        pageTitle: "Error",
        currentPage: "Error",
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user,
        message: "User not found"
      });
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
};

// Delete Job
exports.postDeletePost = async (req, res, next) => {
  try {
    const postId = req.body.postId;

    const home = await Home.findById(postId);
    if(!home) return res.status(404).send("Home not found");

    if(home.photo) {
      fs.unlink(home.photo, (err) => {
        if(err) console.error("Error deleting photo:", err);
      });
    }

    await Home.findByIdAndDelete(postId);

    const user = await User.findById(req.session.user._id);
    user.homes = user.homes.filter(hId => hId.toString() !== postId);
    await user.save();

    req.session.toastMessage = { type: 'error', text: 'Job deleted successfully!.' };
    await req.session.save();

    res.redirect("/host/delete-post");
  } catch(err) {
    console.error(err);
    next(err);
  }
};
