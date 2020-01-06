var express = require('express');
var router  = express.Router();
var auth_controller = require('../controllers/backend/authController');
var backend_controller = require('../controllers/backend/backendController');

router.get('/login', auth_controller.login_get);    

router.post('/login', auth_controller.login_post);

router.use('/', auth_controller.notlogiAdmin);

router.get('/category', auth_controller.isLoggedAdmin, backend_controller.category_list); 

router.get('/category/:id', auth_controller.isLoggedAdmin, backend_controller.categoryEdit);

router.get('/category/delete/:id', auth_controller.isLoggedAdmin, backend_controller.categoryDelete); 

router.get('/category/form', auth_controller.isLoggedAdmin, backend_controller.categoryForm);

router.post('/category/form', auth_controller.isLoggedAdmin, backend_controller.postCategory);

module.exports = router;