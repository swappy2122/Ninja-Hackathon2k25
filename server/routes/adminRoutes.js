const express = require('express');
const jwt = require('jsonwebtoken');
const { loginAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/checkloginstatus", (req, res) => {
    try{
        const Authorization = req.headers['authorization'];
        if(!Authorization){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = Authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.email === process.env.ADMIN_EMAIL){
            res.status(200).json({ message: "Authorized" });
        }
        else{
            res.status(401).json({ message: "Unauthorized" });
        }
    }catch(e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;