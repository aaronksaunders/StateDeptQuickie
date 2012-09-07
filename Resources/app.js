Ti.include('/services/analytics.js');

var GoogleAnalytics = {};
/**
 * Google Analytics Integration
 */
(function() {
	var analytics = new Analytics(/*'UA-18234791-4'*/'UA-34647939-1');
	analytics.start(10);

	GoogleAnalytics = {
		trackEvent : function(params) {
			//analytics.trackEvent(params.category, params.action, null, -1);
			// ** Log.Info('GoogleAnalytics.trackEvent('+params.category+','+params.action+')');
			analytics.trackPageview('/iphone/' + params.category + "-" + params.action + (params.url ? ("/" + escape(params.url)) : "" ));
		},
		trackPageview : function(params) {
			analytics.trackPageview('/Android' + params.page);
			// ** Log.Info('GoogleAnalytics.trackPageview(/iPhone' + params.page+')');
		},
		reset : function() {
			analytics.reset();
			// ** Log.Info('GoogleAnalytics.reset()');
		}
	};
})();

var AC = require("/Controllers/ApplicationController").ApplicationController;
new AC().run();

var ActivityWindow = require('/Windows/ActivityWindow').ActivityWindow;
var activityWindow = new ActivityWindow({
	msg : "Loading Feeds...",
	timeout : 5000,
	color : '#333399'
});
activityWindow.show();

//Event
GoogleAnalytics.trackEvent({
	category : 'StartApp',
	action : 'StartApp'
});

Ti.App.addEventListener('resume', function(e) {
	GoogleAnalytics.trackEvent({
		category : 'StartApp',
		action : 'ResumeApp'
	});
});

Ti.App.addEventListener('resumed', function(e) {
	GoogleAnalytics.trackEvent({
		category : 'StartApp',
		action : 'ResumedApp'
	});

});

Ti.App.addEventListener('pause', function(e) {
	GoogleAnalytics.trackEvent({
		category : 'StopApp',
		action : 'PasuedApp'
	});

});

/**
 * this event is used to get the number of messages for the feed url
 * that is passed in.
 */
Ti.App.addEventListener('updateTableViewCount', function(_data) {
	var xhr = Ti.Network.createHTTPClient();
	var _url = myApp.rowURLS[_data.index];
	xhr.open("GET", _url.replace(/\"/g, ""));
	xhr.onerror = function(e) {
		alert(e);
	};
	xhr.onload = function() {
		try {
			var doc = this.responseXML.documentElement;
			var items = doc.getElementsByTagName("item");
			var messageCount = 0;

			if (items != undefined) {
				messageCount = items.length;
			}

			// UPDATE THE ROW.. .children[1] = the section
			Ti.API.debug("messageCount " + messageCount);
			newsTable.data[0].rows[_data.index].children[1].title = messageCount + "";
			if (Titanium.Platform.name == 'iPhone OS') {
				myApp.newsWindow.progressBar.value = _data.index + 1;
			} else {
				myApp.progressDialog.setValue(_data.index + 1);
			}

			// clean up client
			xhr.abort();
			xhr = null;

			// get next count
			if ((_data.index + 1) != myApp.rowURLS.length) {
				Ti.App.fireEvent('updateTableViewCount', {
					index : _data.index + 1
				});
			} else {
				Ti.API.debug("done processing feed counts");
				if (Titanium.Platform.name == 'iPhone OS') {
					myApp.newsWindow.progressBar.hide();
					myApp.newsWindow.progressBar = null;
					myApp.newsWindow.setTitleControl(null);
				} else {
					myApp.progressDialog.hide();
					myApp.progressDialog = null;
				}
			}
		} catch(E) {
			alert(E);
		}

	};
	xhr.send();
});
/**
 *
 */
