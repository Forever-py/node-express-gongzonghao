var express = require('express');
var router = express.Router();
var axios = require('axios');
var getAccessToken = require('../utils/getAccessToken');
const conf = require('../utils/conf');
const urlencode = require('urlencode'); // 处理连接

// 用户创建自定义菜单
router.get('/', function(req, res) {
	var appid = conf.appId;
	var redirect_uri = urlencode(conf.serverUrl + "/users/get_wx_access_token");
	var url =
		`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`

	// 定义菜单
	let menuParams = {
		"button": [{
				"type": "click",
				"name": "今天好热",
				"key": "V1001"
			}, {
				"type": "view",
				"name": "口罩互助",
				"url": conf.serverUrl + '/pages/help'
			},
			{
				"name": "我的",
				"sub_button": [{
						"type": "view",
						"name": "用户授权",
						"url": url
					},
					{
						"type": "click",
						"name": "联系我",
						"key": "V1003_1"
					}
				]
			}
		]
	};

	(async function() {
		try {
			// 获取access_token
			var accessToken = await getAccessToken();

			// 向微信服务器发请求，设置菜单
			var result = await axios({
				method: 'POST',
				url: ' https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' +
					accessToken,
				data: menuParams
			});

			if (!result.data.errcode) { // 判断拿到正确的信息
				res.json({
					state: '200',
					msg: '菜单创建成功'
				})
			} else {
				res.json({
					state: '0',
					msg: '菜单创建失败',
					err: result.data
				})
			}

		} catch (e) {
			res.json({
				state: '0',
				msg: '程序出错',
				err: e
			})
		}
	})();
});

module.exports = router;
