var app = getApp();
let pageObj = {
  data: {
    imgbase: app.STATIC_URL + 'uploads/',
    'base_conf': app.DF,
    'show_head':false,
    'show_content': false,
    page_path: 'pages/mall/orderinvoice'
  },
  bindRadioChange:function(e){
    var invoice_type = e.detail.value;
    var show_content = false;
    var show_head = false;
    if (invoice_type == 'P' || invoice_type == 'C'){
      show_content=true;
    }
    if (invoice_type == 'C') {
      show_head = true;
    }
    this.setData({
      'invoice_type': invoice_type,
      'show_head': show_head,
      'show_content': show_content
    });
  },
  bindInputBlur:function(e){
    var name = e.currentTarget.id;
    var value = e.detail.value;
    var invoice = this.data.invoice || {};
    invoice['invoice_type'] = this.data.invoice_type;
    invoice[name] = value;
    this.setData({
      'invoice': invoice
    })
  },
  bindConfirm:function(){
    this._validInput();
  },
  //校验逻辑
  _validInput: function () {
    var invoice = this.data.invoice;
    var itype = invoice['invoice_type'];
    if (itype == 'P' || itype == 'C'){
      if (this.trim(invoice['invoice_name']) == '' ){
        app.alertMsg('发票内容必填');
        return false;
      }
    }
    if (itype == 'C') {
      if (this.trim(invoice['invoice_company']) == '') {
        app.alertMsg('单位名称必填');
        return false;
      }
      if (this.trim(invoice['invoice_compay_taxno']) == '') {
        app.alertMsg('纳税人识别号必填');
        return false;
      }
    }
    wx.setStorageSync('invoice', invoice);
    app.goBack();
  },
  trim: function (str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  onShow: function () {
    app.checkUserStatus(() => {
      this.initPage();
    });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '发票信息' });
  },
  initPage:function(){
    var invoice = wx.getStorageSync('invoice');
    if (!invoice) {
      invoice = {
        'invoice_type': 'N'
      }
    }
    var invoice_type = invoice.invoice_type;
    var show_content = false;
    var show_head = false;
    if (invoice_type == 'P' || invoice_type == 'C') {
      show_content = true;
    }
    if (invoice_type == 'C') {
      show_head = true;
    }
    this.setData({
      'invoice_type': invoice.invoice_type,
      'show_head': show_head,
      'show_content': show_content,
      'invoice': invoice
    })
  }
};


Page(pageObj);