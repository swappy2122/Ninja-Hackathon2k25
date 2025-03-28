const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const donarController = require('../controllers/donarController');

const router = express.Router();

// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect("/signup?error=User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Store user session after successful signup
    req.session.user = { username: newUser.username, email: newUser.email };

    res.redirect("/userDashboard"); // Redirect to dashboard
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// LOGIN ROUTE
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect("/signin?error=User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/signin?error=Invalid credentials");
    }

    // Store user session after login
    req.session.user = { username: user.username, email: user.email };

    res.redirect("/dashboard"); // Redirect to dashboard
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// DASHBOARD ROUTE
router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.render("Dashboard/userDashboard", {
    username: req.session.user.username,
    email: req.session.user.email,
  });
});

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/signin");
  });
});

//data save





// Create a new donation
router.post('/create', donarController.createDonation);

// Get available donations
router.get('/available', donarController.getAvailableDonations);







module.exports = router;
