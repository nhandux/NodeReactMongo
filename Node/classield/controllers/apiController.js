var passport = require('passport');
var Member = require('../models/member');
var jwt  = require('jsonwebtoken');
var settings = require('../config/settings');
var Category = require("../models/category");
var Article = require("../models/article");
exports.getApi = function(req, res, next) {
    res.json({
        message: 'Api Root Route'
    }); 
}

exports.getToken = function(req, res, next) {
    res.json({
        message: 'Access token'
    })
}

exports.loginTemplate = function(req, res, next) {
    res.render('api/login', {
        title: 'Dashboard Login',   
    });
};

exports.loginRequired = function(req, res, next) {
    res.header("Content-type", "application/json");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    Member.findOne({
        'local.email': req.body.email
      }, function(err, member) {
    if (err) throw err;
    if (!member) {
        res.json({ message: 'Authentication failed. User not found.' });
    } else if (member) {
        if (!member.validcryptPassword(req.body.password)) {
            res.json({ message: 'Authentication failed. Wrong password.' });
        } else {
             return res.json({token: jwt.sign({ member}, settings.mysecret)});
            // var token = jwt.sign(member, app.get('superSecret'), {
            //     expiresInMinutes: 1440 
            //   });
            //   res.json({
            //     success: true,
            //     message: 'Enjoy your token!',
            //     token: token
            //   });
        }
    }
    });
};

exports.listUser = function(req, res, next) {
    Member.find({}, function(err, member) {
    if (err) throw err;
    if (!member) {
        res.json({ message: 'Authentication failed. User not found.' });
    } else if (member) {
        res.json(member);
    }
  });
};

exports.updateCategory = function(req, res, next) {
    var model = "";
    if(req.body.table == "category") {
        model = Category;
    } else if( req.body.table ==  "article") {
        model = Article;
    }
    model.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: false },
      (err, doc) => {
        if (!err) {
          res.json({ message: "Sava data success.", success: true });
        } else {
          res.json({ message: "Had error in process!.", success: false });
        }
      }
    );
  };

exports.protectedTemplate = function(req, res, next){
    jwt.verify(req.token, settings.mysecret, function(err, data){
        if(err) {
            res.json({
                err: err
            });
        }else {
            Member.find((err, docs)=>{
                if(!err) {
                    res.send(docs)
                }else {
                    res.sendStatus(404)
                } 
            })        
        }
    })
}

exports.APITemplate = function(req, res, next){
    res.render('api/getApi', {
        title: 'Dashboard Api',   
    });
}


exports.ensureToken = function(req, res, next){
    const bearerHeader =  req.headers["authorization"];
    if(typeof bearerHeader != "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

