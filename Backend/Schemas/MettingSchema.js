import {Schema,mongoose} from 'mongoose';

const MettingSchema=new Schema({
    user_id:{type:String},
    mettingcode:{type:String,required:true},
    date:{type:Date,default:Date.now(),required:true}
})

const Metting=mongoose.model('Meeting',MettingSchema)
export  {Metting};