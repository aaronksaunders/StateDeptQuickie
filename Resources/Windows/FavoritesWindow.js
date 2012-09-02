FavoritesWindow = function(options) {
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
		title : 'Favorites',
		backgroundColor : '#fff',
		barColor : '#333399',
		url : 'favorites.js',
	});
}

exports.FavoritesWindow = FavoritesWindow;