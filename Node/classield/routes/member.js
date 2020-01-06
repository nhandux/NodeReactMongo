var express = require('express');
var router  = express.Router();
var csrf    = require('csurf');
var csrfProtected = csrf();    
router.use(csrfProtected);

var member_controller = require('../controllers/memberController');
/* GET home page. */
router.get('/dang-ky', member_controller.get_register);

 router.use('/', member_controller.notloginUser);

router.get('/dang-xuat', member_controller.get_logout);

router.post('/dang-ky', member_controller.post_register);

router.get('/dashboard', member_controller.isLoggedIn, member_controller.get_profile);

router.get('/dang-nhap', member_controller.get_login);

router.post('/dang-nhap', member_controller.post_login);

module.exports = router;
