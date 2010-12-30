// http://gdata.youtube.com/feeds/api/videos?q=statevideo&format=6&orderby=published&max-results=10&v=2

/**
 * Convert number of seconds into time object
 *
 * @param integer secs Number of seconds to convert
 * @return object
 */
function secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

/**
 * the State Department Feed from YouTube has a last updated time that should
 * be checked before executing the query, there is a lot of data to process
 * 
 */
var processRSS = function(_feedURL, _tableView) {
    // create table view data object
    var data = [];

    Ti.API.info(" "+_feedURL);

    var xhr = Ti.Network.createHTTPClient();
    xhr.open("GET",_feedURL.replace(/\"/g,""));
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onerror = function(e) {
        alert(e);
        Ti.API.info(" "+e);
    };
    xhr.onload = function() {
        try {
            Ti.API.info(" "+xhr.responseText);
            var data = JSON.parse(xhr.responseText).feed.entry;
            Ti.API.info(" "+data);

            //_tableView.window.title = doctitle;
            var x = 0;
            for (var c=0;c<data.length;c++) {
                var i = data[c]

                var title = i.title.$t;
                var description = i.content.$t;
                var video_url = i.media$group.media$content[0].url;
                var _duration = i.media$group.media$content[0].duration;
                var _durObject = secondsToTime(_duration);
                var video_duration = _durObject.m + ":" + _durObject.s;
                var video_thumb_url = i.media$group.media$thumbnail[0].url;
                var video_twitter_url = i.link[0].href;
                //var video_thumb = data[c].media$thumbnail;
                Ti.API.debug( title +" "+ description +" "+ video_url);

                var row = Ti.UI.createTableViewRow({
                    height:'auto',
                    //backgroundColor:'#ADD8E6',
                    width:'100%'
                });

                var thumb = null;
                if ( Titanium.Platform.name == 'iPhone OS') {

                    // Create new imageView for thumbnail
                    thumb = Ti.UI.createImageView({
                        left:1,
                        height:'auto',
                        width:120,
                        image:video_thumb_url
                    });

                } else {
                    thumb = Ti.UI.createView({
                        left:1,
                        height:'90',
                        width:120,
                        backgroundImage : video_thumb_url
                    });
                }

                var label = Ti.UI.createLabel({
                    text: '( ' + video_duration + ' ) ' + title,
                    height:'auto',
                    left:thumb.width + 5,
                    top:5,
                    color:'#333399',
                    right:5
                });
                row.add(thumb);
                row.add(label);
                row.video_url = video_url;
                row.video_duration = video_duration;
                row.our_title = title;
                row.our_description = description;
                row.video_twitter_url = video_twitter_url.replace('\\u003d','=').replace("&feature=youtube_gdata","");
                row.video_thumb = video_thumb_url;
                Ti.API.debug(" in loop " + row.video_url);
                Ti.API.debug(" in loop " + row.video_twitter_url);
                Ti.API.debug(" in loop " + row.video_thumb);
                Ti.API.debug(" in loop " + row.video_duration);
                data[x++] = row;
            }

            _tableView.fireEvent('reloadData', {rowData:data});

        } catch(E) {
            alert(E);
            Ti.API.error(" "+E);
        }

    };
    xhr.send();
};
/**
 *
 */
var initWindow = function() {
    var tableview =Ti.UI.createTableView({
        //backgroundColor:'#ADD8E6',
        data:[{title:"Searching"}],
        style: Ti.UI.iPhone.TableViewStyle.PLAIN
    });
    Titanium.UI.currentWindow.add(tableview);

    tableview.addEventListener('reloadData', function(data) {
        Ti.API.info("reload data " + data.rowData);
        tableview.setData(data.rowData);
    });
    tableview.addEventListener('click', function(e) {

        Ti.API.info("title data " + e.row.our_title);

        var w = null;

        if ( Titanium.Platform.name == 'iPhone OS') {
            var _titleLabel = Ti.UI.createLabel({
                text : e.row.our_title,
                top : 5,
                width : 'auto',
                height : '100%',
                color:'#fff',
                font : {
                    fontWeight : 'bold',
                    fontSize : '11px'
                }
            });

            w = Ti.UI.createWindow({
                titleControl:_titleLabel,
                barColor: '#333399'
            });
        } else {
            w = Ti.UI.createWindow({
                title : e.row.our_title,
                fullscreen: false
            });
        }

        var htmlString = "<html><head>" +
        "<meta name = 'viewport' content = 'initial-scale = 1.0, user-scalable = no, width = 320'/></head>" +
        "<body style='background:#fff;margin-top:0px;margin-left:0px'>" +
        "<div><object width='320' height='150'>" +
        "<param name='movie' value='__URL__'></param> " +
        "<param name='wmode' value='transparent'></param> " +
        "<embed src='__URL__' " +
        "type='application/x-shockwave-flash' wmode='transparent' width='320' height='150'></embed> " +
        "</object></div><p>"+e.row.our_description+"</p></body></html>";
        /**
         htmlString ="<html><body><iframe class='youtube-player' type='text/html' width='300' height='150'";
         htmlString = htmlString + " src='http://www.youtube.com/embed/JObKZxsLlus' frameborder='0'></iframe>";
         htmlString = htmlString + "<p>"+e.row.our_description+"</p></body></html>";
         **/
        htmlString = htmlString.replace(/__URL__/g,e.row.video_url);

        var wb = Ti.UI.createWebView({html:htmlString});
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
            w.open({modal:true});
        } else {
            //w.open();
            Ti.API.info(e.row.video_url);
            Titanium.Platform.openURL(e.row.video_url);
        }

    });
    if ( Titanium.Platform.name == 'iPhone OS') {
        processRSS("http://gdata.youtube.com/feeds/api/users/statevideo/uploads?alt=json&max-results=25", tableview);
    } else {
        processRSS("http://gdata.youtube.com/feeds/api/users/statevideo/uploads?alt=json&max-results=10", tableview);
    }
};
initWindow();
