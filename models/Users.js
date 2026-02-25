import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required:true, //لا يمكن حفظ المستخدم بدون اسم
        //  unique:true//يجب ان يكون الاسم فريد
    },
    email:{

         type: String,
        required:true,
       

    },
   

},{timestamps:true});// لاضافه وقت انشاء الحساب ووقت اخر تعديل عليه

const User= mongoose.model("User",userSchema);

export default User