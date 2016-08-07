var express = require('express');
var router = express.Router();

var User = require("../models/user.js")
var Item = require("../models/item.js")

var inter = require("../util/interceptors");

var fs = require("fs");

var path = require("path");

router.get("/item/new",inter.putUser,inter.requireUser,inter.requireSeller,function(req,res){
    res.render("newItem",{itemId : ""});
});

router.get("/item/edit/:itemId",inter.putUser,inter.requireUser,inter.requireSeller,function(req,res){
    var itemId = req.params.itemId;
    res.render("newItem",{itemId : itemId});
});

router.get("/api/categories",function(req,res){
    return res.json({
        categories : res.locals.categories,
        subcategories : res.locals.subcategories
    });
});

router.get("/item/img/:itemId",function(req,res){
    res.sendFile(path.resolve(__dirname+"/../itemImages/"+req.params.itemId+".jpg"));
});

router.get("/category/:category",inter.putUser,function(req,res){
    res.locals.category = req.params.category;
    res.locals.subcategory = "";
    Item.find({
        category : req.params.category
    }).populate("seller").exec(function(err,items){
        if(err)return res.sendStatus(500);
        res.locals.items = items;
        return res.render("category");
    });
});

router.get("/category/:category/:subcategory",inter.putUser,function(req,res){
    res.locals.category = req.params.category;
    res.locals.subcategory = req.params.subcategory;
    Item.find({
        category : req.params.category,
        subcategory : req.params.subcategory
    }).populate("seller").exec(function(err,items){
        if(err)return res.sendStatus(500);
        res.locals.items = items;
        return res.render("category");
    });
});

router.get("/api/item/:itemId",inter.putUser,inter.requireUser,inter.requireSeller,function(req,res){
    console.log(req.params.itemId);
    Item.findOne({_id : req.params.itemId,seller:req.user._id},function(err,item){
        if(err){
            return res.sendStatus(500);
        }
        if(!item){
            console.log("Item for editing not found");
            return res.sendStatus(500);
        }
        item.tags = item.tags.join(",");
        return res.json(item);
    });
});

router.get("/item/remove/:itemId",inter.putUser,inter.requireUser,inter.requireSeller,function(req,res){
    Item.findByIdAndRemove(req.params.itemId,function(err,item){
        res.redirect("/seller/dashboard");
    });
});

router.get("/item/view/:itemId",inter.putUser,function(req,res){
    Item.findOne({_id:req.params.itemId}).populate("seller").exec(function(err,item){
        if(err)return res.sendStatus(500);
        if(!item)return res.sendStatus(400);
        res.locals.item = item;
        res.render("viewItem");
    });
});

router.post("/item/add",inter.putUser,inter.requireUser,inter.requireSeller,function(req,res){

    function createItem(item){
        item.title = req.body.title;
        item.cost = req.body.cost;
        item.description = req.body.description;
        item.tags = req.body.tags.split(",");
        item.dateCreated = new Date();
        item.seller = req.user._id;
        item.category = req.body.category;
        item.subcategory = req.body.subcategory;

        fs.rename('itemImages/'+req.files.image.name, 'itemImages/'+item._id+".jpg", function (err) {
          if (err) throw err;
          console.log('renamed complete');
        });

        item.save(function(err){
            if(err){
                req.flash("errMsg","Product addtion failed");
                return res.redirect("/item/new");
            }else{
                req.flash("msg","Product successfully created");
                return res.redirect("/item/new");
            }
        });
    }

    if(req.body._id==''){
        console.log("Creating new Item");
        createItem(new Item());
    }else Item.findOne({_id:req.body._id},function(err,item){
        if(err)return res.sendStatus(500);
        if(!item)return res.sendStatus(400);
            console.log("Updating Item");

        createItem(item);
    });
});


module.exports = router;
