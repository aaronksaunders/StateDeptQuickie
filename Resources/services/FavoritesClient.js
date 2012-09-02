FavoritesClient = function() {

	//bootstrap database
	var db = Ti.Database.open('favorites_database');
	db.execute('CREATE TABLE IF NOT EXISTS favorites(id INTEGER PRIMARY KEY, favorites_id TEXT, favorites_data TEXT, time_stamp DATE);');
	db.close();
}

/** ---------------------------------------------------------------------------
 *
 */
FavoritesClient.prototype.listFavorites = function(_dataOnly) {
	var favsList = [];
	var db = Ti.Database.open('favorites_database');
	var result = db.execute('SELECT * FROM favorites ORDER BY time_stamp ASC');
	while(result.isValidRow()) {
		if(_dataOnly) {
			//Ti.API.debug(JSON.parse(result.fieldByName('favorites_id')));
			//Ti.API.debug(JSON.parse(result.fieldByName('favorites_data')));
			favsList.push(JSON.parse(result.fieldByName('favorites_data')));
		} else {
			favsList.push({
				//add these attributes for the benefit of a table view
				favorites_id : result.fieldByName('favorites_id'),
				id : result.fieldByName('id'), //custom data attribute to pass to detail page
				favorites_data : JSON.parse(result.fieldByName('favorites_data')), //custom data attribute to pass to detail page
				time_stamp : result.fieldByName('time_stamp'),
			});
		}
		result.next();
	}
	result.close();
	//make sure to close the result set
	db.close();

	return favsList;
};
/** ---------------------------------------------------------------------------
 *
 */
FavoritesClient.prototype.isFavorite = function(_favorites_id) {
	var favsList = [];
	var db = Ti.Database.open('favorites_database');
	var result = db.execute('SELECT * FROM favorites where favorites_id=?', _favorites_id);
	if(result.isValidRow()) {
		result.close();
		//make sure to close the result set
		db.close();
		return true;
	} else {
		result.close();
		//make sure to close the result set
		db.close();
		return false;
	}
};
/** ---------------------------------------------------------------------------
 *
 */
FavoritesClient.prototype.addFavorite = function(_favorites_id, _favorites_data) {
	Ti.API.info('Adding: '+_favorites_id);
	if(this.isFavorite(parseInt(_favorites_id)))
		return;
	var db = Ti.Database.open('favorites_database');
	var dataString = JSON.stringify(_favorites_data);
	db.execute("INSERT INTO favorites(favorites_id,favorites_data,time_stamp) VALUES(?,?,?)", parseInt(_favorites_id), dataString, new Date());
	var lastID = db.lastInsertRowId;
	db.close();

	//Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("app:favorites.updated");

	return lastID;
};
/** ---------------------------------------------------------------------------
 *
 */
FavoritesClient.prototype.deleteFavorite = function(_favorite_id) {
	Ti.API.info('Removing: '+_favorite_id);
	var db = Ti.Database.open('favorites_database');
	db.execute("DELETE FROM favorites WHERE favorites_id = ?", parseInt(_favorite_id));
	db.close();

	//Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("app:favorites.updated");
};
/** ---------------------------------------------------------------------------
 *
 */
FavoritesClient.prototype.deleteFavoriteByListingId = function(_favorites_id) {
	var db = Ti.Database.open('favorites_database');
	db.execute("DELETE FROM favorites WHERE favorites_id = ?", _favorites_id);
	db.close();

	//Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("app:favorites.updated");
};

exports.FavoritesClient = FavoritesClient; 