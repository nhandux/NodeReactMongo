var passport = require('passport');

exports.login_get = function(req, res, next) {
    res.render('backend/login', {
        layout: false,
        title: 'Login Admin',
    });
}

exports.login_post = passport.authenticate('admin.login', {
    successRedirect:  '/admin/category',
    failureRedirect: '/admin/login',
    failureFlash   : true
});

exports.category_list = function(req, res, next) {
    res.render('admin/login', {
        layout: false,
    });
}

exports.isLoggedAdmin = function(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin/login');
    // res.json(403, {error: 430, message: 'Invalid username/password'});
}

exports.notLoggedAdmin = function(req, res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin/category');
}

exports.notlogiAdmin = function(req, res,next){
    next();
}