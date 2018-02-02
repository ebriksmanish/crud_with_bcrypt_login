const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/feboneDB');

app.post('/user', function(req, res){
    bcrypt.hash(req.body.Password, 9 ,function(err, hash){
        if(err){
            return res.json(err)
        }
        let userCriteria = {
            Name : req.body.Name,
            Email : req.body.Email,
            Password : hash
        };
        user.create(userCriteria, function(err, record){
            if(err){
                return res.json(err)
            }
            return res.json(record)
        });
    });    
});

app.post('/login', function(req, res){
    let userCriteria = {
        Email : req.body.Email
    };
    user.findOne(userCriteria, function(err, record){
        if(err){
            return res.json(err)
            }        
        if(record)
        {
            bcrypt.compare(req.body.Password,record.Password,(err,result)=>{
                if(result){
                    return res.json(record)
                }
                return res.json(err)
            })
        }
    });
});

app.get('/user', function(req, res){
    user.find({}, function(err, record){
        if(err){
            return res.json(err)
        }
        return res.json(record)
    });
});

app.put('/user', function(req, res){
    let preCriteria = req.body.ID;
    let criteria = {
        _id  : preCriteria
    }
    let updatedRecords = {
        Name : req.body.Name,
        Email : req.body.Email,
        Password : req.body.Password
    };
    user.update( criteria, updatedRecords, function(err, record){
        if(err){
            return res.json(err)
        }
        return res.json(record)
    })
});

app.delete('/user', function(req, res){
    let preCriteria = req.body.ID;
    let criteria = {
        _id  : preCriteria
    } 
    user.remove( criteria, function(err, record){
        if(err){
            return res.json(err)
        }
        return res.json(record)
    })   
});



app.listen(8000, function(req,res){console.log("App Running on Port 8000")});