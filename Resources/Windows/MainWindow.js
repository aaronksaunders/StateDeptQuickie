MainWindow = function(options) {
	var that = this;

	initializeWindow.call(that);
	return this;
}
function initializeWindow(options) {
	var that = this;

	// create tab group
	that.tabGroup = Titanium.UI.createTabGroup({
		moreBarColor : '#333',
		backgroundColor : '#333'
	});

	//
	// create base UI tab and root window
	//
	var NW = require("/Windows/NewsWindow").NewsWindow;
	var newsWindow = new NW({
		tabGroup : that.tabGroup
	});

	var newsTab = Titanium.UI.createTab({
		icon : 'icons/166-newspaper.png',
		title : 'News Stories',
		tabBarColor : 'blue',
		navBarHidden : true,
		window : newsWindow.window
	});

	var VW = require("/Windows/VideoWindow").VideoWindow;
	var videoWindow = new VW({
		tabGroup : that.tabGroup
	})
	var videoTab = Titanium.UI.createTab({
		icon : 'icons/45-movie-1.png',
		title : 'News Video',
		window : videoWindow.window
	});

	var FW = require("/Windows/FavoritesWindow").FavoritesWindow;
	var favoritesWindow = new FW({
		tabGroup : that.tabGroup
	})

	var favoriteTab = Titanium.UI.createTab({
		icon : 'icons/28-star.png',
		title : 'Favorites',
		window : favoritesWindow.window
	});

	var AW = require("/Windows/AboutWindow").AboutWindow;
	var aboutWindow = new AW({
		tabGroup : that.tabGroup
	})

	var aboutTab = Titanium.UI.createTab({
		icon : 'icons/info.png',
		title : 'About',
		window : aboutWindow.window
	});

	var PW = require("/Windows/PhotosWindow").PhotosWindow;
	var photosWindow = new PW({
		tabGroup : that.tabGroup
	})

	var photosTab = Titanium.UI.createTab({
		icon : 'icons/42-photos.png',
		title : 'Photos',
		window : photosWindow.window
	});

	//
	// add tabs
	//
	that.tabGroup.addTab(newsTab);
	that.tabGroup.addTab(videoTab);
	that.tabGroup.addTab(photosTab);
	that.tabGroup.addTab(aboutTab);

	if (Titanium.Platform.name != 'iPhone OS') {
		that.tabGroup.addEventListener('android:back', function(e) {
			Ti.API.Info("Pressing Back Will Not Close The Activity/Window");
			that.tabGroup.close();
		});
	}

	// open tab group
	that.tabGroup.open();

	if (Ti.App.Properties.getBool("STARTUP_GET_COUNTS")) {
		var Utils = require("/services/Utils").Utils
		if (Titanium.Platform.name == 'iPhone OS') {
			Ti.API.info("calling getRSSTopicCounts");
			Utils.getRSSTopicCounts(newsTable);
		} else {
			Ti.API.info("calling getRSSTopicCounts");
			Utils.getRSSTopicCounts(newsTable);
		}
	}

}

exports.MainWindow = MainWindow;
