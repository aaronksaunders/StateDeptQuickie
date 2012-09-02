//Ti.include('sharing.js');

ApplicationController = function() {
	return this;
}

ApplicationController.prototype.run = function() {
	var MW = require("/Windows/MainWindow").MainWindow;
	var mainWindow = new MW();
}

exports.ApplicationController = ApplicationController;