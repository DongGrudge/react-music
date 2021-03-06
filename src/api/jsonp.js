import originJsonp from "jsonp";

let jsonp = (url, data, option) => {
	return new Promise((resolve, reject) => {
		originJsonp(bindUrl(url, data), option, (err, data) => {
			if (!err) {
				resolve(data);
			} else {
				reject(err);
			}
		});
	});
};

/**
 * 参数拼接到URL
 * @param {*} url
 * @param {*} data
 */
function bindUrl(url, data) {
	let params = [];
	for (let k in data) {
		params.push(`${k}=${data[k]}`);
	}
	let param = params.join("&");
	if (url.indexOf("?") === -1) {
		url += "?" + param;
	} else {
		url += "&" + param;
	}
	return url;
}

export default jsonp;
