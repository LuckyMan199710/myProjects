var wid_dialog = {
	'prototype': {
		'wig_dialog_load': true,
		'wid_dialog_catchTouch': function () { },
		'wig_dialog_close': function () {
			var tempConf = this.data.wid_dialog_conf;
			Object.assign(tempConf, { 'is_show': false });
			this.setData({
				wid_dialog_conf: tempConf
			});
		}
	},
	'openDialog': function (option) {
		var _this = this;
		if (!this.wig_dialog_load) {
			Object.assign(_this, wid_dialog.prototype);
		}
		option['is_show'] = true;
		_this.setData({
			wid_dialog_conf: option
		});

		var resetDialogH = function () {
			//调整高度
			setTimeout(function () {
				wx.createSelectorQuery().select('.dialog_box').boundingClientRect(function (rect) {
					if (rect) {
						var tempConf = _this.data.wid_dialog_conf;
						Object.assign(tempConf, { 'dialog_H': rect.height });
						_this.setData({
							wid_dialog_conf: tempConf
						});
					} else {
						resetDialogH();
					}
				}).exec();
			}, 0);
		};
		resetDialogH();

	}
};



module.exports = wid_dialog;