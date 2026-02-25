import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import nodemailer from "nodemailer"
import User from "./models/Users.js"


const app= express()
dotenv.config()
app.use(cors({
    origin:'https://abdelrahmanmansour321-art.github.io//https://abdelrahmanmansour321-art.github.io/freshman-platform2/'
}))
app.use(express.json())

const PORT= process.env.PORT || 5001
const MONGO_URI=process.env.MONGO_URI
const APP_SECRET=process.env.APP_SECRET


mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("mongoDB connected sucssesfully")
})
.catch((err)=>{
    console.log(err)
})

const transport= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"AbdelrahmanMansour321@gmail.com",
        pass:APP_SECRET
    }
})

app.post("/getData",async (req,res)=>{
     try{
        const {username,email}=req.body
        const newUser= new User({username,email})
        await newUser.save()

        const mailOptions={
    from: 'AbdelrahmanMansour321@gmail.com',
    to:email,
    subject:"email from Abdelrahman",
   html:`<div style="direction: rtl; text-align: left; font-family: Arial, sans-serif;">
                <h1 style="font-size: 25px; color: #82a7cc;">!!Hello ${username} </h1>
                <p style="font-size: 17px; color: #333;">thank you for registering in our web site<br> 😊😊we hope you enajoy our servises </p>
            </div>`
    }

await transport.sendMail(mailOptions,(err,info)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(`email sent to ${email}`)
    }

    res.json({massage:"regiseter success"})
})

    }catch(err){
        res.status(404).json({massage:"err loging in"})

    }
})


 const sendWeeklyMail= async (email)=>{

            await transport.sendMail({
    from: 'AbdelrahmanMansour321@gmail.com',
    to:email,
    subject:"email from Abdelrahman",
   html:`<div style="direction: rtl; text-align: left; font-family: Arial, sans-serif;">
                <h1 style="font-size: 25px; color: #5c94cb;">!!Hello </h1>
                <p style="font-size: 17px; color: #333;">this is weekly mail </p>
            </div>`
    

            })


}
app.post('/weeklyMail',async(req,res)=>{

   try{
           const users= await User.find({},'email -_id')
        
               for (let user of users){
   
                   await sendWeeklyMail(user.email)
               }
               res.json({massage:"emails sent"})
       

   }catch (err){
    res.status(501).json({error: err.massage})
   }

   
   
})


app.get('/f',async(req,res)=>{

    const users=await User.find({},'username')
    const emailOnly= users.map(user=>user.username) 
   
    res.json(emailOnly[0])


})



app.listen(PORT,"0.0.0.0",()=>{
    console.log(`server is running at port: ${PORT}`)
})
