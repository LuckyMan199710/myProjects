var app = getApp();
module.exports = {
  'logis': function (e) {
    var _this = this;
    _this.setData({
      'hidden': false,
      'refundid': e.currentTarget.dataset.refundid,
      'logis_company': e.currentTarget.dataset.logis_company,
      'retinvoiceno': e.currentTarget.dataset.retinvoiceno,
      'address': e.currentTarget.dataset.address,
      'relname': e.currentTarget.dataset.relname,
    });
  },
  'hidden': function () {
    var _this = this;
    _this.setData({
      'hidden': true
    });
  },
  
};