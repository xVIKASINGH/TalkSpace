require('dotenv').config()
const UserSchema=require("../Schemas/UserSchema");
const jwt=require("jsonwebtoken");


module.exports.verifytoken=(req,res,next)=>{
    try {
        const token=req.cookies.token;
  
        if (!token) {
            return res.status(403).json({ message: "No token provided, access denied." });
        }


jwt.verify(token,process.env.SECRET_KEY,async(err,data)=>{
    if(err){
        return  next(res.json({status:"false"}))
    }
    else{
        const user=await UserSchema.findById(data.id);
        if(user){
            return res.json({status:true,user:user.name})
        }else{
            return res.json({status:false});
        }
    }
})
    } catch (error) {
        console.log(`here is your error ${error}`);
        res.json({message:"error aa gyaaa chutiyee"});
    }

}