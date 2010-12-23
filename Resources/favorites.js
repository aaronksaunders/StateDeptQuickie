var win = Titanium.UI.currentWindow;

var Favorites = {
    addingFavorites : false
};

/**
 *
 */
Favorites.saveFavoritesToFiles = function(_table) {

    var newArray = [];
    for (var i=0; i < _table.data.length; i++) {
        var item = _table.data[i];
        newArray[i] = item.title + "|" + item.url;
    };

    // save the list
    Titanium.App.Properties.setList("favorites",newArray);

};
/**
 *
 */
Favorites.loadFavoritesFromFiles = function() {
    var listArray = Titanium.App.Properties.getList("favorites");
    var rArray = [];
    if ( listArray != undefined && listArray != null) {
        for (var i=0; i < listArray.length; i++) {
            var rdata = listArray[i].split("|");
            var r = Ti.UI.createTableViewRow({
                title:rdata[0],
                url:rdata[1],
                //backgroundColor:'#ADD8E6',
                color:'#333399',
                hasChild:true
            });
            rArray.push(r);

            Ti.API.info(" rows " + r);
        }
    }
    return rArray;
};
/**
 *
 * create the favorites table..
 *
 * @params _newsNavGroup
 *
 */
Favorites.createFavsTable = function() {

    Ti.API.info("createFavsTable");

    var rArray = Favorites.loadFavoritesFromFiles();

    var tableView =  Ti.UI.createTableView({
        //backgroundColor:'#ADD8E6',
        data:rArray
    });

    return tableView;
};
/**
 *
 * initialize the window for favorites
 *
 */
Favorites.initialize = function(_navGroup) {

    Ti.API.info("initialize");
    //
    // create base UI tab and root window
    //
    var favsTable = Favorites.createFavsTable();
    Favorites.favsTable = favsTable;

    win.add(favsTable);

    favsTable.addEventListener('click', function(e) {
        if ( favsTable.editing == false ) {
            var detailListWin = win.app.createNewsDetailList(e.row.title, e.row.url);
            _navGroup.open(detailListWin);
            win.app.tabGroup.setActiveTab(0);
        }
    });

    if ( Titanium.Platform.name == 'iPhone OS') {

	    // add the edit button to window
	    var b = Titanium.UI.createButton({
	        title:'Edit',
	        style:Titanium.UI.iPhone.SystemButtonStyle.EDIT
	    });
	    win.setRightNavButton(b);


	    //
	    // handle clicking the edit button
	    b.addEventListener('click', function(e) {
	        if (favsTable.editing == true) {
	            favsTable.editing = false;
	            e.source.title = 'Edit';

	            // save the new list to file
	            Favorites.saveFavoritesToFiles(favsTable);
	            win.setLeftNavButton(null);

	        } else {
	            favsTable.editing = true;
	            e.source.title = 'Save';

	            // add the cancel button
	            var cancelBtn = Titanium.UI.createButton({
	                title:'Cancel',
	                style:Titanium.UI.iPhone.SystemButtonStyle.EDIT
	            });
	            win.setLeftNavButton(cancelBtn);

	            cancelBtn.addEventListener('click', function(e) {
	                // reload original data
	                var anArray = Favorites.loadFavoritesFromFiles();
	                favsTable.setData(anArray);

	                // hide the button
	                win.setLeftNavButton(null);
	                favsTable.editing = false;
	                b.title = 'Edit';
	            });
	        }
	    });
	}
};
// initialize the window.

Ti.API.info("initializing favorites window");
Favorites.initialize(win.navGroup);

