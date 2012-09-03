
var pW = Titanium.Platform.displayCaps.platformWidth;
var pH = Titanium.Platform.displayCaps.platformHeight;

var ActivityWindow = function(msg){

	this.shown = false;
	this.isAndroid = (Titanium.Platform.osname === 'android')
	this.message = msg || "Loading...";
	this.actInd = Titanium.UI.createActivityIndicator({
	    bottom:50, 
	    height:55,
	    width:180,
	    style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		height : 'auto',
		width : 'auto',
		color : "black",
	});

	if ( !this.isAndroid ){
	
		this.window = Ti.UI.createWindow({
			modal:false,
			opacity:1,
			width:'100%',
			height:'100%',
			navBarHidden : true,
		})

	var toolActIndView = Ti.UI.createView({
            height : pW,
            width : pH,
            backgroundColor : 'transparent',
            opacity : 0.3
        });

        this.window.add(toolActIndView);

        var indView = Ti.UI.createView({
            height : '150dp',
            width : '150dp',
            backgroundColor : 'black',
            borderRadius : 10,
            opacity : 0.8
        });
        
        this.ai = Ti.UI.createActivityIndicator({
			top : '50dp',
			left:"55dp",
			//message : "Processing",
			style : Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
			height : 'auto',
			width : 'auto',
			color : "black",
		});
		
		indView.add(this.ai);

	indView.add(this.actInd);
    this.window.add(indView);

	this.activity_message = Ti.UI.createLabel({

            text : this.message || 'Loading...',
            color : 'white',
            width : 'auto',
            height : 'auto',
            font : {
                fontSize : '16dp',
                fontWeight : 'bold'
            },
            bottom : '15dp'
        });
        indView.add(this.activity_message)

	}
	return this;

} 

ActivityWindow.prototype.setText = function(text){
	this.actInd.message=text;
}



ActivityWindow.prototype.show = function(msg){
	var that = this;

	if(this.shown){
		if(!this.isAndroid){
			if(this.actInd) this.actInd.message = msg;
		} else
			this.activity_message.text = msg;
		return;
	}
		
	if(msg && !this.isAndroid)
		this.activity_message.text = msg;
		
	if (!this.isAndroid){
		//Ti.UI.debug('Opening Modal Window')
		this.ai.show();
		this.window.open();
	}
	else{
		this.actInd = null;
		this.actInd = Titanium.UI.createActivityIndicator({
		    bottom:50, 
		    height:55,
		    width:180,
		    message:msg || "Loading...",
		    style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
			height : 'auto',
			width : 'auto',
			color : "black",
		});
		this.actInd.show();
	}
	this.shown = true;
	
	// Setting a timeout in case it is taking too long to complete the task
	setTimeout(function(){
		if(that.shown){
			that.hide();
		}
	},15000)
}



ActivityWindow.prototype.hide = function(){
	if(!this.shown)
		return;
	var that = this;
	if (!this.isAndroid){
		if(!this.window.visible)
			setTimeout(function(){
				that.window.close();
				that.ai.hide();
			},500)
		else{
			this.window.close();
			this.ai.hide();
		}
		
		
	} else{
		this.actInd && this.actInd.hide();
		this.actInd = null;
	}
	this.shown = false;

}



ActivityWindow.prototype.toggle = function(){

	if(this.actInd.visible)
		this.actInd.hide();
	else
		this.actInd.show();

}



exports.ActivityWindow = ActivityWindow;