var express = require('express');
var router = express.Router();
var axios = require('axios');
var getAccessToken = require("../utils/getAccessToken");
const conf = require('../utils/conf');
const urlencode = require('urlencode');

// 获取所有关注者
router.get('/', function(req, res) {
	(async function() { // 将异步请求处理成同步请求
		try {
			var accessToken = await getAccessToken();

			var result = await axios({
				method: 'GET',
				url: 'https://api.weixin.qq.com/cgi-bin/user/get',
				params: {
					access_token: accessToken
				}
			});

			if (!result.data.errcode) { // 判断拿到正确的信息
				res.json({
					state: '200',
					msg: '获取用户信息成功',
					data: result.data
				})
			} else {
				res.json({
					state: '0',
					msg: '获取信息失败',
					err: result.data
				})
			}
		} catch (e) { // 捕获 try 中的错误
			res.json({
				state: '0',
				msg: '获取用户信息失败',
				err: e
			})
		}
	})();
});

// 用户授权
router.get('/get_wx_access_token', function(req, res) {
	console.log('收到服务器返回的code', req.query);

	(async function() {
		try {
			// 通过用户授权后得到的code获取 access_token
			var result = await axios({
				method: 'GET',
				url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
				params: {
					appid: conf.appId,
					secret: conf.appSecret,
					code: req.query.code,
					grant_type: 'authorization_code'
				}
			});
			console.log('获取到网页授权access_token', result.data);

			// 再通过access_token 和 openid 去获取用户信息
			var userInfo = await axios({
				method: 'GET',
				url: 'https://api.weixin.qq.com/sns/userinfo',
				params: {
					access_token: result.data.access_token,
					openid: result.data.openid,
					lang: 'zh_CN'
				}
			});
			console.log('获取到用户信息：', userInfo.data);
			res.send(userInfo.data)
		} catch (e) {
			console.log('失败', e);
			res.send(e);
		}
	})();
})

// 用户发起静默授权
router.get('/wx_getcode', function(req, res) {
	var appid = conf.appId;
	var redirect_uri = urlencode(conf.serverUrl + "/pages/help_list");
	var url =
		`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`

	res.redirect(url); // 重定向
})

router.post('/get_openid', function(req, res) {
	(async function() {
		try {
			var result = await axios({
				method: 'GET',
				url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
				params: {
					appid: conf.appId,
					secret: conf.appSecret,
					code: req.body.code,
					grant_type: 'authorization_code'
				}
			});
			console.log('静默授权返回结果', result.data);

			res.json({
				state: '200',
				msg: '获取openid成功',
				openid: result.data.openid
			})
		} catch (e) {
			res.send(e);
		}
	})();
})

module.exports = router;
