NewsWindow = function(options) {
	var that = this;
	that.tabGroup = options.tabGroup;

	//
	// create base UI tab and root window
	//
	that.window = Ti.UI.createWindow({
		title : 'News Stories',
		backgroundColor : '#fff',
		barColor : '#333399',
		navBarHidden : false
	});
	that.table = this.createNewsTable();
	that.window.add(that.table);

	// controller actions

	// add event listener
	that.table.addEventListener('click', function(e) {
		var DNW = require("/Windows/DetailNewsWindow").DetailNewsWindow;

		var detailListWin = new DNW({
			"title" : e.row.our_title,
			"url" : e.row.url
		});
		if (Titanium.Platform.name == 'iPhone OS') {
			that.tabGroup.activeTab.open(detailListWin.window);
		} else {
			detailListWin.window.open();
		}
	});
	

	
	return this;
}
/**
 *
 */
NewsWindow.prototype.createNewsTable = function() {
	var that = this;
	
	// get default list of rss feeds into an array
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/news_feed_list.txt");
	Ti.API.info(file);
	var listArray = file.read().text.split("\n");
	var rArray = [];
	
	// look through array and get new stories
	for (var i = 0; i < listArray.length; i++) {
		var rdata = listArray[i].split("=");
		var r = Ti.UI.createTableViewRow({
			our_title : rdata[0],
			url : rdata[1],
			// backgroundColor:'#ADD8E6',
			hasChild : (Titanium.Platform.name == 'iPhone OS'),
			height : 'auto',
			// width:'100%',
			className : "@rssList",
			font : {
				fontSize : '3px'
			}
		});

		var label = Ti.UI.createLabel({
			text : rdata[0],
			height : 'auto',
			color : '#333399',
			left : 5,
			top : 2,
			width : 250,
			bottom : 10
		});

		// @TODO button does not show up correctly on android
		var fontStyleStr;
		if (Titanium.Platform.name == 'iPhone OS') {
			fontStyleStr = {
				fontSize : 14,
				fontWeight : 'bold',
				color : '#333399'
			};
		} else {
			fontStyleStr = {
				fontSize : 10,
				fontWeight : 'bold'
			};
		}
		var countLabel = Titanium.UI.createButton({
			// backgroundColor:'#ADD8E6',
			title : '10',
			font : fontStyleStr,
			height : 25,
			width : 30,
			left : 260,
			borderRadius : 5,
			backgroungImage : 'none',
			touchEnabled : false
		});

		r.add(label);
		// next release r.add(countLabel);
		rArray.push(r);
	};
	
	// create table for display
	that.table = Ti.UI.createTableView({
		color : '#333399',
		data : rArray
	});

	// clean up
	listArray = null;
	rArray = null;

	return that.table;
};

/**
 *
 */
NewsWindow.prototype.createNewsDetailList = function(_title, _url) {

	return newWindow;
};

exports.NewsWindow = NewsWindow; 