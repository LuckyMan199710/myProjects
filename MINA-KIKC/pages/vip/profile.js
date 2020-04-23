var wig_deliver = require('../../utils/wig_deliver.js');
var app = getApp()
var userRecord = require('../../utils/record.js');
var UserAction = userRecord(app);

let pageObj = {
	data: {
    'base_conf': app.DF,
    page_path: 'pages/vip/profile'
  },
	bindDateChange: function (e) {
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		var currentdate = this.getNowFormatDate();
	    if ((id == "birthday" || id == "otherdate1") && currentdate < e.detail.value) {
	      app.alertMsg("你选择的日期已经超过当前日期");
	      return false;
	    }
		this.setData({
			inputData: this.inputData
		})
	},
	getNowFormatDate: function () {
	    //获取当前日期
	    var date = new Date();
	    var seperator1 = "-";
	    var year = date.getFullYear();
	    var month = date.getMonth() + 1;
	    var strDate = date.getDate();
	    if (month >= 1 && month <= 9) {
	      month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	      strDate = "0" + strDate;
	    }
	    var currentdate = year + seperator1 + month + seperator1 + strDate;
	    return currentdate;
	  },
	bindSexChange: function (e) {
		var id = e.currentTarget.id;
		this.inputData[id] = this.data.sex_codes.code[e.detail.value];
		if(id=='sex'){
			this.inputData[id + '_sex'] = e.detail.value;
		}
		this.setData({
			inputData: this.inputData
		})
	},
	bindLabelChange: function (e) {
		console.log('bindLabelChange  e',e);
		var id = e.currentTarget.id;
		var value = e.detail.value;
		var lblclass = this.data.lblclass;
		var new_labelnum = [];
		lblclass && lblclass.forEach(function(item,index){
			if(item.classnum == id){
				lblclass[index]['label_index'] = value;
				new_labelnum.push(lblclass[index]['label_codes'][value]['code_num']);
			}
		});
		console.log('lblclass',lblclass);
		console.log('new_labelnum',new_labelnum);
		this.setNewData(id, new_labelnum, 1);
	},
	bindBlur: function (e) {
		var id = e.currentTarget.id;
		this.inputData[id] = e.detail.value;
		this.setData({
			inputData: this.inputData
		})
	},

  radioChanges: function (e) {
    // 单选
    var id = e.currentTarget.id;
    var new_value = e.detail.value;
    this.setNewData(id, new_value, 1);
  },
  checkboxChanges: function (e) {
    // 多选
    var id = e.currentTarget.id;
    var new_value = e.detail.value;
    console.log('checkboxChanges  new_value',new_value);
    this.setNewData(id, new_value, 2);
  },
  setNewData: function (id, new_value, is_radiocheck) {
    console.log(new_value)
    
    var lblclass = this.data.lblclass;
    lblclass && lblclass.forEach(function (item, idx) {
      if (item.classnum == id) {
        //特殊处理
        if (is_radiocheck == 1) {
          item.sub && item.sub.forEach(function (item2, idx2) {
            if (new_value.indexOf(item2.labelnum) != '-1') {
              item2.checked = 'checked';
            } else {
              item2.checked = false;
            }
            return item2;
          })
        }
        if (is_radiocheck == 2) {
          item.sub && item.sub.forEach(function (item2, idx2) {
            if (new_value.indexOf(item2.labelnum) != '-1') {
              item2.checked = 'checked';
            } else {
              item2.checked = false;
            }

            return item2;
          })
        }
      }
      return item;
    });
    this.setData({
      lblclass: lblclass,
    });
  },

  // radioChange: function (e) {
  //   var _this = this;
  //   var labelnum = e.currentTarget.dataset.labelnum;
  //   var classnum = e.currentTarget.dataset.classnum;
  //   if (_this.inputData['classnum']){
  //     _this.inputData['classnum'] = _this.inputData['classnum'].replace(classnum + ';', '');
  //   }
  //   var lblclass = this.data.lblclass
  //   if (lblclass) {
  //     lblclass.forEach(function (item, idx) {
  //       if (item.sub) {
  //         item.sub.forEach(function (item2, idx2) {
  //           if (classnum == item2.classnum) {
  //             item2.labelnum_v = '';
  //             if (item2.labelnum == labelnum && classnum == item2.classnum) {
  //               item2.labelnum_v = '1';
  //               if (_this.inputData['labelnum']) {
  //                 _this.inputData['labelnum'] = _this.inputData['labelnum'] + labelnum + ';';
  //               } else {
  //                 _this.inputData['labelnum'] = labelnum + ';';
  //               }
  //               if (_this.inputData['classnum']) {
  //                 _this.inputData['classnum'] = _this.inputData['classnum'] + classnum + ';';
  //               } else {
  //                 _this.inputData['classnum'] = classnum + ';';
  //               }
  //             }else{
  //               if (_this.inputData['labelnum']) {
  //                 _this.inputData['labelnum'] = _this.inputData['labelnum'].replace(item2.labelnum + ';', '');
  //               }
  //             }
  //           }
  //           return item2;
  //         })
  //       }
  //     })
  //     this.setData({
  //       lblclass: lblclass,
  //       inputData: this.inputData
  //     });
  //   }
  // },
  // checkboxChange:function(e){
  //   var _this=this;
  //   var labelnum = e.currentTarget.dataset.labelnum;
  //   var classnum = e.currentTarget.dataset.classnum;
   
  //   var lblclass = this.data.lblclass
  //   if (lblclass) {
  //     lblclass.forEach(function (item, idx) {
  //       if (item.sub) {
  //         item.sub.forEach(function (item2, idx2) {
  //           if (labelnum == item2.labelnum && classnum == item2.classnum){
  //             if (item2.labelnum_v){
  //               item2.labelnum_v='';
  //               _this.inputData['labelnum'] = _this.inputData['labelnum'].replace(labelnum+';', '');
  //               _this.inputData['classnum'] = _this.inputData['classnum'].replace(classnum + ';', '');
  //             }else{
  //               item2.labelnum_v = '1';
  //               if (_this.inputData['labelnum']) {
  //                 _this.inputData['labelnum'] = _this.inputData['labelnum']  + labelnum+';';
  //               } else {
  //                 _this.inputData['labelnum'] = labelnum + ';';
  //               }
  //               if (_this.inputData['classnum']) {
  //                 _this.inputData['classnum'] = _this.inputData['classnum']  + classnum + ';';
  //               } else {
  //                 _this.inputData['classnum'] = classnum + ';';
  //               }
  //             }
  //           }
  //           return item2;     
  //         })
  //       }
  //     })
  //     this.setData({
  //       lblclass: lblclass,
  //       inputData: this.inputData
  //     });
  //   }
  // },
	formSubmit: function (e) {
		var _this = this;
		var fields = this.data.fields;
		var mustInput = this.mustInput;
		let err_msg = '';
		
		for (var i = 0; i < fields.length; i++) {
			if (mustInput.includes(parseInt(fields[i].status)) && !_this.inputData[fields[i].name]) {
				err_msg = fields[i].text + '为必填项';
				break;
			}
		}
		if (!!err_msg) {
			app.alertMsg(err_msg);
			return false;
		}
    var lblclassarr = [];
    if (_this.data.lblclass){
      _this.data.lblclass.forEach(function (item, idx) {
        var labelnumvalue=e.detail.value;
        console.log('labelnumvalue',labelnumvalue);
        var itemclassnum = item.classnum;
        if (item.classnum){
        	if(item.multiselect == 'N'){
        		//下拉选择
        		if(item.label_index<=-1){
        			err_msg = !err_msg?'请选择'+item.classname:err_msg;
        		}else{
        			var temp_labvalue = [];
        			temp_labvalue.push(item.label_codes[item.label_index]['code_num']);
        			lblclassarr.push({
                        key: item.classnum,
                        value: temp_labvalue
                      })
        		}
        	}else{
        		if ((!labelnumvalue['classnum' + itemclassnum]) || (!labelnumvalue['classnum' + itemclassnum][0])){
                    err_msg = '请选择'+item.classname;
                  }else{
                    //lblclassarr[item.classnum] = labelnumvalue['classnum' + itemclassnum];
                    lblclassarr.push({
                      key: item.classnum,
                      value: labelnumvalue['classnum' + itemclassnum]
                    })
                  }
        	}
          
        }
      })

    }
    console.log('lblclassarr',lblclassarr);
   
    console.log(lblclassarr)
    _this.inputData['lblclassarr'] = lblclassarr;
    _this.inputData['lblclassarr'] = JSON.stringify(_this.inputData['lblclassarr']);
    if (!!err_msg) {
      app.alertMsg(err_msg);
      return false;
    }
    console.log('updateVip  inputData',_this.inputData);
    //return false
    wx.showLoading();
		app.http.post('Login/updateVip', _this.inputData, function (json) {
      wx.hideLoading();
			if (json.success == 1) {
				app.alertMsg(json.msg, {
					cb: app.jumpToMainPage
				});
			} else {
				app.alertMsg(json.msg);
			}
		});
	},
	onShow:function(){
    app.checkUserStatus(() => {
      this.initPage();
      if (wx.getStorageSync('refeshAddr')) {
        this.setOrderAddr();
        this.bindSetRecAddr();
        wx.setStorageSync('refeshAddr', false);
      }
        
    });
		// this.showVipPhone();
  },
  onReady: function () {
    wx.setNavigationBarTitle({ title: '个人资料' });
  },
  onLoad: function (option) {
    this._option = option;
    app.vipLogin(this.data.page_path + app.query2Str(option));
    app.updateIconStyle(this);
    this.setData({
		'bannarH': app.globalData.sys_info.windowWidth * 100 / 320,
	  'windowHeight': app.globalData.sys_info.windowHeight
	});
	},
  loadInitData: function (callback) {
    var _this = this;
  },
  initPage:function(){
    var _this = this;
      
      wx.showLoading();
      app.http.post('Login/getVipSignFields', { getvip: 'Y' }, function (json) {
        if (json.success == 1) {
          wx.hideLoading();
          if (!json.vip_info) {
        	  if(json.apply_auth){
        		  app.alertMsg('加载数据失败，请授权微信公开信息', {
                      cb: function(){
                    	  wx.redirectTo({
          	                 url: "/pages/userauth",
          	               })
                      }
                    })
        		  
 	               return;
        	  }
            app.alertMsg('加载异常', {
              cb: app.goBack
            })
          }
          //已填写的数据
          _this.inputData = json.vip_info;

          var sex_code = [];
          var sex_name = [];
          if (json.sex_codes) {
            json.sex_codes.forEach(function (item) {
              sex_code.push(item.code_num);
              sex_name.push(item.code_name);
            });
          }
          var sex_codes = {
            code: sex_code,
            name: sex_name,
          };
          if (_this.inputData['sex']) {
            _this.inputData['sex_sex'] = sex_codes.code.indexOf(_this.inputData['sex'])
          }
          _this.lblclass = json.lblclass;
          let shop_address = '';
          let temp_show = false;
          if (json.platshop != null) {
            shop_address = json.platshop.address;
            if (shop_address) {
              temp_show = (shop_address.length > 10 ? false : true);
              if (shop_address.length > 15) {
                json.platshop.address = shop_address.substr(0, 15) + '...';
              }
            }
          }
          _this.setData({
            'loadend': true,
            'fields': json.fields,
            'sex_codes': sex_codes,
            'inputData': _this.inputData,
            'lblclass': json.lblclass,
            'platshop': json.platshop,
            'shop_city_show':temp_show,
            'shop_area_show':temp_show,
            'personal_image_bg':json.personal_image_bg||''
          });
          _this.mustInput = json.mustInput || [2, 3];

          _this.showVipPhone();

          //_this.inputDatalblclass();

        } else {
          app.alertMsg('加载失败');
        }
        
      });

      app.http.post('Login/getFillInfoGift', {}, function (json) {
        if (json.success == 1 && json.send_tip) {
          _this.setData({
            'send_tip': json.send_tip
          });
        }
      });
      app.http.post('Member/viprule', {}, function (json) {
        _this.setData({
          'vipruletitle': json.title
        });
      });
      // 访问记录
      UserAction.recordPageView('VIP', 0, '');
      _this.initDeiverType(2);
  },
	showVipPhone:function(){
		if (this.data.loadend == true) {
			var vip_info = wx.getStorageSync('vip_info');
			this.setData({
				'phone': vip_info.phone||''
			});
		}
	},
  setOrderAddr: function (lineid) {
    var _this = this;
    if (lineid) {
      var addr = app.getVipAddrById(lineid);
      if (addr) {
        wx.showLoading({ title: '请稍后...' })
        app.http.post('Member/updatedefault', { 'id': addr.id }, function (json) {
          wx.hideLoading();
          if (json.success == -1) {
            app.alertMsg(json.msg);
          }else{
            _this.setData({
              'recAddr': addr,
            });
            wx.setStorageSync('vip_address', json.data || []);
          }
        });
        return
      }
      
    }
    app.getVipDefAddr(function (addr) {
			_this.setData({
				'recAddr': addr
			});
		},true)
  },

  delOrderAddr: function (lineid) {
    var _this = this;
    if (lineid) {
      var addr = app.getVipAddrById(lineid);
      if (addr) {
        wx.showLoading({ title: '请稍后...' })
        app.http.post('Member/delVipAddress', { 'id': addr.id }, function (json) {
          wx.hideLoading();
          if (json.success == -1) {
            app.alertMsg(json.msg);
          }else{
            _this.setData({
              'wig_address_list': json.data,
            });
            console.log(json.data)
            wx.setStorageSync('vip_address', json.data || []);
          }
        });
        return
      }

    }
  },
  

  // inputDatalblclass: function () {
  //   var _this=this;
  //   var lblclass = this.data.lblclass

  //   if(lblclass){
  //     lblclass.forEach(function (item, idx) {
  //       if (item.sub){
  //         item.sub.forEach(function (item2, idx2) {

  //           if (item2.labelnum_v) {

  //             if (_this.inputData['labelnum']) {
  //               _this.inputData['labelnum'] = _this.inputData['labelnum'] + item2.labelnum + ';';
  //             } else {
  //               _this.inputData['labelnum'] = item2.labelnum + ';';
  //             }
  //             if (_this.inputData['classnum']) {
  //               _this.inputData['classnum'] = _this.inputData['classnum'] + item2.classnum + ';';
  //             } else {
  //               _this.inputData['classnum'] = item2.classnum + ';';
  //             }
  //           }
  //           return item2;
  //         })
  //       }
  //     })
  //     this.setData({
  //       inputData: this.inputData
  //     });
  //   }
  // }
}
Object.assign(pageObj.data, wig_deliver.wig_data);
Object.assign(pageObj, wig_deliver);

Page(pageObj);
