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

	win.add(mainView);

};

/**
 *
 * @param {Object} _options
 */
function generateImageURL(_options) {
	return String.format('http://farm%d.staticflickr.com/%s/%s_%s.jpg', _options.farm, _options.server, _options.id, _options.secret);
}

/**
 *
 */
PhotoGalleryWindow.prototype.open = function() {
	this.window.open();
}

exports.PhotoGalleryWindow = PhotoGalleryWindow;
