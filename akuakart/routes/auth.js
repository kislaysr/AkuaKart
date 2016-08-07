var express = require('express');
var router = express.Router();

var User    = require("../models/user")
var Item    = require("../models/item")

router.get("/usersList",function(req,res){
    User.find({},function(err,users){
        res.json(users);
    });
});

router.get("/auth/logout",function(req,res){
    req.session.userId = undefined;
    res.redirect("/");
});

router.post("/auth/login",function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({
        password : password,
        $or : [
            {username : username},
            {email : username}
        ]
    },function(err,user){
        if(err)return res.sendStatus(500);
        if(!user){
            req.flash("errMsg","User not found");
            return res.redirect("/");
        }
        req.session.userId = user._id.toString();
        return res.redirect("/");
        user.lastLoggedIn = new Date();
        user.save();
    });
});


router.post("/auth/register",function(req,res){
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    User.findOne({
        $or : [
            {username : username},
            {email : email}
        ]
    },function(err, user){
        if(err)return res.sendStatus(500);
        if(user){
            if(user.username == username){
                return res.json({
                    err : true,
                    message : "Username already taken"
                });
            }else if(user.email == email){
                return res.json({
                    err : true,
                    message : "Email already taken"
                });
            }else return res.json({
                err : true,
                message : "Unknown error"
            });
        }
        var newuser = new User();
        newuser.username = username;
        newuser.password = password;
        newuser.email = email;
        newuser.save(function(err){
            if(err)return res.json({
                err : true,
                message : "Unknown error"
            });
            else return res.json({
                err : false
            });
        })
    });
});


module.exports = router;
