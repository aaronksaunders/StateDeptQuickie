VideoWindow = function(options) {
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
		title : 'News Video',
		backgroundColor : '#fff',
		barColor : '#333399',
		url : 'youtube.js'
	});
}

exports.VideoWindow = VideoWindow;