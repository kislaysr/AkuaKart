var User    = require("../models/user");

var categories = [
    "Footwear",
    "Clothing",
    "Accessories",
    "Ethnic Wear (women)",
    "Accessories (women)",
    "Jewellery"
];

var subcategories = {
    "Footwear" : [
        "Shoes",
        "Sandals",
        "Loafers",
        "Flip flops",
        "Boots"
    ],
    "Clothing" : [
        "T-Shirts",
        "Shirts",
        "Jeans",
        "Trousers",
        "Sports Wear",
        "Suits & Blazers",
        "Innerwear & Loungewear",
        "Ethnic Wear",
        "Accessories & Combo Sets",
        "Shorts, 3/4ths & Cargos",
        "Combo Packs",
        "New in Mens Clothing"
    ],
    "Accessories" : [
        "Backpacks",
        "Wallets",
        "Belts",
        "Luggage",
        "Jewellery",
    ],
    "Ethnic Wear (women)" : [
        "Sarees",
        "Kurtas & Kurtis",
        "Dress Materials"
    ],
    "Accessories (women)" : [
        "Handbags and Backpacks",
        "Wallets & Belts"
    ],
    "Jewellery" : [
        "Artificial Jewellery"
    ]
}


module.exports.all = function(req,res,next){
    res.locals.errMsg = req.flash("errMsg");
    res.locals.msg = req.flash("msg");
    res.locals.createCategoryLink = function(item){
        var ret = '<a href="/category/{{c}}">{{c}}</a> &gt; '
        ret += '<a href="/category/{{c}}/{{sc}}">{{sc}}</a>';
        ret = ret.split("{{c}}").join(item.category).split("{{sc}}").join(item.subcategory);
        console.log(ret);
        return ret;
    }
    res.locals.categories = categories;
    res.locals.subcategories = subcategories;
    next();
}

module.exports.requireUser = function(req,res,next){
    if(req.session.userId == undefined){
        req.flash("errMsg","You need to be logged in to continue.")
        return res.redirect("/");
    }else{
        next();
    }
}

module.exports.requireSeller = function(req,res,next){
    if(req.user.isSeller){
        next();
    }else{
        req.flash("errMsg","You need to be a seller for access.");
        res.redirect("/");
    }
}

module.exports.putUser = function(req,res,next){
    if(req.session.userId){
        req.loggedIn = true;
        User.findOne({
            _id : req.session.userId
        },function(err,user){
            if(err)return res.sendStatus(500);
            if(!user){
                return res.sendStatus(500);
            }
            req.user = user;
            res.locals.user = user;
            res.locals.isLoggedIn = true;
            return next();
        })
    }else{
        req.loggedIn = false;
        res.locals.isLoggedIn = false;
        next();
    }
}
