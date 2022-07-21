var fs = require('fs'); // 引入文件操作模块
var axios = require('axios');
var conf = require('./conf');
var accessTokenJson = require("../datas/access_token.json");

function getAccessToken() {
	var currentTime = new Date().getTime(); // 获取当前时间戳
	var params = { // 请求参数
		grant_type: 'client_credential',
		appid: conf.appId,
		secret: conf.appSecret
	}
	return new Promise(function(resolve, reject) {
		//  如果本地 access_token失效，则重新请求微信服务器
		if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
			axios({ // 重新请求
				method: 'GET',
				url: 'https://api.weixin.qq.com/cgi-bin/token',
				params: params // 发送get请求的参数设置
			}).then(function(res) { // 请求成功
				if (!res.data.errcode) { // 判断正确返回 access_token
					accessTokenJson.access_token = res.data.access_token; // 跟新
					accessTokenJson.expires_time = new Date().getTime() + (parseInt(res.data
						.expires_in) - 500) * 1000;

					// 重新保存在本地中
					fs.writeFileSync('./datas/access_token.json', JSON.stringify(accessTokenJson));

					resolve(res.data.access_token);
				} else {
					reject(res.data); // 将失败的错误返回
				}
			}).catch(function(e) {
				reject(e); // 将失败的错误返回
			})
		} else { // 如果本地 access_token没有过期，直接将本地存储的返回
			resolve(accessTokenJson.access_token)
		}
	})
}

module.exports = getAccessToken; // 暴露函数
