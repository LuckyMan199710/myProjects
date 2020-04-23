var m = {
	extend: function (o) {
		var extended = o.extended; Object.assign(this, o); if (extended) extended(this);
	},
	include: function (o) {
		var included = o.included; Object.assign(this.prototype, o); if (included) included(this);
	},
	'model_created': function () {
		this.records = {};
		this.attributes = [];
	},
	'find': function (id) {
		return this.records[id].dup();
	},
	'populate': function (recs) {
		this.records = {};
		if (recs) {
			for (var i = 0, il = recs.length; i < il; i++) {
				var temprec = this.init(recs[i]);
				temprec.newRecord = false;
				temprec.old_attr_data = temprec.record_attributes();
				this.records[temprec._id] = temprec;
			}
		}
	},
	'getRecords': function () {
		var recordArr = [];
		for (var i in this.records) {
			if (this.records.hasOwnProperty(i)) {
				recordArr.push(this.records[i]);
			}
		}
		return recordArr;
	},
	'getPureRecords': function () {
		var recordArr = [];
		for (var i in this.records) {
			if (this.records.hasOwnProperty(i)) {
				var temp = {};
				for (var j = 0; j < this.attributes.length;j++){
					var k = this.attributes[j];
					temp[k] = this.records[i][k];
				}
				recordArr.push(temp);
			}
		}
		return recordArr;
	},
	'prototype': {
		init: function (attrs) {
			if (attrs) {
				this.load(attrs);
			}
			this.old_attr_data = this.record_attributes();
		},
		load: function (attrs) {
			for (var i in attrs) {
				this[i] = attrs[i];
			}
		},
		updateDataAttr: function (attrs) {
			for (var i in attrs) {
				if (this.parent.attributes.indexOf(i) != -1) {
					this[i] = attrs[i];
				}
			}
		},
		attributes: function () {
			var result = {};
			for (var i in this.parent.attributes) {
				var attr = this.parent.attributes[i];
				result[attr] = this[attr];
			}
			result['_id'] = this._id;
			return result;
		},
		record_attributes: function () {
			var result = {};
			for (var i in this.parent.attributes) {
				var attr = this.parent.attributes[i];
				result['original_' + attr] = this[attr];
			}
			return result;
		},
		create: function () {
			if (!this._id) this._id = Math.guid();
			this.newRecord = false;
			this.parent.records[this._id] = this.dup();
		},
		save: function () {
			this.newRecord ? this.update() : this.create();
			this.old_attr_data = this.record_attributes();
		},
		update: function () {
			this.parent.records[this._id] = this.dup();
		},
		deleteins: function () {
			delete this.parent.records[this._id];
		},
		dup: function () {
			var temp = Object.create(this.parent.prototype);
			return  Object.assign(temp, this);
		},
		createRemote: function (url, callback) {
			console.log(createRemote);
			// $.post(url, this.attributes(), callback);
		},
		updateRemote: function (url, callback) {
			var data = this.attributes();
		}

	},
	'create': function () {
		var obj = Object.create(this);
		obj.prototype = Object.create(this.prototype);
		obj.model_created();
		return obj;
	},
	'init': function () {
		var ins = Object.create(this.prototype);
		ins.parent = this;
		ins.init.apply(ins, arguments);
		return ins;
	}
};
module.exports = m;
