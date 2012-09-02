DetailNewsWindow = function(options) {
	var that = this;
	that.title = options.title;
	that.url = options.url;
	that.controller = options.controller;

	createWindow.call(that);

	return this;
}
function createWindow() {
	var that = this;

	Ti.API.info(that.title + " " + that.url);

	var _titleLabel = Ti.UI.createLabel({
		text : that.title + ' Stories',
		top : 5,
		width : 'auto',
		height : '100%',
		color : '#fff',
		minimumFontSize : '11px',
		font : {
			fontWeight : 'bold',
			color : '#fff',
			fontSize : '14px',
		}
	});

	var newWindow = Ti.UI.createWindow({
		titleControl : _titleLabel,
		backgroundColor : '#fff',
		barColor : '#333399',
		navBarHidden : false,
		rss_url : that.url,
		backButtonTitle : "Back"
	});

	// if the user clicks this button then this item is added to favorites
	var favoriteButton = Titanium.UI.createButton({
		// title:'Favorite',
		image : 'icons/28-star.png',
		style : Titanium.UI.iPhone.SystemButtonStyle.EDIT
	});

	if (Titanium.Platform.name == 'iPhone OS') {
		newWindow.setRightNavButton(favoriteButton);
	}
	//
	// add the item to favs list
	//
	favoriteButton.addEventListener('click', function(e) {
		Ti.API.info(newWindow.title + ", link-> " + newWindow.rss_url);
		alert(newWindow.title + ' Added to Favorites');
		var favsArray = Titanium.App.Properties.getList("favorites");
		if (favsArray == null || favsArray == undefined) {
			favsArray = [];
		}
		Ti.API.info("before - favsArray " + favsArray);

		favsArray.push(newWindow.title + "|" + newWindow.rss_url);

		Ti.API.info("after - favsArray " + favsArray);
		Titanium.App.Properties.setList("favorites", favsArray);

	});
	//
	// create table to list rss items
	//
	var aTbl = Ti.UI.createTableView({
		backgroundColor : '#fff',
		data : [{
			title : "Searching...",
			width : '100%'
		}]
	});

	if (Titanium.Platform.name == 'iPhone OS') {
		aTbl.style = Ti.UI.iPhone.TableViewStyle.PLAIN;
	}

	// event to listen for reloadingt he tables data
	aTbl.addEventListener('reloadData', function(data) {
		Ti.API.info("reload data " + data.rowData);
		aTbl.setData(data.rowData);
	});
	// event to listebn for a click on a row in the list
	aTbl.addEventListener('click', function(e) {
		var w;

		if (Titanium.Platform.name == 'iPhone OS') {
			var _titleLabel = Ti.UI.createLabel({
				text : e.row.our_title,
				top : 5,
				width : 'auto',
				height : '100%',
				color : '#fff',
				font : {
					fontWeight : 'bold',
					fontSize : '11px',
					color : '#fff'
				}
			});

			w = Ti.UI.createWindow({
				titleControl : _titleLabel,
				barColor : '#333399'
			});
		} else {
			w = Ti.UI.createWindow({
				title : e.row.our_title
			});
		}

		// if this is a what's new... then get the link to the
		// actual
		// content since that is all that is in the feed

		Ti.API.info("row html \n" + e.row.description_html);
		var wb;
		var hstr = "<head><meta name = 'viewport' content = 'initial-scale = 2.0, user-scalable = no, width = 320'/></head>";
		if (e.row.is_whats_new) {
			var html = e.row.description_html;
			var real_link = html.match(/href="(.*)">/)[1];
			wb = Ti.UI.createWebView({
				width : '100%',
				height : '100%',
				scalesPageToFit : true
			});
			wb.url = real_link;
		} else {
			wb = Ti.UI.createWebView({
				width : '100%',
				height : '100%',
				scalesPageToFit : false,
				html : "<html>" + hstr + e.row.description_html + "</html>"
			});
		}
		// i.match(/href="(.*)">/)[1]

		Ti.API.info("row html \n" + e.row.description_html);
		Ti.API.info("whats new? " + e.row.is_whats_new);
		// i.match(/href="(.*)">/)[1]
		w.add(wb);
		w.data = e.row;

		if (Titanium.Platform.name == 'iPhone OS') {
			// listen for click to share message
			// create button
			var shareBtn = Titanium.UI.createButton({
				// image:'icons/share-icon-24x24.png',
				title : 'Share',
				style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});

			// add the event listener
			shareBtn.addEventListener('click', function(e) {
				Ti.include('sharing.js');
				Sharing.displayinformation(w.data, w);
			});
			// create the close button
			var b = Titanium.UI.createButton({
				title : 'Close',
				style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			w.setRightNavButton(shareBtn);
			w.setLeftNavButton(b);

			// listen for click to close window
			b.addEventListener('click', function() {
				w.close();
			});
			//
			//
			// IPHONE ADS
			//

			iads = Ti.UI.iOS.createAdView({
				width : 'auto',
				height : 'auto',
				bottom : 0,
				borderColor : '#000000',
				backgroundColor : '#000000'
			});

			t1 = Titanium.UI.createAnimation({
				bottom : 0,
				duration : 750
			});

			iads.addEventListener('click', function(event) {
				Ti.API.info('add clicked ' + event);
			});
			iads.fireEvent('click', {});

			// w.add(iads);

			w.open({
				modal : true
			});
		} else {
			Ti.API.info('creating menu');
			/*
			 * var menu =
			 * Titanium.UI.Android.OptionMenu.createMenu(); var
			 * shareMenu =
			 * Titanium.UI.Android.OptionMenu.createMenuItem({title:'Share
			 * Item'}); shareMenu.addEventListener('click',
			 * function() { Sharing.displayinformation( w.data );
			 * }); menu.add([shareMenu]);
			 * Titanium.UI.Android.OptionMenu.setMenu(menu);
			 */
			w.open();
		}
	});
	aTbl.window = newWindow;
	myApp.processRSS(that.url, aTbl);
	newWindow.add(aTbl);
}

exports.DetailNewsWindow = DetailNewsWindow; 