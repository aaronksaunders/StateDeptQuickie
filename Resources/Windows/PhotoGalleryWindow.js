PhotoGalleryWindow = function(options) {
	var that = this;

	initializeWindow.call(that, options);
	return this;
}
/**
 *
 * @param {Object} option
 */
function initializeWindow(_options) {

	var self = this, photos = _options.photos, title = _options.title;

	var imageNumber = 0;
	var count = Ti.UI.createLabel({
		text : (imageNumber + 1) + ' / ' + photos.length,
		width : 75,
		textAlign : 'center'
	});

	var _titleLabel = Ti.UI.createLabel({
		text : title,
		top : 5,
		width : 'auto',
		height : '100%',
		color : '#fff',
		font : {
			fontWeight : 'bold',
			fontSize : '13px'
		}
	});

	var win = self.window = Ti.UI.createWindow({
		titleControl : _titleLabel,
		backgroundColor : '#fff',
		barColor : '#333399',
	});

	if (Titanium.Platform.name == 'iPhone OS') {
		// listen for click to share message
		// create button
		var shareBtn = Titanium.UI.createButton({
			//image:'icons/share-icon-24x24.png',
			title : 'Share',
			style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});

		// add the event listener
		shareBtn.addEventListener('click', function(e) {
			Ti.include('sharing.js');

			// make a big image URL
			photos[imageNumber].size = "_b";

			var photoData = {
				our_title : photos[imageNumber].title,
				video_twitter_url : generateImageURL(photos[imageNumber]),
				video_thumb : generateThumbURL(photos[imageNumber])
			}
			Sharing.displayinformation(photoData, win);
		});
		var b = Titanium.UI.createButton({
			title : 'Close',
			style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		win.setRightNavButton(shareBtn);
	}

	var mainView = Ti.UI.createScrollableView({
		top : 0,
		currentPage : imageNumber,
		bottom : 0,
		right : 0,
		left : 0
	});
	var data = [];

	for (var i = 0; i < photos.length; i++) {

		var img = Ti.UI.createImageView({
			image : generateImageURL(photos[i]),
			defaultImage : ' ',
		});

		data[i] = img;
	}

	mainView.setViews(data);
	data = null;

	mainView.addEventListener('scroll', function(e) {
		var currentPage = mainView.currentPage || 0;
		count.text = currentPage + 1 + ' / ' + photos.length;

		imageNumber = currentPage;
		
	});

	mainView.addEventListener('scrollEnd', function(e) {
		
		GoogleAnalytics.trackEvent({
			category : 'Engagement',
			action : 'view_photo_item',
			url : generateImageURL(photos[imageNumber])
		}); 

	});

	win.add(mainView);

};

/**
 *
 * @param {Object} _options
 */
function generateImageURL(_options) {
	return String.format('http://farm%d.staticflickr.com/%s/%s_%s%s.jpg', _options.farm, _options.server, _options.id, _options.secret, _options.size || "");
}

function generateThumbURL(_options) {
	return String.format('http://farm%d.staticflickr.com/%s/%s_%s_q.jpg', _options.farm, _options.server, _options.primary || _options.id, _options.secret);
}

/**
 *
 */
PhotoGalleryWindow.prototype.open = function() {
	this.window.open();
}

exports.PhotoGalleryWindow = PhotoGalleryWindow;
