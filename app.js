require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/secretDB")
.then(()=> console.log("Database connected!"))
.catch(()=> console.log("Something went wrong while trying to connect to database"));

console.log(process.env.API_KEY);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});
const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render("home");
})
app.get("/login", (req, res)=>{
    res.render("login");
});
app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    const newUser = User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then((result)=>{
        if(result){
            res.render("secrets");
        }else{
            console.log("an error occured!");
        }
    })
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then((result)=>{
        if(result.password===password){
            res.render("secrets");
        }else{
            console.log("an error occured while trying to login");
        }
    })
})


app.listen(3000, ()=> console.log("Server running on port 3000"));