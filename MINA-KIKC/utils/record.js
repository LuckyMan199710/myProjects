var UserAction = function(app){
	return {
    recordSearch: function (rec_type, shopid = '', rec_data = '', searchdata, func) {
      var data = { 'pagetype': rec_type, 'shop_id': shopid, 'pagedata': rec_data, 'opt_type': 'pageevent', 'eventtype': 'F', 'searchdata': searchdata }
			this._fetchRemote(data, func);
		},
		recordAddcart: function (rec_type, shopid = '', rec_data = '', func) {
			var data = { 'pagetype': rec_type, 'shop_id': shopid, 'pagedata': rec_data, 'opt_type': 'pageevent', 'eventtype': 'B' }
			this._fetchRemote(data, func);
		},
		recordZan: function (rec_type, shopid = '', rec_data = '', func) {
			var data = { 'pagetype': rec_type, 'shop_id': shopid, 'pagedata': rec_data, 'opt_type': 'pageevent', 'eventtype': 'Z' }
			this._fetchRemote(data, func);
		},
    delZan: function (rec_type, shopid = '', rec_data = '', func) {
      var data = { 'pagetype': rec_type, 'shop_id': shopid, 'pagedata': rec_data, 'opt_type': 'delpageevent', 'eventtype': 'Z' }
      this._fetchRemote(data, func);
    },
		recordShare: function (rec_type, shopid = '', rec_data = '', func) {
			var data = { 'pagetype': rec_type, 'shop_id': shopid, 'pagedata': rec_data, 'opt_type': 'pagetrans' }
			this._fetchRemote(data, func);
		},
		recordCollect: function (rec_type, shopid = '', rec_data = '', func) {
			var data = { 'pagetype': rec_type, 'shop_id': shopid, 'pagedata': rec_data, 'opt_type': 'pageevent', 'eventtype': 'S' }
			this._fetchRemote(data, func);
		},
    delCollect: function (rec_type, shopid = '', rec_data = '', func) {
      var data = { 'pagetype': rec_type, 'shop_id': shopid, 'pagedata': rec_data, 'opt_type': 'delpageevent', 'eventtype': 'S' }
      this._fetchRemote(data, func);
    },
		recordPageView: function (rec_type, shopid = '', rec_data = '', func) {
			var data = { 'pagetype': rec_type, 'shop_id': shopid, 'pagedata': rec_data, 'opt_type': 'pageview' }
			this._fetchRemote(data, func);
		},
		_fetchRemote: function (data, func) {
			app.http.post('Pubdata/recordUserOpt', data, function (json) {
				typeof func === 'function' && func(json)
			});
		}
	}
}

module.exports = UserAction;