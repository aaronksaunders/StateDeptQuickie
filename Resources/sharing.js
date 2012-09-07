var Sharing = {};

/**
 *
 */
Sharing.displayinformation = function(_messageData, w) {
	Sharing.parentWindow = w;
	var share_object_type = (_messageData.video_twitter_url && _messageData.video_twitter_url.indexOf('.jpg') !== -1 ) ? "image" : "video";
	var dialog = Titanium.UI.createOptionDialog({
		title : 'Share this Posting ' + _messageData.our_title,
		options : ['Email', 'Facebook', 'Twitter', 'Cancel'],
		destructive : 3
	});

	dialog.addEventListener('click', function(e) {
		switch (e.index) {
			case 0:
				// Email message

				if (_messageData.url) {
					Sharing.setupEmail(_messageData.our_title, _messageData.url);
					GoogleAnalytics.trackEvent({
						category : 'Sharing',
						action : 'email_news_item'
					});
				} else {
					Sharing.setupEmail(_messageData.our_title, _messageData.video_twitter_url, _messageData.video_thumb);
					GoogleAnalytics.trackEvent({
						category : 'Sharing',
						action : 'email_' + share_object_type + '_item'
					});
				}
				break;
			case 1:
				// Facebook message
				if (_messageData.url) {
					Sharing.setupFacebook(_messageData.our_title, _messageData.url);
					GoogleAnalytics.trackEvent({
						category : 'Sharing',
						action : 'facebook_news_item',
						url : _messageData.url
					});
				} else {
					Sharing.setupFacebook(_messageData.our_title, _messageData.video_twitter_url, _messageData.video_thumb);
					GoogleAnalytics.trackEvent({
						category : 'Sharing',
						action : 'facebook_' + share_object_type + '_item',
						url : _messageData.video_twitter_url
					});
				}
				break;
			case 2:
				//tweet message
				if (_messageData.url) {
					Sharing.setupTwitter(_messageData.our_title + " " + _messageData.url);
					GoogleAnalytics.trackEvent({
						category : 'Sharing',
						action : 'twitter_news_item',
						url : _messageData.url
					});
				} else {
					Sharing.setupTwitter(_messageData.our_title + " " + _messageData.video_twitter_url);
					GoogleAnalytics.trackEvent({
						category : 'Sharing',
						action : 'twitter_' + share_object_type + '_item',
						url : _messageData.video_twitter_url
					});
				}
				break;
			default:
				break;
		}
	});
	dialog.show();
};
/**
 * sets up twitter using oAuth
 */
Sharing.setupEmail = function(_title, _url, _thumb) {
	var emailDialog = Titanium.UI.createEmailDialog();
	Ti.API.error(emailDialog.isSupported());
	if (emailDialog.isSupported() == false) {
		alert('you need to setup your e-mail first');
	}
	emailDialog.setSubject('Thought You Would Find This Interesting');
	/*
	 emailDialog.setToRecipients(['foo@yahoo.com']);
	 emailDialog.setCcRecipients(['bar@yahoo.com']);
	 emailDialog.setBccRecipients(['blah@yahoo.com']);
	 */
	if (Ti.Platform.name == 'iPhone OS') {
		var st1 = '<b>This Message was shared from State Department Feed Applictaion</b><br><br>';
		//if (_thumb) {
		//	st1 = st1 + '<image src=' + _thumb + '/><br><br>';
		//}
		st1 = st1 + '<a href=' + _url + '>' + _title + '</a><br><br>';
		emailDialog.setMessageBody(st1);
		emailDialog.setHtml(true);
		emailDialog.setBarColor('#336699');
	} else {
		emailDialog.setMessageBody('Appcelerator Titanium Rocks!');
	}

	emailDialog.addEventListener('complete', function(e) {
		if (e.result == emailDialog.SENT) {
			if (Ti.Platform.osname != 'android') {
				// android doesn't give us useful result codes.
				// it anyway shows a toast.
				alert("message was sent");
			}
		} else {
			alert("message was not sent");
			Ti.API.error("message was not sent. result = " + e.result);
		}
	});
	emailDialog.open();
}
/**
 * sets up twitter using oAuth
 */
Sharing.setupTwitter = function(_message) {

	// This code works great using social.js
	var social = require('/lib/social');

	var twitter = social.create({
		site : 'twitter', // <-- this example is for Twitter. I'll expand this to other sites in the future.
		consumerKey : 'pmuuM6Je1p34gjChc2g1HQ', // <--- you'll want to replace this
		consumerSecret : 'WStABUe062TyewnfksSXSGLvZn40sniHFqrWgPktOkU' // <--- and this with your own keys!
	});

	// Dialog to show response
	var alertDialog = Titanium.UI.createAlertDialog({
		title : 'Twitter',
		buttonNames : ['OK']
	});

	// send the actual messages
	function doIt() {
		twitter.share({
			message : _message,
			success : function() {
				alertDialog.message = 'Post tweeted succesfully.';
				alertDialog.show();
			},
			error : function(error) {
				alertDialog.message = 'Oh no! ' + error;
				alertDialog.show();
			}
		});
	}

	if (!twitter.isAuthorized()) {
		Ti.API.info('Not authorized')
		twitter.authorize(function() {
			if (!twitter.isAuthorized()) {
				alert('Error authorizing with twitter');
				return;
			} else {
				doIt();
			}
		});
	} else {
		Ti.API.info('Yes authorized');
		doIt();
	}
	return;
};
/**
 *
 */
Sharing.setupFacebook = function(_title, _url, _thumb) {

	Ti.API.debug(" trying to activate");
	Ti.Facebook.appid = '179710415380465';
	Ti.Facebook.permissions = ['publish_stream', 'read_stream'];

	// Dialog to show response
	var alertDialog = Titanium.UI.createAlertDialog({
		title : 'Facebook',
		buttonNames : ['OK']
	});

	function doIt() {

		var infoType = "Web Posting";
		if (_thumb) {
			infoType = (_thumb.indexOf('.jpg') === -1 ) ? "Flickr Image" : "YouTube Video";
		}
		var data = {
			name : _title,
			link : _url,
			message : infoType + " from United States Department of State RSS Feed",
			picture : _thumb
		};

		Titanium.Facebook.requestWithGraphPath('me/feed', data, "POST", function(r) {
			Titanium.API.info("received status response = " + JSON.stringify(r));
			if (r.success) {
				Ti.UI.createAlertDialog({
					title : 'Facebook',
					message : 'Your status was published'
				}).show();
			} else {
				Ti.UI.createAlertDialog({
					title : 'Facebook',
					message : 'Error ' + r.error
				}).show();
			}
		});
	}


	Titanium.Facebook.addEventListener('login', function(e) {
		if (e.success) {
			//TODO Save credentials
			doIt(true);
		} else {
			Ti.UI.createAlertDialog({
				title : 'Facebook',
				message : 'Error Authenticating'
			}).show();
		}
	});

	Titanium.Facebook.forceDialogAuth = true;

	if (Ti.Facebook.loggedIn !== true) {
		Ti.Facebook.authorize()
	} else {
		doIt(true);
	}

};
/**
 * this is executed if the user is not logged into facebook yet
 */
function showLoginWindow(_message, fbButton, data) {
	var popup_view = Titanium.UI.createView({
		width : 320,
		backgroundColor : '#999999',
		borderColor : '#333333',
		left : 0,
		bottom : -240,
		height : 140,
	});

	// you could then add any interface elements, labels, etc to this.
	var popup_label = Titanium.UI.createLabel({
		color : '#333399',
		text : 'Please Login To Facebook?',
		top : 25,
		left : 30,
		//right:10,
		height : 20,
		width : 320,
		textAlign : 'left',
		font : {
			fontSize : 18,
			fontFamily : 'Helvetica Neue',
			fontWeight : 'bold'
		}
	});

	fbButton.addEventListener('login', function(ev) {
		Titanium.Facebook.publishStream("Edit Before Posting", data, null, function(r) {
			Titanium.API.info("received status response = " + JSON.stringify(r));
			if (r.success) {
				Ti.UI.createAlertDialog({
					title : 'Facebook',
					message : 'Your status was published'
				}).show();
			} else {
				Ti.UI.createAlertDialog({
					title : 'Facebook',
					message : 'Error ' + r.error
				}).show();
			}
		});
		Sharing.parentWindow.opacity = 1.0;
		cancelBtn.fireEvent('click', {});
	});
	fbButton.addEventListener('cancel', function(ev) {
		cancelBtn.fireEvent('click', {});
	});
	//Sharing.parentWindow.opacity = 0.5;
	popup_view.add(popup_label);
	popup_view.add(fbButton);
	var cancelBtn = Ti.UI.createButton({
		title : 'Cancel',
		width : 90,
		height : 30,
		top : 90,
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		}
	});
	var popup_animation = Titanium.UI.createAnimation();
	// this will set it in to view
	popup_animation.bottom = 0;
	// ... in half a second
	popup_animation.duration = 500;

	cancelBtn.addEventListener('click', function(e) {
		Sharing.parentWindow.opacity = 1.0;
		if (popup_view) {
			// this will set it in to view
			popup_animation.bottom = -240;
			// ... in half a second
			popup_animation.duration = 500;
			popup_view.animate(popup_animation);
			popup_view = null;
			fbButton.hide();
			fbButton = null;
		}
	});
	popup_view.add(cancelBtn);

	// add it when you need to (it will still be 'off screen')
	Sharing.parentWindow.add(popup_view);

	// then when you need it to 'appear' / pop up ... use:
	popup_view.animate(popup_animation);

}
