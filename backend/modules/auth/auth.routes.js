const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const {authenticate} =require('../../midleware/auth');

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me",authenticate, (req,res)=>{
    try{
        res.status(200).json(req.user);
        
    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
})
module.exports = router;
