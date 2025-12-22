// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/postDetails", storeController.getPostDetails);
storeRouter.get("/post-list", storeController.getPostList);
storeRouter.post("/dashboard", storeController.getDashboard);
storeRouter.post('/apply', storeController.applyJob);
storeRouter.get('/my-applications', storeController.myApplications);

module.exports = storeRouter;
