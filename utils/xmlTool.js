var xml2js =require('xml2js');

module.exports = {
	toJson: function (xml) { // 将xml转化为json格式
		return new Promise(function (resolve, reject) {
			var xmlParser = new xml2js.Parser({
				explicitArray:false, // xml2js默认会把子子节点的值转化为数组，所以要设置为false
				ignoreAttrs: true // 忽略xml属性，仅创建文本
			});
			
			xmlParser.parseString(xml, function(err,data) {
				if(err) return reject((err));
				
				resolve(data);
			})
		})
	},
	toXml: function (strObj) { // 将json转化为xml格式
		var builder = new xml2js.Builder();
		
		return builder.buildObject(strObj);
	}
}