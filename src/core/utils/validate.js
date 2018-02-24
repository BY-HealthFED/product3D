/**
* VPhone(data, Msg, strict)
* 验证手机，data: 手机号码，strict: 当第三个参数设为'strict'时开启严格验证，不填时只验证已1开头的11位手机号码
* VName(data, Msg, Zh)
* 验证姓名，data: 姓名，Zh: 当第三个参数设为'Zh'时开启严格验证，只能填写2以上中文字符
* VEmail(data, Msg)
* 验证邮箱
* VSecurityCode(data, Msg)
* 验证防伪码
* VBarCode(data, Msg)
* 验证条形码
* VVerificationCode(data, Msg, length)
* 验证数字验证码，data: 验证码，length: 验证码的长度(number)不填时默认验证四位验证码。
* VRequire(data, Msg, length)
* 验证必填，data: 需要验证的内容，length: 最少要求多少位字符(number)不填时默认1个字符。
* VLimit(data, Msg, length)
* 验证不超过，data: 需要验证的内容，length: 最多输入多少位字符(number)不填时默认20个字符。
* VNumber(data, Msg)
* 验证数字，data: 需要验证的内容
* VChinese(data, Msg)
* 验证中文，data: 需要验证的内容
* VEnglish(data, Msg)
* 验证英文，data: 需要验证的内容
* VEnglish_(label)
＊ 多个字段用同类型规则验证时需要给Key家label VEnglish_(label)
* validate({
	VChinese_name: name,
	VChinese_address: address,
})
 */

/**
 * validate the phone
 *
 * @export
 * @data {String|Number} request
 * @strict {String}
 */
const VPhone = function(data, Msg, strict) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;

	const fixStrict = strict || null;

	if (!Str || Str.length !== 11) {
		return (Msg || '请输入11位手机号码');
	}

	if (!(/^[0-9]*$/.test(Str))) {
		return (Msg || '手机号码格式不正确');
	}

	if (fixStrict !== 'strict' && !(/^1\d{10}$/.test(Str))) {
		return (Msg || '请输入以1开头的11位手机号码');
	}

	if (fixStrict === 'strict' && !(/^1[3|4|5|7|8]\d{9}$/.test(Str))) {
		return (Msg || '请输入正确手机号码');
	}

	return false;
};

/**
 * validate the name
 *
 * @export
 * @data {String} request
 * @Zh {String} = 'Zh' validate the chinese name
 */
const VName = function(data, Msg, Zh) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;
	const fixZh = Zh || null;

	if (!Str || Str.length < 1) {
		return (Msg || '请输入您的姓名');
	}

	if (fixZh !== 'Zh' && !(/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(Str))) {
		return (Msg || '姓名请使用非特殊字符');
	}

	if (fixZh === 'Zh' && Str.length < 2) {
		return (Msg || '请输您的真实姓名');
	}

	if (fixZh === 'Zh' && !(/^[\u4e00-\u9fa5]+$/.test(Str))) {
		return (Msg || '请输您的真实姓名');
	}

	return false;
};

/**
 * validate the email address
 *
 * @export
 * @data {String} request
 */
const VEmail = function(data, Msg) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;

	if (!Str || Str.length < 1) {
		return (Msg || '请输入您的邮箱');
	}

	if (!(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(Str))) {
		return (Msg || '请输正确的邮箱地址');
	}

	return false;
};

/**
 * validate the security code
 *
 * @export
 * @data {String} request
 */
const VSecurityCode = function(data, Msg) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;

	if (!Str || Str.length !== 16) {
		return (Msg || '请输入16位防伪码');
	}

	if (!(/^[0-9]*$/.test(Str))) {
		return (Msg || '您输入的防伪码格式不正确，请重新输入');
	}

	return false;
};

/**
 * validate the bar code
 *
 * @export
 * @data {String} request
 */
const VBarCode = function(data, Msg) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;

	if (!Str || Str.length !== 13) {
		return (Msg || '请输入13位产品条形码');
	}

	if (!(/^[0-9]*$/.test(data))) {
		return (Msg || '您输入的产品条形码格式不正确，请重新输入');
	}

	return false;
};

/**
 * validate the verification code
 *
 * @export
 * @data {String} request
 * @length {Number} default 4
 */
const VVerificationCode = function(data, Msg, length) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;
	const fixLength = length || 4;

	if (length && isNaN(fixLength)) {
		return Msg || '验证码验证时参数错误';
	}

	if (!Str || Str.length !== fixLength) {
		return (Msg || `请输入${fixLength}位验证码`);
	}

	if (!(/^[0-9]*$/.test(Str))) {
		return (Msg || '您输入的验证码格式不正确，请重新输入');
	}

	return false;
};

/**
 * validate the required data
 *
 * @export
 * @data {String} request
 * @length {Number} request
 */
const VRequire = function(data, Msg, length) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;
	const fixLength = length || 1;

	if (isNaN(fixLength) || !Str) {
		return Msg || '必填项验证时参数错误';
	}

	if (Str.length < fixLength) {
		return true;
	}

	return false;
};

/**
 * Limit string length
 *
 * @export
 * @data {String} request
 * @length {Number} request
 */
const VLimit = function(data, Msg, length) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;
	const fixLength = length || 20;

	if (isNaN(fixLength) || !Str) {
		return Msg || '限制字符串长度验证时参数错误';
	}

	if (Str.length > fixLength) {
		return true;
	}

	return false;
};

/**
 * input number
 *
 * @export
 * @data {String} request
 */
const VNumber = function(data, Msg) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;

	if (!(/^[0-9]*$/.test(Str))) {
		return Msg || true;
	}

	return false;
};

/**
 * input chinese
 *
 * @export
 * @data {String} request
 */
const VChinese = function(data, Msg) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;

	if (!(/^[\u4e00-\u9fa5]+$/.test(Str))) {
		return Msg || true;
	}

	return false;
};

/**
 * input English
 *
 * @export
 * @data {String} request
 */
const VEnglish = function(data, Msg) {
	let Str;

	if (data !== 0) {
		Str = data;
	} else {
		Str = '0';
	}

	Str
		? Str = Str.toString()
		: null;

	if (!(/^[a-zA-Z]*$/.test(Str))) {
		return Msg || true;
	}

	return false;
};

/**
 * validate
 *
 * @export
 * @arguments {String|Boolean} request
 */
function validate(data, strict) {

	if (!data || !(data instanceof Object)) {
		console.error('validate方法，请传入验证对象类型参数{key: value}');
		return '验证失败，传入参数不正确！';
	}

	if (Array.isArray(data)) {
		console.error('validate方法，请传入验证对象类型参数{key: value}');
		return '验证失败，传入参数不正确！';
	}

	if (strict && typeof strict === 'boolean') {
		const VError = {};
		for (let key in data) {
			if ({}.hasOwnProperty.call(data, key)) {

				if (key.indexOf('_') !== -1) {
					const splitkey = key.split('_')[0];
					if (validate[splitkey]) {
						if (Array.isArray(data[key])) {
							const _Ad = validate[splitkey].apply( validate[splitkey], data[key]);
							if (_Ad) {
								VError[key] = _Ad;
							} else {
								VError[key] = false;
							}
						} else {
							const _Nd = validate[splitkey](data[key]);
							if (_Nd) {
								VError[key] = _Nd;
							} else {
								VError[key] = false;
							}
						}
					}
				}

				if (key.indexOf('_') === -1) {
					if (validate[key]) {
						if (Array.isArray(data[key])) {
							const Ad = validate[key].apply( validate[key], data[key]);
							if (Ad) {
								VError[key] = Ad;
							} else {
								VError[key] = false;
							}
						} else {
							const Nd = validate[key](data[key]);
							if (Nd) {
								VError[key] = Nd;
							} else {
								VError[key] = false;
							}
						}
					}
				}
			}
		}

		return VError;
	}

	for (let key in data) {
		if ({}.hasOwnProperty.call(data, key)) {

			if (key.indexOf('_') !== -1) {
				const splitkey = key.split('_')[0];
				if (validate[splitkey]) {
					if (Array.isArray(data[key])) {
						const _Ad = validate[splitkey].apply( validate[splitkey], data[key]);
						if (_Ad) {
							return _Ad;
						}
					} else {
						const _Nd = validate[splitkey](data[key]);
						if (_Nd) {
							return _Nd;
						}
					}
				}
			}

			if (key.indexOf('_') === -1) {
				if (validate[key]) {
					if (Array.isArray(data[key])) {
						const Ad = validate[key].apply( validate[key], data[key]);
						if (Ad) {
							return Ad;
						}
					} else {
						const Nd = validate[key](data[key]);
						if (Nd) {
							return (Nd);
						}
					}
				}
			}
		}
	}

	return false;
}


validate.VPhone = VPhone;
validate.VName = VName;
validate.VEmail = VEmail;
validate.VSecurityCode = VSecurityCode;
validate.VBarCode = VBarCode;
validate.VVerificationCode = VVerificationCode;
validate.VRequire = VRequire;
validate.VLimit = VLimit;
validate.VNumber = VNumber;
validate.VChinese = VChinese;
validate.VEnglish = VEnglish;

export default validate;

