var express = require('express');
var router = express.Router();

var User = require("../models/user.js")
var Item = require("../models/item.js")

var inter = require("../util/interceptors");

router.get("/",inter.putUser,function(req,res){
    Item.find({}).populate("seller").exec(function(err,items){
        if(err)return res.sendStatus(500);
        res.locals.items = items;
        res.render("index");
    });
});
module.exports = router;
