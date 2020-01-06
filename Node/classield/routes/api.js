var express = require('express');
var router = express.Router();
var api_controller = require('../controllers/apiController');
var category_controller = require('../controllers/categoryController');
var article_controller = require('../controllers/articleController');

router.get('/', api_controller.getApi);
router.post('/login', api_controller.loginRequired);
router.get('/login', api_controller.loginTemplate);
router.get('/apiTemplate', api_controller.APITemplate);
router.get('/getApi', api_controller.ensureToken, api_controller.protectedTemplate);
router.get('/user/list', api_controller.ensureToken, api_controller.listUser);
router.put('/status/update', api_controller.ensureToken, api_controller.updateCategory);

//category
router.get('/category/list', api_controller.ensureToken, category_controller.listCategory);
router.get('/category/count', api_controller.ensureToken, category_controller.countListCategory);
router.post('/category/create', api_controller.ensureToken, category_controller.createCategory);
router.put('/category/update/:id', api_controller.ensureToken, category_controller.updateCategory);
router.get('/category/detail', api_controller.ensureToken, category_controller.detailCategory);
router.post('/category/delete', api_controller.ensureToken, category_controller.delCategory);

//article
router.get('/article/list', api_controller.ensureToken, article_controller.listArticle);
router.get('/article/count', api_controller.ensureToken, article_controller.countListArticle);
router.post('/article/create', api_controller.ensureToken, article_controller.createArticle);
router.put('/article/update/:id', api_controller.ensureToken, article_controller.updateArticle);
router.get('/article/detail', api_controller.ensureToken, article_controller.detailArticle);
router.post('/article/delete', api_controller.ensureToken, article_controller.delArticle);

module.exports = router;