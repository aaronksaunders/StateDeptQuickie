var AC = require("/Controllers/ApplicationController").ApplicationController;
new AC().run();

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
