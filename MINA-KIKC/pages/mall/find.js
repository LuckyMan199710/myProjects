// pages/mall/find.js
var app = getApp()
Page({
  data: {
    'base_conf': app.DF,
    'ontabpage': 'find',
    page_path: 'pages/mall/find'
  },
  onLoad: function (options) {
    app.updateIconStyle(this);
    app.alertMsg('开发中')
  }
})