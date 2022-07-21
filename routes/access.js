var express = require('express');
var router = express.Router();
var conf = require('../utils/conf'); // 引入 conf.js 文件
var crypto = require('crypto'); // 引入加密模块
var xmlTool = require('../utils/xmlTool'); // 引入xml 和 json 的转化工具

// 封装一个 sha1 加密函数
function sha1(str) {
	return crypto.createHash('sha1').update(str).digest('hex');
}

// 接入微信验证
router.get('/', function(req, res) {
	console.log('收到微信服务器发送的验证请求', req.query);

	// 获取在公众平台上设置的token -> asdhiyuiabsjdk234khnksdfdsfsdf
	var token = conf.token;

	//  将token、timestamp、nonce三个参数进行字典序排序 
	var tempArrStr = [token, req.query.timestamp, req.query.nonce].sort().join("");

	// 拼接成一个字符串进行sha1加密，开发者获取加密后的字符串可与signature对比
	if (sha1(tempArrStr) === req.query.signature) {
		res.status(200);
		res.send(req.query.echostr); // 确认成功后将 echostr 原路返回
	} else {
		res.send('接入失败')
	}

});

// 用于接收用户发送的消息(由微信服务器转发过来的)
router.post('/', function(req, res) {
	console.log('接收到微信转发的用户消息请求');

	// 用nodeJS的方法接收xml格式的数据
	var buff = '';
	req.on('data', function(data) { // 监听数据流事件
		buff = buff + data;
	});

	req.on('end', function() { // 监听数据传输结束
		console.log('接收到用户发送的消息', buff);

		(async function() {
			try {
				var result = await xmlTool.toJson(buff);

				// 判断消息类型
				switch (result.xml.MsgType) {
					case 'text':
						resText(res, result.xml);
						break;
					case 'event':
						resEvent(res, result.xml);
						break;
					case 'image':

						break;
					case 'voice':

						break;
					case 'video':

						break;
					case 'shortvideo':

						break;
					case 'location':

						break;
					case 'link':

						break;
					default:
						break;
				}
			} catch (e) {
				console.log('解析用户信息失败', e);
				res.json({
					state: '0',
					msg: '解析用户信息失败',
					err: e
				})
			}
		})()
	});
});

function resText(res, obj) { // 文本消息的回复
	var resMsg = {
		xml: {
			ToUserName: obj.FromUserName,
			FromUserName: obj.ToUserName,
			CreateTime: new Date().getTime(),
			MsgType: 'text',
			Content: '已经收到您的消息您发送的消息是：' + obj.Content
		}
	};

	var resMsgXml = xmlTool.toXml(resMsg); // 将 json 对象转化为 xml格式
	res.send(resMsgXml);
}

function resEvent(res, obj) { // 处理文本
	var resMsg = null; // 回复内容

	if (obj.Event === 'CLICK') { // 判断是自定义事件
		if (obj.EventKey === 'V1001') { // 判断 自定义的事件值
			resMsg = {
				xml: {
					ToUserName: obj.FromUserName,
					FromUserName: obj.ToUserName,
					CreateTime: new Date().getTime(),
					MsgType: 'text',
					Content: '我收到的是第一个点击事件'
				}
			};
			var resMsgXml = xmlTool.toXml(resMsg); // 将 json 对象转化为 xml格式
			res.send(resMsgXml);
		} else if (obj.EventKey === 'V1003_1') {
			resMsg = {
				xml: {
					ToUserName: obj.FromUserName,
					FromUserName: obj.ToUserName,
					CreateTime: new Date().getTime(),
					MsgType: 'text',
					Content: '我收到的是第二个点击事件'
				}
			};
			var resMsgXml = xmlTool.toXml(resMsg); // 将 json 对象转化为 xml格式
			res.send(resMsgXml);
		}
	}
}


module.exports = router;
