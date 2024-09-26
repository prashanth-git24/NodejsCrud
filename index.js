// const http = require("http");
// const url=require("url");
const express = require("express");
const users = require("./MOCK_DATA.json");
const mongoose = require("mongoose");
const app = express();
const port=8000;
const fs= require('fs');

//connection
mongoose.connect('mongodb://localhost:27017/userapp').then(()=>console.log("Mongodb Connected")).catch(err => console.log("Mongo Error",err));

//Schema
const userschema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    jobtitle:{
        type: String,
    },
    gender:{
        type: String,
    },
});
//model
const User = mongoose.model("user",userschema);
//BUILT IN -middleware
app.use(express.urlencoded({extended:false}));

//Routes
app.get("/users",async(req,res)=>{
    const alldbusers = await User.find({});
const html=`
<ul>
${alldbusers.map((user)=>`<li>${user.firstname}-${user.email}</li>`).join("")}
</ul>
`;
res.send(html);
});
app.route("/api/users/:userid")
.get(async(req,res)=>{
    // const id =Number(req.params.userid);
    // const user = users.find((user)=>user.id===id);
    const user =await User.findById(req.params.userid);
    if(!user) return res.status(404).json({error:"user not found"});
    return res.json(user);
    })
.put(async(req,res)=>{
    await User.findByIdAndUpdate(req.params.userid,{lastname:"changed"});
return res.json({status:"Success"});
})  
.delete(async(req,res)=>{
    await User.findByIdAndDelete(req.params.userid);
    return res.json({status:"Success"});
});

app.get("/api/users",async(req,res)=>{
    const alldbusers = await User.find({});
return res.json(alldbusers);
});
app.post("/api/users",async(req,res)=>{
    const body = req.body;
    // console.log("Body",body);
    if(!body || !body.firstname  || !body.email || !body.gender || !body.jobtitle){
        return res.status(400).json({msg:"all fields are required"});
    }
    // users.push({body,id:users.length+1});
    // fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
    //     return res.status(201).json({status:"success",id:users.length+1});
    // });
    await User.create({
        firstname:body.firstname,
        lastname :body.lastname ,
        email :body.email ,
        gender :body.gender,
        jobtitle:body.jobtitle, 

    });
    return res.status(201).json({msg:'success'});
    });
app.listen(port,()=>console.log(`Server started at port:${port}`))
























// app.get('/',(req,res)=>{
// res.send("Home Page");
// });
// app.get('/about',(req,res)=>{
//     res.send("About Page"+ req.query.name);
//     });
// app.listen(8000,()=>console.log("Server started"));
    // const myserver=http.createServer(app);


// const myserver=http.createServer((req,response)=>{
//     if(req.url == "/favicon.ico") return response.end();
//     response.write('Hello World!');
//     const myurl= url.parse(req.url);
//     console.log(myurl);


// // console.log(req.headers);
  
//     response.end();

// });
// myserver.listen(8001,()=> console.log("server started"));