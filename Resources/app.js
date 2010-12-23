// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.include('sharing.js');
Titanium.UI.setBackgroundColor('#fff');

//
//
// IPHONE ADS
//
if ( Titanium.Platform.name == 'iPhone OS') {
    Ti.API.info("including ad");
    iads = Ti.UI.iOS.createAdView({
        width: 'auto',
        height: 'auto',
        bottom: -100,
        borderColor: '#000000',
        backgroundColor: '#000000'});

    t1 = Titanium.UI.createAnimation({bottom:0, duration:750});
    //baseView.add(iads);
    iads.addEventListener('load', function() {
        iads.animate(t1);
    });
}

var myApp = {};
/**
 *
 */
myApp.createNewsTable = function() {
    var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/news_feed_list.txt");
    Ti.API.info(file);
    var listArray = file.read().text.split("\n");
    var rArray = [];
    for (var i=0; i < listArray.length; i++) {
        var rdata = listArray[i].split("=");
        var r = Ti.UI.createTableViewRow({
            our_title:rdata[0],
            url:rdata[1],
            //backgroundColor:'#ADD8E6',
            hasChild:( Titanium.Platform.name == 'iPhone OS'),
            height:'auto',
            //width:'100%',
            className:"@rssList",
            font: { fontSize:'3px' }
        });

        var label = Ti.UI.createLabel({
            text:rdata[0],
            height:'auto',
            color:'#333399',
            left:5,
            top:2,
            width: 250,
            bottom:10
        });

        // @TODO button does not show up correctly on android
        var fontStyleStr;
        if ( Titanium.Platform.name == 'iPhone OS') {
            fontStyleStr = {fontSize:14,fontWeight:'bold', color:'#333399'};
        } else {
            fontStyleStr = {fontSize:10,fontWeight:'bold'};
        }
        var countLabel = Titanium.UI.createButton({
            //backgroundColor:'#ADD8E6',
            title:'10',
            font:fontStyleStr,
            height:25,
            width:30,
            left:260,
            borderRadius:5,
            backgroungImage: 'none',
            touchEnabled: false
        });

        r.add(label);
        // next release r.add(countLabel);
        rArray.push(r);
    };
    var tableView =  Ti.UI.createTableView({
        color:'#333399',
        data:rArray
    });
    tableView.addEventListener('click', function(e) {
        var detailListWin = myApp.createNewsDetailList(e.row.our_title, e.row.url);
        if ( Titanium.Platform.name == 'iPhone OS') {
            newsNavGroup.open(detailListWin);
        } else {
            detailListWin.open();
        }
    });
    return tableView;
};
/**
 *
 */
myApp.createNewsDetailList = function(_title, _url) {
    Ti.API.info(_title+" "+_url);
    var newWindow = Ti.UI.createWindow({
        title:_title+' Stories',
        backgroundColor:'#111',
        barColor: '#333399',
        navBarHidden: false,
        rss_url: _url
    });

    // if the user clicks this button then this item is added to favorites
    var favoriteButton = Titanium.UI.createButton({
        //title:'Favorite',
        image:'icons/28-star.png',
        style:Titanium.UI.iPhone.SystemButtonStyle.EDIT
    });

    if ( Titanium.Platform.name == 'iPhone OS') {
		newWindow.setRightNavButton(favoriteButton);
	}
    //
    // add the item to favs list
    //
    favoriteButton.addEventListener('click', function(e) {
        Ti.API.info( newWindow.title + ", link-> " + newWindow.rss_url);
        alert(newWindow.title + ' Added to Favorites');
        var favsArray = Titanium.App.Properties.getList("favorites");
        if ( favsArray == null || favsArray == undefined) {
            favsArray = [];
        }
        Ti.API.info("before - favsArray " + favsArray );

        favsArray.push(newWindow.title + "|" + newWindow.rss_url);

        Ti.API.info("after - favsArray " +  favsArray);
        Titanium.App.Properties.setList("favorites", favsArray);

    });
    //
    // create table to list rss items
    //
    var aTbl =Ti.UI.createTableView({
        //backgroundColor:'#ADD8E6',
        data:[{title:"Searching...", width:'100%'}],
        style: Ti.UI.iPhone.TableViewStyle.PLAIN
    });

    // event to listen for reloadingt he tables data
    aTbl.addEventListener('reloadData', function(data) {
        Ti.API.info("reload data " + data.rowData);
        aTbl.setData(data.rowData);
    });
    // event to listebn for a click on a row in the list
    aTbl.addEventListener('click', function(e) {
        var w ;

        if ( Titanium.Platform.name == 'iPhone OS') {
            var _titleLabel = Ti.UI.createLabel({
                text : e.row.our_title,
                top : 5,
                width : 'auto',
                height : '100%',
                color:'#fff',
                font : {
                    fontWeight : 'bold',
                    fontSize : '11px',
                    color:'#fff'
                }
            });

            w = Ti.UI.createWindow({
                titleControl:_titleLabel,
                barColor: '#333399'
            });
        } else {
            w = Ti.UI.createWindow({
                title : e.row.our_title
            });
        }

        // if this is a what's new... then get the link to the actual
        // content since that is all that is in the feed

        Ti.API.info("row html \n" + e.row.description_html);
        var wb;
        if (e.row.is_whats_new) {
            var html = e.row.description_html;
            var real_link = html.match(/href="(.*)">/)[1];
            wb = Ti.UI.createWebView({
                bottom:50 });
            wb.url = real_link;
        } else {
            wb = Ti.UI.createWebView({
                bottom:50,
                html:e.row.description_html
            });
        }
        // i.match(/href="(.*)">/)[1]

        Ti.API.info("row html \n" + e.row.description_html);
        Ti.API.info("whats new? " + e.row.is_whats_new);
        // i.match(/href="(.*)">/)[1]
        w.add(wb);
        w.data = e.row;

        if ( Titanium.Platform.name == 'iPhone OS') {
            // listen for click to share message
            // create button
            var shareBtn = Titanium.UI.createButton({
                //image:'icons/share-icon-24x24.png',
                title:'Share',
                style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
            });

            // add the event listener
            shareBtn.addEventListener('click', function(e) {
                Ti.include('sharing.js');
                Sharing.displayinformation( w.data, w );
            });
            
            // create the close button
            var b = Titanium.UI.createButton({
                title:'Close',
                style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
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
                width: 'auto',
                height: 'auto',
                bottom: 0,
                borderColor: '#000000',
                backgroundColor: '#000000'});

            t1 = Titanium.UI.createAnimation({bottom:0, duration:750});

            //iads.addEventListener('load', function() {
            //     iads.animate(t1);
            //});
            w.add(iads);

            w.open({modal:true});
        } else {
            Ti.API.info('creating menu');
            /*var menu = Titanium.UI.Android.OptionMenu.createMenu();
            var shareMenu = Titanium.UI.Android.OptionMenu.createMenuItem({title:'Share Item'});
            shareMenu.addEventListener('click', function() {
                Sharing.displayinformation( w.data );
            });
            menu.add([shareMenu]);
            Titanium.UI.Android.OptionMenu.setMenu(menu);
            */
			w.open();
        }
    });
    aTbl.window = newWindow;
    myApp.processRSS(_url, aTbl);
    newWindow.add(aTbl);
    return newWindow;
};
/**
 *
 *  loop through the table and add counts to all of the topics, the
 * first item in the table is the section, then comes the rows.
 *
 * this method will loop through all of the feed topics and get the
 * number of ite,s available
 *
 */
myApp.getRSSTopicCounts = function(_tableView) {
    Ti.API.info('in getRSSTopicCounts ' + _tableView.data[0].rows.length);

    // create the progress bar
    if ( Titanium.Platform.name == 'iPhone OS') {
        var progressBar=Titanium.UI.createProgressBar({
            width:100,
            min:0,
            max:_tableView.data[0].rows.length,
            value:0,
            color:'#fff',
            message:'Updating Message Counts',
            font:{fontSize:14, fontWeight:'bold'},
            style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN
        });

        myApp.newsWindow.setTitleControl(progressBar);
        myApp.newsWindow.progressBar = progressBar;
        progressBar.show();
    } else {
        myApp.progressDialog = Titanium.UI.createActivityIndicator({
            location:Titanium.UI.ActivityIndicator.DIALOG,
            type:Titanium.UI.ActivityIndicator.DETERMINANT,
            message:'Updating RSS Feed Counts',
            min:0,
            max:_tableView.data[0].rows.length,
            value:0
        });

        myApp.progressDialog.show();
    }

    var theRows = _tableView.data[0].rows;
    myApp.rowURLS = [];
    for (var i=0; i < theRows.length; i++) {
        myApp.rowURLS[i] = theRows[i].url;
    };
    Ti.App.fireEvent('updateTableViewCount', { index:0 });
};
/**
 * this event is used to get the number of messages for the feed url
 * that is passed in.
 */
Ti.App.addEventListener('updateTableViewCount', function(_data) {
    var xhr = Ti.Network.createHTTPClient();
    var _url = myApp.rowURLS[_data.index];
    xhr.open("GET",_url.replace(/\"/g,""));
    xhr.onerror = function(e) {
        alert(e);
    };
    xhr.onload = function() {
        try {
            var doc = this.responseXML.documentElement;
            var items = doc.getElementsByTagName("item");
            var messageCount = 0;

            if (items != undefined ) {
                messageCount = items.length;
            }

            // UPDATE THE ROW.. .children[1] = the section
            Ti.API.debug("messageCount "+messageCount);
            newsTable.data[0].rows[_data.index].children[1].title = messageCount + "";
            if ( Titanium.Platform.name == 'iPhone OS') {
                myApp.newsWindow.progressBar.value = _data.index + 1;
            } else {
                myApp.progressDialog.setValue(_data.index + 1);
            }

            // clean up client
            xhr.abort();
            xhr = null;

            // get next count
            if ( (_data.index + 1) != myApp.rowURLS.length) {
                Ti.App.fireEvent('updateTableViewCount', { index:_data.index + 1 } );
            } else {
                Ti.API.debug("done processing feed counts");
                if ( Titanium.Platform.name == 'iPhone OS') {
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
myApp.processRSS = function(_feedURL, _tableView) {
    // create table view data object
    var data = [];

    Ti.API.info(" "+_feedURL);

    var xhr = Ti.Network.createHTTPClient();
    xhr.open("GET",_feedURL.replace(/\"/g,""));
    xhr.onerror = function(e) {
        alert(e);
    };
    xhr.onload = function() {
        try {
            var doc = this.responseXML.documentElement;
            var items = doc.getElementsByTagName("item");

            if (items == undefined || items.length == 0) {
                _tableView.fireEvent('reloadData', {rowData:[{title:"No Messages Found"}]});
            } else {
                var x = 0;
                var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;

                _tableView.window.title = doctitle;

                for (var c=0;c<items.length;c++) {
                    var item = items.item(c);

                    Ti.API.info(" "+item);

                    var title = item.getElementsByTagName("title").item(0).text;

                    //pubDate
                    var pubDate = item.getElementsByTagName("pubDate").item(0).text;

                    var row = Ti.UI.createTableViewRow({
                        height:'auto',
                        //backgroundColor:'#ADD8E6',
                        //width:'100%',
                        className:"@rssDetail"
                    });

                    //
                    var rowView;
                    if ( Titanium.Platform.name == 'iPhone OS') {
                        rowView = Ti.UI.createView({ height:'auto',width:'100%', layout:'vertical'});
                    } else {
                        rowView = Ti.UI.createView({layout:'vertical', width:'auto', height:'auto'});
                    }
                    var title_label = Ti.UI.createLabel({
                        text:title,
                        height:'auto',
                        width:'auto',
                        left:5,
                        textAlign: "left",
                        top:5,
                        color:'#333399'
                    });
                    var pubDate_label = Ti.UI.createLabel({
                        text:pubDate,
                        height:25,
                        width:'auto',
                        left:5,
                        color:'#777',
                        textAlign: "left",
                        font:{fontSize:11},
                        color:'#333399'
                    });

                    rowView.add(title_label);
                    rowView.add(pubDate_label);
                    row.add(rowView);

                    data[x++] = row;
                    row.url = item.getElementsByTagName("link").item(0).text;
                    row.description_html = item.getElementsByTagName("description").item(0).text;
                    row.our_title = title;
                    row.is_whats_new = ( row.description_html.indexOf("bullet_blue.gif") != -1 );

                }
                _tableView.fireEvent('reloadData', {rowData:data});
            }
        } catch(E) {
            alert(E);
        }

    };
    xhr.send();
};
// create tab group
var tabGroup = Titanium.UI.createTabGroup({ moreBarColor: '#333', backgroundColor: '#333'});
myApp.tabGroup = tabGroup;

//
// create base UI tab and root window
//

var newsWindow = Titanium.UI.createWindow({
    title:'News Stories',
    backgroundColor:'#fff',
    barColor: '#333399',
    navBarHidden: false
});
//

myApp.newsWindow = newsWindow;
var newsTable = myApp.createNewsTable();
newsWindow.add(newsTable);

var newsNavGroup = null;
var navBaseWindow = null;
if ( Titanium.Platform.name == 'iPhone OS') {
    newsNavGroup = Ti.UI.iPhone.createNavigationGroup({
        title:'News Stories NavGroup',
        backgroundColor:'#fff',
        window: newsWindow
    });
    navBaseWindow = Ti.UI.createWindow({
        //tabBarHidden: true,
        navBarHidden: true
    });
    navBaseWindow.add(newsNavGroup);

} else {
    navBaseWindow = newsWindow;
}

var newsTab = Titanium.UI.createTab({
    icon:'icons/166-newspaper.png',
    title:'News Stories',
    tabBarColor: 'blue',
    navBarHidden: true,
    window:navBaseWindow
});

//
// create tab window and tab for the videos
//
var videoWindow = Titanium.UI.createWindow({
    title:'News Video',
    backgroundColor:'#fff',
    barColor: '#333399',
    url:'youtube.js'
});
var videoTab = Titanium.UI.createTab({
    icon:'icons/45-movie-1.png',
    title:'News Video',
    window:videoWindow
});

//
// create tab window and tab for the favorites
//
var favoriteWindow = Titanium.UI.createWindow({
    title:'Favorites',
    backgroundColor:'#fff',
    barColor: '#333399',
    url:'favorites.js',
    navGroup: newsNavGroup,
    app: myApp
});

var favoriteTab = Titanium.UI.createTab({
    icon:'icons/28-star.png',
    title:'Favorites',
    window:favoriteWindow
});

//
// create tab window and tab for the settings
//
var settingsWindow = Titanium.UI.createWindow({
    title:'Settings',
    backgroundColor:'#fff',
    barColor: '#333399',
    url:'settings.js'
});
var settingsTab = Titanium.UI.createTab({
    icon:'icons/20-gear2.png',
    title:'Settings',
    window:settingsWindow
});

//
//  add tabs
//
tabGroup.addTab(newsTab);
tabGroup.addTab(videoTab);
tabGroup.addTab(favoriteTab);
tabGroup.addTab(settingsTab);

// open tab group
tabGroup.open();

if (Ti.App.Properties.getBool("STARTUP_GET_COUNTS")) {
    if ( Titanium.Platform.name == 'iPhone OS') {
        Ti.API.info("calling getRSSTopicCounts");
        myApp.getRSSTopicCounts(newsTable);
    } else {
        Ti.API.info("calling getRSSTopicCounts");
        myApp.getRSSTopicCounts(newsTable);
    }
}

