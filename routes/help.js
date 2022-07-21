var express = require('express');
var getAccessToken = require('../utils/getAccessToken');
var router = express.Router();
var axios = require('axios');

// 发布求助口罩信息
router.post('/add', function(req, res) {
	console.log('收到救助请求', req.body);

	(async function() {
		try {
			var accessToken = await getAccessToken();
			var result = await axios({
				method: 'POST',
				url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' +
					accessToken,
				data: JSON.stringify({
					touser: req.body.openid,
					template_id: "mCUI7uozgpwskDOfYHEEDXvrEa_Y4yGKY_w4ZilDj-A",
					data: {
						first: {
							value: "发布求助信息提示"
						},
						keyword1: {
							value: "口罩互助"
						},
						keyword2: {
							value: req.body.needName
						},
						keyword3: {
							value: req.body.needTel
						},
						keyword4: {
							value: req.body.needAddress
						},
						keyword5: {
							value: new Date().toLocaleDateString()
						},
						remark: {
							value: "请耐心等待..."
						}
					}
				})
			});
			console.log('查看模板消息返回结果:', result.data);
			res.send('求助信息发布成功');

		} catch (err) {
			console.log(err);
		}
	})();
});

module.exports = router;
