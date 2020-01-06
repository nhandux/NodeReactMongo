var express = require('express');
var router = express.Router();

var home_controller = require('../controllers/homeController');
/* GET home page. */
router.get('/', home_controller.index);

router.get('/en',  home_controller.lang_en);

router.get('/vi',  home_controller.lang_vi);

module.exports = router;
