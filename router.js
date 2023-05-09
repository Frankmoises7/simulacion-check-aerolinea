const express = require("express");
const PageController = require("./controllers/PageController");
const router = express.Router();

// Database Client


// Controllers

const pageController = new PageController();

// Routes
//router.get("/", pageController.renderInfo);
router.get("/flights/:id/passengers", pageController.renderFlight);
router.get("*", pageController.renderNotFound);

module.exports = router;
