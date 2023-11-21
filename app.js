const express = require("express");
const request = require("request");
require('dotenv').config();

const app = express();

const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.userName;
    const lastName = req.body.userLastName;
    const email = req.body.userEmail;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ] 
    };

    const subscriptionList = process.env.SUB_LIST;
    
    const url = "https://us21.api.mailchimp.com/3.0/lists/" + subscriptionList;
    console.log(url);
    
    const options = {
        method: "POST",
        auth: process.env.AUTH
    };
    
    console.log(process.env.AUTH);

    const jsonData = JSON.stringify(data);

    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
    
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is listening on port 3000");
});
