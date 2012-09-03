PhotoGalleryWindow = function(options) {
	var that = this;

	initializeWindow.call(that);
	return this;
}

function initializeWindow() {
	
}


W.Gallery = function(photos, imageNumber, fullscreen, hasPath) {

  var self = {};
  fullscreen = fullscreen || false;
  imageNumber = imageNumber || 0;
  var count = UI.Label({
    text : (imageNumber + 1) + ' / ' + photos.length,
    width : 75,
    textAlign : 'center'
  });

  var flex = UI.Button({
    systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
  });
  var buttonBack = UI.Button({
    image : 'assets/images/toolbar-left-arrow.png',
    enabled : (imageNumber == 0) ? false : true
  });
  var buttonFwd = UI.Button({
    image : 'assets/images/toolbar-right-arrow.png',
    enabled : (imageNumber == photos.length - 1) ? false : true
  });

  var win = UI.Win({
    barColor : '#222',
    toolbar : fullscreen ? null : [flex, buttonBack, count, buttonFwd, flex]
  });

  var flagButton = UI.Button({
    title : 'Flag'
  });

  if (!fullscreen) {
    win.rightNavButton = flagButton;
  }

  var mainView = Ti.UI.createScrollableView({
    top : 0,
    currentPage : imageNumber,
    bottom : 0,
    right : 0,
    left : 0
  });
  var data = [];
  var scrollView;

  function doupleTapZoom(a) {
    var x = 0;
    a.addEventListener('doubletap', function() {
      switch(x) {
        case 0:
          a.zoomScale = 2;
          x = 1;
          break;
        case 1:
          a.zoomScale = a.minZoomScale;
          x = 0;
          break;
      }

    });
  }

  for (var i = 0; i < photos.length; i++) {
    scrollView = UI.Scroll({
      contentHeight : Ti.UI.FILL,
      width : Ti.UI.FILL,
      height : Ti.UI.FILL
    });

    var img;

    if (hasPath) {
      var path = Props.files_domain + photos[i];
      path = path.replace('/files/', '/files/imagecache/profile-large/');
      img = UI.Image({
        image : path,
        defaultImage : ' ',
        nid : undefined
      });
    } else {
      var path = Props.files_domain + photos[i].files_node_data_field_photo_file_filepath;
      path = path.replace('/files/', '/files/imagecache/profile-large/');

      // Determine if this photos is not iPhone safe or pending.
      var iPhoneSafe = photos[i].node_data_field_photo_status_field_photo_safe_value || 0;
      var photoStatus = photos[i].node_data_field_photo_status_field_photo_status_value || null;
      // If the status value is less than 100, the photo is pending.
      if (photoStatus == null || photoStatus < 90) {
        path = 'assets/pendingnew.png';
      }
      // If the photo is not iphone-safe, display a "no photo" thumbnail instead.
      else if (iPhoneSafe == 0) {
        path = 'assets/no_photos.png';
      }

      img = UI.Image({
        image : fullscreen ? photos[i] : path,
        defaultImage : ' ',
        nid : photos[i].nid
      });
    }

    scrollView.add(img);
    scrollView.image = img;
    scrollView.maxZoomScale = 2;
    scrollView.minZoomScale = 1;
    doupleTapZoom(scrollView);
    data[i] = scrollView;
  }

  scrollView = null;
  mainView.setViews(data);

  if (data.length == 1) {
    buttonFwd.setEnabled(false);
  }

  win.addEventListener('close', function() {
    win.showNavBar();
  });


  buttonBack.addEventListener('click', function() {
    mainView.scrollToView(imageNumber - 1);
  });
  buttonFwd.addEventListener('click', function() {
    mainView.scrollToView(imageNumber + 1);
  });

  mainView.addEventListener('scroll', function(e) {
    var currentPage = mainView.currentPage || 0;
    count.text = currentPage + 1 + ' / ' + photos.length;
    if (currentPage == 0) {
      buttonBack.setEnabled(false);
    } else {
      buttonBack.setEnabled(true);
    }

    if (currentPage == data.length - 1) {
      buttonFwd.setEnabled(false);
    } else {
      buttonFwd.setEnabled(true);
    }

    if (imageNumber == currentPage) {
      return;
    }

    for (var i = 0; i < data.length; i++) {
      data[i].setZoomScale(data[i].minZoomScale);
    }

    imageNumber = currentPage;
  });


  win.add(mainView);

  self.win = win;
  self.open = function() {
    self.win.open();
  }
  return self;
};



exports.PhotoGalleryWindow = PhotoGalleryWindow;