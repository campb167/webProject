var koa = require('koa');
var app = new koa();

var express = require('express');
var db = require('./database');
var app = express();
var parser = require('body-parser');


const path = require('path');
app.use(parser.json());
app.use(express.static('html'));

const databaseData = {
    host:"localhost",
    user:"root",
    password:"",
    database:"razorlight",
    port:3306
}

app.get('/', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/home.html'));
});
app.get('/about', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/about.html'));
});
app.get('/team', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/team.html'));
});
app.get('/store', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/store.html'));
});
app.get('/support', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/support.html'));
});

app.get('/createDB', function(req, res) {  
    //run the create table function
    db.createTables(databaseData, function(err, result){
        //if amy error happend send an error response
        if(err) {
            res.status(400);
            res.end("an error has occured:" + err);
            return;
        }
        //otherwise we created tables successfully
        res.status(200);
        res.end("tables were created successfully");
    });
});

app.post('/handlecontact', function(req, res){

    if(req.body.forename === undefined){
        res.status = 400;
        res.send({message:"forename is required"});
        return;
    }//forename must be at least 2 characters long
    else if(req.body.forename.length < 2){
        res.status = 400;
        res.send({message:"forename is too short"});
        return;
    }

    //surname is required
    if(req.body.surname === undefined){
        res.status = 400;
        res.send({message:"surname is required"});
        return;
    }

    //email is required
    if(req.body.email === undefined){
        res.status = 400;
        res.send({message:"email is required"});
        return;
    }//email should be at least 5 characters long
    else if(req.body.email.length < 5 ){
        res.status = 400;
        res.send({message:"email is too short"});
        return;
    }
    else {
        //email must match a specific pattern for a valid email
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(req.body.email).toLowerCase())){
            res.status = 400;
            res.send({message:"invalid email format"});
            return;
        }
    }

    const newContact =  {
        forename: req.body.forename,
        surname: req.body.surname,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        dateRecieved: new Date()
    }
    //we are atempting to add a new contact
    //call the addConact function
    db.addContact(databaseData, newContact, function (err, data){
        
        //our response will be a json data
        res.setHeader('content-type', 'application/json')
        res.setHeader('accepts', 'GET, POST')
        //when adding a user is done, this code will run
        //if we got an error informs the client and set the proper response code
        if(err){
            res.status(400);
            res.end("error:" + err);
            return;
        }
        //if no error let's set proper response code and have a party
        res.status(201);
        res.end(JSON.stringify({message:"we recieved your message"}));
    });
})

var port = process.env.PORT || 3000
app.listen(port, function(){
    console.log('Server running on http://localhost:3000')
});