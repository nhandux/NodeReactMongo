var validator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var settings = require('../config/settings');
var Member = require('../models/member');

var provider = null;
// Passport register
passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    Member.findById(id, function(err, member) {
      var newMember = member.toObject();
      newMember['provider'] = provider;
      done(err, member);
    });
  });

  //local.register là 1 biến
passport.use('local.regsiter', new LocalStrategy({
    usernameField: 'email', //Tên của người dùng đăng nhập và tương tự.
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    // Hàm để validator.
    req.checkBody('firstname', req.__('Please enter input first name')).notEmpty();
    req.checkBody('lastname', req.__('Please enter input last name')).notEmpty();
    req.checkBody('email', req.__('Please enter input email')).notEmpty().isEmail();
    req.checkBody('password', req.__('Please input password or password must be at least %d', settings.passwordLength)).notEmpty().isLength({
      min: settings.passwordLength
    });
    req.checkBody('password', req.__('Confirm password is not the same, please check ')).equals(req.body.confirmpassword);
    req.checkBody('accept', req.__('You have to accept with our terms')).equals("1");

    var errors = req.validationErrors();
    if(errors){
      var messages = [];
      errors.forEach(function(error){
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
    }

    Member.findOne({
      'local.email': email
    }, function(err, member) {
      if (err){
        return done(err);
      }
      if(member) {
        return done(null, false,{
          message: req.__('Email address used, please enter another')
        })
      }
      var newMember = new Member();
      newMember.info.firstname  = req.body.firstname;
      newMember.info.lastname   = req.body.lastname;
      newMember.local.email      = req.body.email;
      newMember.local.password   = newMember.encryptPassword(req.body.password);
      newMember.info.newsletter = req.body.newsletter;
      newMember.roles     = "MEMBER";
      newMember.status = (settings.confirmRegister == 1) ? 'INACTIVE' : 'ACTIVE';
      newMember.save(function(err, result){
        if(err) {
          return done(err);
        } else {
          if(settings.confirmRegister == 1) {
            return done(null, newMember);
          }else{
            //Tự động đăng nhập
            req.logIn(newMember, function(err) {
              provider = 'local';
              return done(err, newMember); 
            })
          }
        }
      })
    });
  }));


  //login
  passport.use('local', new LocalStrategy({
    usernameField: 'email', //Tên của người dùng đăng nhập và tương tự.
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
      req.checkBody('email', req.__('Please enter input email')).notEmpty().isEmail();
      req.checkBody('password', req.__('Please input password or password must be at least %d', settings.passwordLength)).notEmpty().isLength({
      min: settings.passwordLength
    });
    errors = req.validationErrors();
    
    if(errors) {
      var messages = [];
      errors.forEach(function(err) {
        messages.push(err.msg)
      });
      return done(null, false, req.flash('error', messages));
    }
    
    Member.findOne({
      'local.email': email,
    }, function(err, member){
      
      if(err){
        return done(err);
      }
      
      if(!member){
        return done(null, false, {
          message: req.__('Member notfound!')
        });
      }
      
      if(!member.validcryptPassword(password)){
        return done(null, false,{
          message:req.__('Password error, plz try again')
        })
      }

      if (member.isInActivated(member.status)) {
        return done(null, false, {
          message:req.__('User not activeted')
        })
      }

      if (member.isSuspended(member.status)) {
        return done(null, false, {
          message:req.__('User is Suspended')
        })
      }

      provider = "local";
      done(null, member);
    })
  }));



  passport.use('admin.login', new LocalStrategy({
    usernameField: 'email', //Sử dụng dữ liệu email và password.
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
      req.checkBody('email', req.__('Please enter input email')).notEmpty().isEmail();
      req.checkBody('password', req.__('Please input password or password must be at least %d', settings.passwordLength)).notEmpty().isLength({
      min: settings.passwordLength
    });
    errors = req.validationErrors();
    
    if(errors) {
      var messages = [];
      errors.forEach(function(err) {
        messages.push(err.msg)
      });
      return done(null, false, req.flash('error', messages));
    }
    
    Member.findOne({
      'local.email': email,
    }, function(err, member){
      
      if(err){
        return done(err);
      }
      
      if(!member){
        return done(null, false, {
          message: req.__('Member notfound!')
        });
      }
      
      if(!member.validcryptPassword(password)){
        return done(null, false,{
          message:req.__('Password error, plz try again')
        })
      }

      if (member.isInActivated(member.status)) {
        return done(null, false, {
          message:req.__('User not activeted')
        })
      }

      if (member.isSuspended(member.status)) {
        return done(null, false, {
          message:req.__('User is Suspended')
        })
      }

      provider = "admin";
      done(null, member);
    })
  }));