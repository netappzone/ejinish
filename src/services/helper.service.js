var _ = require('lodash');
import Share from 'react-native-share';

var AppHelper = {
	newGuid: function () {
			function s4() {
					return Math.floor((1 + Math.random()) * 0x10000)
							.toString(16)
							.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					s4() + '-' + s4() + s4() + s4();
	},
	isEmail: function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
	},

	//checking if a string is blank, null or undefined
	stringIsEmpty: function (str) {
			return (!str || /^\s*$/.test(str));
	},

	isNullOrEmpty: function (obj) {
			if (_.isNull(obj) || _.isEmpty(obj) || _.isUndefined(obj)) return true;
			return false;
	},

	isNullOrUndefined: function (obj) {
			if (_.isNull(obj) || _.isUndefined(obj)) return true;
			return false;
	},

	resizeImage: function (image_width, image_height, imageWidth) {
		var imageSize = {
			width: imageWidth,
			height: (imageWidth * image_height) / image_width
		}
		return imageSize;
	},

	convertToInt: function (input, output) {
			try {
					return parseInt(input);
			} catch (e) {
					return output
			}
	},
	
	floatToString: function (numeric, decimals) {
			if (numeric) {
					var amount = numeric.toFixed(decimals).toString();
					//amount.replace('.', Haravan.decimal);
					//if (amount.match('^[\.' + Haravan.decimal + ']\d+')) { return "0" + amount; }
					//else { return amount; }
					return amount;
			}
			return "";
	},

	formatMoney: function (cents, format) {
		if (typeof cents === 'string') {
			cents = cents.replace('.', '');
		}
		var value = '';
		var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
		var formatString = (format || moneyFormat);

		function formatWithDelimiters(number, precision, thousands, decimal) {
			precision = precision || 2;
			thousands = thousands || ',';
			decimal = decimal || '.';

			if (isNaN(number) || number == null) {
				return 0;
			}
			number = (number / 100.0).toFixed(precision);

			var parts = number.split('.');
			var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
			var centsAmount = parts[1] ? (decimal + parts[1]) : '';

			return dollarsAmount + centsAmount;
		}

		switch (formatString.match(placeholderRegex)[1]) {
			case 'amount':
				value = formatWithDelimiters(cents, 2);
				break;
			case 'amount_no_decimals':
				value = formatWithDelimiters(cents, 0);
				break;
			case 'amount_with_comma_separator':
				value = formatWithDelimiters(cents, 2, '.', ',');
				break;
			case 'amount_no_decimals_with_comma_separator':
				value = formatWithDelimiters(cents, 0, '.', ',');
				break;
			case 'amount_no_decimals_with_space_separator':
				value = formatWithDelimiters(cents, 0, ' ');
				break;
		}

		return formatString.replace(placeholderRegex, value);
	},

	/*
	* Display share-screen, using react-native-share.
	*
	* @author: phong.nguyen 20161017 +Hung mBiz
	* @param shareTitle
	* @param shareUrl
	*/
	displayShareScreen: function (shareTitle, shareUrl) {
		// var shareTitle = this.state.article.title.rendered;
		// var shareUrl = this.state.article.link;
		var shareOptions = {
			title: shareTitle,
			message: shareTitle,
			url: shareUrl,
			subject: shareTitle
		};

		Share.open(shareOptions);
	},

	// phong.nguyen 20161202
	// copy from: https://scotch.io/tutorials/how-to-encode-and-decode-strings-with-base64-in-javascript
	Base64: {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}},

	/*
	 * function "scaleImage" - scale image by JS code to FULL device-screen-width (by JS)
	 * (copy from Hung: product.detail.fulldescription.js)
	 *
	 * @author: phong.nguyen 20161214
	 * @param url
	 */
	scaleImage: function() {
	// phong.nguyen 20161212: scale image... Note: do not put comments inside `...`
		return `
		try{
			var widthA = (window.innerWidth > 0) ? window.innerWidth : screen.width;
			var img_width = widthA - 15;
			img_width = img_width + 'px';

			var imgs = document.querySelectorAll("img");
			for( var i = 0; i < imgs.length; i++ ) {
				imgs[i].style.maxWidth = '100%';
				imgs[i].style.height = 'auto';
				var imgSrc = imgs[i].getAttribute("src");
				if (imgSrc.substring(0, 4) != "http") {
					imgSrc = "https:" + imgSrc;
					imgs[i].src = imgSrc;
				}

				var imgAlign = imgs[i].getAttribute("class");
				var parent = imgs[i].parentNode;
				if (imgAlign.indexOf("aligncenter") !== -1 ) {
				var wrapper = document.createElement('center');
				parent.replaceChild(wrapper, imgs[i]);
					wrapper.appendChild(imgs[i]);
				}
				else if (imgAlign.indexOf("alignright") !== -1 ) {
				var wrapper = document.createElement('p');
					wrapper.style.cssFloat = 'right';
				parent.replaceChild(wrapper, imgs[i]);
					wrapper.appendChild(imgs[i]);
				}
			}

			var iframes = document.querySelectorAll("iframe");
			for( var j = 0; j < iframes.length; j++ ) {
				iframes[j].style.width = img_width;
				iframes[j].style.height = '250px';
				var iSrc = iframes[j].getAttribute("src");
				if (iSrc.substring(0, 4) != "http") {
					iSrc = "https:" + iSrc;
					iframes[j].src = iSrc;
				}
			}

			var figures = document.querySelectorAll("figures");
			for( var i = 0; i < figures.length; i++ ) {
				figures[i].style.maxWidth = img_width;
				figures[i].style.height = 'auto';
				var imgSrc = figures[i].getAttribute("src");
				if (imgSrc.substring(0, 4) != "http") {
					imgSrc = "https:" + imgSrc;
					figures[i].src = imgSrc;
				}

				var imgAlign = figures[i].getAttribute("class");
				var parent = figures[i].parentNode;
				if (imgAlign.indexOf("aligncenter") !== -1 ) {
				var wrapper = document.createElement('center');
				parent.replaceChild(wrapper, figures[i]);
					wrapper.appendChild(figures[i]);
				}
				else if (imgAlign.indexOf("alignright") !== -1 ) {
				var wrapper = document.createElement('p');
					wrapper.style.cssFloat = 'right';
				parent.replaceChild(wrapper, figures[i]);
					wrapper.appendChild(figures[i]);
				}
			}
		}catch(e){}
					`;
	}

}

module.exports = AppHelper;
