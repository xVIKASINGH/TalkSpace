class ExpressError extends Error{
   constructor(statuscode,message){
   super(statuscode);
    this.message=message
   }
}

module.exports=ExpressError;
