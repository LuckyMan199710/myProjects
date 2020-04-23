var NavAction = function(app){
	return {
    nav: function (navhidden) {
      if (navhidden) {
        var navhidden = false;
      } else {
        var navhidden = true;
      }
      return navhidden
    },
	}
}

module.exports = NavAction;