var passport = require('passport');

exports.get_register = function(req, res, next) {
    var messages = req.flash('error');
    res.render('frontend/members/register', {
        title: req.__('Member Register'),
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    })
}

exports.post_register = passport.authenticate('local.regsiter', {
    successRedirect:  '/thanh-vien/dashboard',
    failureRedirect: '/thanh-vien/dang-ky',
    failureFlash   : true
});

exports.get_profile = function(req, res, next) {
    res.render('frontend/members/dashboard', {
         title: 'Dashboard Member',   
    });
}

exports.get_logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
}

exports.get_login = function(req, res, next) {
    var messages = req.flash('error');
    res.render('frontend/members/login', {
        title: 'Login Page',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
}

exports.post_login = passport.authenticate('local.login', {
    successRedirect:  '/thanh-vien/dashboard',
    failureRedirect: '/thanh-vien/dang-nhap',
    failureFlash   : true
});

exports.isLoggedIn = function(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/thanh-vien/dang-nhap');
}

exports.notLoggedIn = function(req, res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/thanh-vien/dashboard');
}

exports.notloginUser = function(req, res,next){
    next();
}