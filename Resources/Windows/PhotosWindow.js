PhotosWindow = function(options) {
	var that = this;

	initializeWindow.call(that);
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

	//
	// create tab window and tab for the videos
	//
	that.window = Titanium.UI.createWindow({
		title : 'Photos',
		backgroundColor : '#fff',
		barColor : '#333399',
	});

	that.tableView = Ti.UI.createTableView({
		width : '100%',
		height : '100%',
		minRowHeight : 85
	});

	that.tableView.addEventListener('update', function(_data) {
		that.tableView.setData([]);

		for (var c = 0; c < _data.data.length; c++) {
			var i = _data.data[c]

			var row = Ti.UI.createTableViewRow({
				className : 'collection', // used to improve table performance
				selectedBackgroundColor : 'white',
				rowIndex : i, // custom property, useful for determining the row during events
				height : 'auto',
				layout : 'horizontal',
			});

			var textContainer = Ti.UI.createView({
				top : 5,
				left : 2,
				height : Ti.UI.SIZE,
				width :Ti.UI.SIZE,
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
				text : i.date_update,
				left : 2,
				top : 2,
				width : Ti.UI.FILL,
				height : 'auto'
			});
			textContainer.add(labelDate);
			row.add(textContainer);

			that.tableView.appendRow(row);
		}

	});

	that.window.add(that.tableView);

	loadFlickrStream.call(that);
}

function loadPhotoGalleryWindow(_id) {
	// http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=37bfb57b45e7462ed2d8224fca155a7f&photoset_id=72157631341404938&format=json&nojsoncallback=1
	var that = this;

	// create table view data object
	var data = [];

	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", "http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=37bfb57b45e7462ed2d8224fca155a7f&photoset_id=" + _id + "&format=json&nojsoncallback=1");
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onerror = function(e) {
		alert(e);
		Ti.API.info(" " + e);
	};
	xhr.onload = function() {
		try {
			Ti.API.info(" " + xhr.responseText);
			var photoset = JSON.parse(xhr.responseText).photoset;
			Ti.API.info("photoset " + photoset);
			Ti.API.info("photos " + photoset.photo);

			that.tableView.fireEvent('update', {
				data : photosets.photoset
			});
		} catch (_) {

		}
	}

	xhr.send();
}


function loadFlickrStream() {
	var that = this;

	// create table view data object
	var data = [];

	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", "http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=04dff0784ad3f7a204c3ab43dd7c9a2c&user_id=9364837%40N06&format=json&nojsoncallback=1");
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onerror = function(e) {
		alert(e);
		Ti.API.info(" " + e);
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

		}
	}

	xhr.send();
}

exports.PhotosWindow = PhotosWindow;