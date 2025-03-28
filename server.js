const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const adminRoutes = require('./server/routes/adminRoutes');
const donationRoutes = require('./server/routes/donationRoutes');




const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const session = require("express-session");
app.use(cors());

// Session Configuration
app.use(
    session({
      secret: "your_secret_key", // Use a strong secret key
      resave: false,
      saveUninitialized: false, // Set to false for better session security
    })
  );

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// View Engine (EJS)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// Authentication & Dashboard Routes
const donarRoutes = require("./server/routes/donarRoutes");
app.use(donarRoutes); // This makes all routes inside authRoutes.js directly accessible

// Middleware to Check Authentication
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/signin"); // Redirect to sign-in if not logged in
  }
  next();
}

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/signin");

    });
  });

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/donations', donationRoutes);

app.use('/api/admin', adminRoutes || ((req, res) => res.status(501).send('Not Implemented')));
app.use('/api/donations', donationRoutes || ((req, res) => res.status(501).send('Not Implemented')));



app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/dashboard', (_, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
