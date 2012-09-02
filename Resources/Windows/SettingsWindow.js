SettingsWindow = function(options) {
	var that = this;

	initializeWindow.call(that);
	return this;
}

function initializeWindow(options) {
	var that = this;
	
	//
	// create tab window and tab for the videos
	//
	that.window = Titanium.UI.createWindow({
		title : 'Settings',
		backgroundColor : '#fff',
		barColor : '#333399',
		url : 'settings.js'
	});
}

exports.SettingsWindow = SettingsWindow;