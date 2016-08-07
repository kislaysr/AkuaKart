var express = require('express');
var router = express.Router();

var User = require("../models/user.js")
var Item = require("../models/item.js")

var inter = require("../util/interceptors");

router.get("/seller/new",inter.putUser,inter.requireUser,function(req,res){
    if(req.user.isSeller){
        req.flash("errMsg","User already seller.");
        return res.redirect("/");
    }
    res.render("newSeller");
});

router.get("/seller/dashboard",inter.putUser,inter.requireUser,inter.requireSeller,function(req,res){
    Item.find({seller: req.user._id}).populate("seller").exec(function(err,items){
        if(err)return res.sendStatus(500);
        res.locals.items = items;
        //console.log(items);
        res.render("sellerDashboard");
    });
});

router.post("/seller/register",inter.putUser,inter.requireUser,function(req,res){
    if(req.user.isSeller){
        req.flash("errMsg","User already seller.");
        return res.redirect("/");
    }

    req.user.isSeller = true;
    req.user.seller.address = req.body.address;
    req.user.seller.phone = req.body.phone;
    req.user.seller.alias = req.body.alias;
    req.user.save(function(err){
        if(err)return res.sendStatus(500);
        req.flash("msg","Congratulations! You are now a seller on AKUAKART");
        return res.redirect("/");
    });
});


module.exports = router;
