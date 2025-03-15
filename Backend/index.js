const express = require("express");
const app=express();
require('dotenv').config()
const mongoose=require("mongoose");
const MONGO_URL=process.env.MONGO_URL;
const UserSchema  =require("./Schemas/UserSchema")
app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true })); 
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const {createServer}=require("node:http")
const {Server} =require("socket.io");
const jwt=require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cors=require("cors");
app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true  
  }));
const {verifytoken} =require("./Middleware/Auth")
const ExpressError=require("./Middleware/ExpressError");

const server=createServer(app)
// const io=connectToServer(server)


app.post("/signup",async(req,res)=>{
    const {email,username,password}=req.body;
    if(!email || !username || !password){
     return   res.json({success:false,message:"please enter all fields"});
    }
    try {
       const  existing_user=await UserSchema.findOne({email});
        if(existing_user){
           return  res.json({success:false,message:"user already exists"})
        }
        Hashed_password=await bcrypt.hash(password,12);
        const new_user=await new UserSchema({email:email,username:username,password:Hashed_password});
    
        new_user.save();
        const token = jwt.sign({ id: new_user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
            sameSite:'lax'
          });
          res
            .status(201)
            .json({ message: "User signed in successfully", success: true, new_user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false,message: "Server error" });
    }
  
})

app.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return res.json({success:false,message:"Please enter all the fields"});
    }
    try {
        const user=await UserSchema.findOne({username});
        if(!user){
           return res.json({success:false,message:"no user exist for this username"});
        }
        const auth=await bcrypt.compare(password,user.password)
        if(!auth){
         return res.json({success:false,message:"password is incorrect"});
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
     
        res.cookie("token", token, {
         httpOnly: false,
         sameSite:'lax'
       });
       res
         .status(201)
         .json({ message: "Logged in successfully", success: true, user });
    } catch (error) {
        console.log(error);
      res.status(500).json({message:"server error"});
    }

})

app.post("/logout", (req, res) => {
    res.clearCookie('token', { path: '/', sameSite: 'lax' });
    res.status(201).json({ message: "log out successfully" });
});


app.get('/checkAuth', (req, res) => {
  
    const token = req.cookies.token;
    if (!token) return res.status(401).send("No token found");
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).send("Invalid token");
      res.status(200).send("Authenticated");
    });
  });
  
  server.listen(app.listen(3000,()=>{
    console.log("server is listening to port 3000")
    mongoose.connect(MONGO_URL)
    console.log("database connected successfully")
   }))


app.all("*", (req, res, next) => {
    return next(new ExpressError(400, "Page not found"));
  });


app.use((req,res)=>{
    const {statuscode=400,message="server error please wait..."}=req.body;
    res.status(statuscode).json({
        success:false,
        statuscode,
        message:error.message || "server error please come after some time"
    })

})