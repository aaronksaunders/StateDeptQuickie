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
		window : videoWindow
	});


	var FW = require("/Windows/FavoritesWindow").FavoritesWindow;
	var favoritesWindow = new FW({
		tabGroup : that.tabGroup
	})

	var favoriteTab = Titanium.UI.createTab({
		icon : 'icons/28-star.png',
		title : 'Favorites',
		window : favoritesWindow
	});
	
	var SW = require("/Windows/SettingsWindow").SettingsWindow;
	var settingsWindow = new SW({
		tabGroup : that.tabGroup
	})

	var settingsTab = Titanium.UI.createTab({
		icon : 'icons/20-gear2.png',
		title : 'Settings',
		window : settingsWindow
	});

	//
	// add tabs
	//
	that.tabGroup.addTab(newsTab);
	that.tabGroup.addTab(videoTab);
	that.tabGroup.addTab(favoriteTab);
	that.tabGroup.addTab(settingsTab);

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