var express = require('express');
var router = express.Router();

// 简单版后台页面
router.get('/home', function(req, res) {
	res.render('home'); // 渲染 home.html 文件
});

// 渲染口罩互助的活动入口页面
router.get('/help', function(req, res) {
	res.render('help'); // 渲染 help.html 文件
});

router.get('/help_list', function(req, res) {
	res.render('help_list'); // 渲染 help_list.html 文件
})

module.exports = router;
