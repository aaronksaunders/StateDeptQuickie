/**
 *
 *  loop through the table and add counts to all of the topics, the
 * first item in the table is the section, then comes the rows.
 *
 * this method will loop through all of the feed topics and get the
 * number of ite,s available
 *
 */
var Utils = {};
Utils.getRSSTopicCounts = function(_tableView) {
	Ti.API.info('in getRSSTopicCounts ' + _tableView.data[0].rows.length);

	// create the progress bar
	if(Titanium.Platform.name == 'iPhone OS') {
		var progressBar = Titanium.UI.createProgressBar({
			width : 100,
			min : 0,
			max : _tableView.data[0].rows.length,
			value : 0,
			color : '#fff',
			message : 'Updating Message Counts',
			font : {
				fontSize : 14,
				fontWeight : 'bold'
			},
			style : Titanium.UI.iPhone.ProgressBarStyle.PLAIN
		});

		myApp.newsWindow.setTitleControl(progressBar);
		myApp.newsWindow.progressBar = progressBar;
		progressBar.show();
	} else {
		myApp.progressDialog = Titanium.UI.createActivityIndicator({
			location : Titanium.UI.ActivityIndicator.DIALOG,
			type : Titanium.UI.ActivityIndicator.DETERMINANT,
			message : 'Updating RSS Feed Counts',
			min : 0,
			max : _tableView.data[0].rows.length,
			value : 0
		});

		myApp.progressDialog.show();
	}

	var theRows = _tableView.data[0].rows;
	myApp.rowURLS = [];
	for(var i = 0; i < theRows.length; i++) {
		myApp.rowURLS[i] = theRows[i].url;
	};
	Ti.App.fireEvent('updateTableViewCount', {
		index : 0
	});
};


Utils.processRSS = function(_feedURL, _tableView) {
	// create table view data object
	var data = [];

	Ti.API.info(" " + _feedURL);

	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", _feedURL.replace(/\"/g, ""));
	xhr.onerror = function(e) {
		alert(e);
	};
	xhr.onload = function() {
		try {
			var doc = this.responseXML.documentElement;
			var items = doc.getElementsByTagName("item");

			if(items == undefined || items.length == 0) {
				_tableView.fireEvent('reloadData', {
					rowData : [{
						title : "No Messages Found"
					}]
				});
			} else {
				var x = 0;
				var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;

				_tableView.window.title = doctitle;

				for(var c = 0; c < items.length; c++) {
					var item = items.item(c);

					Ti.API.info(" " + item);

					var title = item.getElementsByTagName("title").item(0).text;

					//pubDate
					var pubDate = item.getElementsByTagName("pubDate").item(0).text;

					var row = Ti.UI.createTableViewRow({
						height : 'auto',
						backgroundColor : '#fff',
						className : "@rssDetail"
					});

					//
					var rowView;
					if(Titanium.Platform.name == 'iPhone OS') {
						rowView = Ti.UI.createView({
							height : Ti.UI.SIZE,
							width : '100%',
							backgroundColor : '#fff',
							layout : 'vertical'
						});
					} else {
						rowView = Ti.UI.createView({
							layout : 'vertical',
							backgroundColor : '#fff',
							height : Ti.UI.SIZE,
							width : '100%',
						});
					}
					var title_label = Ti.UI.createLabel({
						text : title,
						height : 'auto',
						width : '100%',
						left : 5,
						textAlign : "left",
						top : 5,
						color : '#333399'
					});
					var pubDate_label = Ti.UI.createLabel({
						text : pubDate,
						height : 25,
						width : 'auto',
						left : 5,
						color : '#777',
						textAlign : "left",
						font : {
							fontSize : 11
						},
						color : '#333399'
					});

					rowView.add(title_label);
					rowView.add(pubDate_label);
					row.add(rowView);

					data[x++] = row;
					row.url = item.getElementsByTagName("link").item(0).text;
					row.description_html = item.getElementsByTagName("description").item(0).text;
					row.our_title = title;
					row.is_whats_new = (row.description_html.indexOf("bullet_blue.gif") != -1 );

				}
				_tableView.fireEvent('reloadData', {
					rowData : data
				});
			}
		} catch(E) {
			alert(E);
		}

	};
	xhr.send();
};


exports.Utils = Utils;