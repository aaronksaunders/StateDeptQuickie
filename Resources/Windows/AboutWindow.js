AboutWindow = function(options) {
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
		title : 'About',
		backgroundColor : '#fff',
		barColor : '#333399',
		layout : 'vertical'
	});

	var iv = Ti.UI.createImageView({
		top : -30,
		image : '/icons/logo_260X200.jpg',
	});

	var l = Ti.UI.createLabel({
		text : 'This is a sample application built by Clearly Innovative demonstrating Facebook, Twitter, Flickr, YouTube and RSS feed integration.\nThis application was built to demonstrate capabilities of Appcelerator Titanium and Clearly Innovative Inc.\n\n Please contact us for additional information',
		font : {
			fontSize : 10
		},
		textAlign : 'center'
	});

	var locationButton = Ti.UI.createButton({
		top : 10,
		height : '30dp',
		title : 'Our Location'
	});

	locationButton.addEventListener('click', function(e) {
		Ti.Platform.openURL('http://bit.ly/OkJyTU')
	});

	var emailButton = Ti.UI.createButton({
		top : 10,
		height : '30dp',
		title : 'Email Us'
	});

	emailButton.addEventListener('click', function(e) {
		var emailDialog = Titanium.UI.createEmailDialog({
			subject : 'Re:Info on Clearly Innovative Inc',
			html : true,
			toRecipients : ['info@clearlyinnovative.com'],
			messageBody : 'From State Department Application'
		});
		if (!emailDialog.isSupported()) {
			Ti.UI.createAlertDialog({
				title : 'Clearly Innovative Inc',
				message : 'Email not available'
			}).show();
			return;
		}

		emailDialog.addEventListener('complete', function(e) {
			if (e.result == emailDialog.SENT) {
				if (Ti.Platform.osname != 'android') {
					// android doesn't give us useful result codes.
					// it anyway shows a toast.
					alert('message was sent');
				}

			} else {
				alert('message was not sent');
			}
		});
		emailDialog.open();

	});
	that.window.add(iv);
	that.window.add(l);
	that.window.add(locationButton);
	that.window.add(emailButton);
}

exports.AboutWindow = AboutWindow;
