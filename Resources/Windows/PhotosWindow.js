
var moment = require('/lib/moment');

PhotosWindow = function(options) {
	var that = this;
	that.tabGroup = options.tabGroup;
	var ActivityWindow = require('/Windows/ActivityWindow').ActivityWindow;
	that.activityWindow = new ActivityWindow();

	//
	// create tab window and tab for the videos
	//
	that.window = Titanium.UI.createWindow({
		title : 'Photos',
		backgroundColor : '#fff',
		barColor : '#333399',
	});

	that.window.addEventListener('focus', function(e) {
		if (!that.initialized) {
			initializeWindow.call(that);
		}
	});
	return this;
}
//
// http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=04dff0784ad3f7a204c3ab43dd7c9a2c&user_id=9364837%40N06&format=json&nojsoncallback=1
//

function generateThumbURL(_options) {
	return String.format('http://farm%d.staticflickr.com/%s/%s_%s_q.jpg', _options.farm, _options.server, _options.primary, _options.secret, _options.size || 'q');
}

function initializeWindow(options) {
	var that = this;
	var rows = [];

	that.activityWindow.show("Loading Galleries");
	that.initialized = true;

	that.tableView = Ti.UI.createTableView({
		width : '100%',
		height : '100%',
		minRowHeight : 85
	});

	// when the row is clicked get the pictures and show them
	that.tableView.addEventListener('click', function(_event) {
		loadPhotoGalleryWindow.call(that, _event.rowData.rowObject.id, _event.rowData.rowObject.title._content);

		GoogleAnalytics.trackEvent({
			category : 'Engagement',
			action : 'view_photo_gallery_item',
			url : _event.rowData.rowObject.title._content
		});

	});

	that.tableView.addEventListener('update', function(_data) {
		that.tableView.setData([]);

		for (var c = 0; c < _data.data.length; c++) {
			var i = _data.data[c]

			var row = Ti.UI.createTableViewRow({
				className : 'collection', // used to improve table performance
				selectedBackgroundColor : 'white',
				rowObject : i, // custom property, useful for determining the row during events
				height : 'auto',
				layout : 'horizontal',
			});

			var textContainer = Ti.UI.createView({
				top : 5,
				left : 2,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				layout : 'vertical'
			});

			var imageAvatar = Ti.UI.createImageView({
				image : generateThumbURL(i),
				left : 6,
				top : 5,
				width : 75,
				height : 75
			});
			row.add(imageAvatar);

			var labelUserName = Ti.UI.createLabel({
				font : {
					fontWeight : 'bold'
				},
				text : i.title._content,
				left : 2,
				top : 2,
				width : Ti.UI.FILL,
				height : 'auto'
			});
			textContainer.add(labelUserName);

			var labelDetails = Ti.UI.createLabel({
				font : {
					fontWeight : 'normal'
				},
				text : i.description._content,
				left : 2,
				top : 2,
				width : Ti.UI.FILL,
				height : 'auto'
			});
			textContainer.add(labelDetails);

			var labelDate = Ti.UI.createLabel({
				font : {
					fontWeight : 'normal'
				},
				text : moment.unix(i.date_update).calendar(),
				left : 2,
				top : 2,
				width : Ti.UI.FILL,
				height : 'auto'
			});
			textContainer.add(labelDate);
			row.add(textContainer);

			rows.push(row);
		}

		that.tableView.setData(rows);
		that.activityWindow.hide();
		rows = null;

	});

	that.window.add(that.tableView);

	loadFlickrStream.call(that);
}

function loadPhotoGalleryWindow(_id, _title) {
	var that = this;

	that.activityWindow.show("Loading Photos");

	// http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=37bfb57b45e7462ed2d8224fca155a7f&photoset_id=72157631341404938&format=json&nojsoncallback=1
	var that = this;

	// create table view data object
	var data = [];

	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", "http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=cee595dbbe93626edef03f7f7b376508&photoset_id=" + _id + "&format=json&nojsoncallback=1");
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onerror = function(e) {
		alert(e);
		Ti.API.info(" " + e);
		that.activityWindow.hide();
	};
	xhr.onload = function() {
		try {
			Ti.API.info(" " + xhr.responseText);
			var photoset = JSON.parse(xhr.responseText).photoset;
			Ti.API.info("photoset " + photoset);
			Ti.API.info("photos " + photoset.photo);

			var PGW = require("/Windows/PhotoGalleryWindow").PhotoGalleryWindow;
			var photoGalleryWindow = new PGW({
				title : _title || 'Photo Gallery',
				photos : photoset.photo
			});

			// open the window
			that.tabGroup.activeTab.open(photoGalleryWindow.window);

			that.activityWindow.hide();

		} catch (_) {

		}
	}

	xhr.send();
}

/**
 * ONLY LOAD THE FIRST 25 from the gallery... this needs to be
 * addressed in a later release
 */
function loadFlickrStream() {
	var that = this;

	// create table view data object
	var data = [];

	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", "http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=cee595dbbe93626edef03f7f7b376508&user_id=9364837%40N06&format=json&nojsoncallback=1&per_page=25");
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onerror = function(e) {
		alert(e);
		Ti.API.info(" " + e);
		that.activityWindow.hide();
	};
	xhr.onload = function() {
		try {
			Ti.API.info(" " + xhr.responseText);
			var photosets = JSON.parse(xhr.responseText).photosets;
			Ti.API.info(" " + photosets);

			that.tableView.fireEvent('update', {
				data : photosets.photoset
			});
		} catch (_) {
			that.activityWindow.hide();
		}
	}

	xhr.send();
}

exports.PhotosWindow = PhotosWindow;
