//マスク処理http://jsdo.it/dk4kd/wDZe
//目的、xyzを与えてその地点に円柱の中心を向ける

/*
var ros = new ROSLIB.Ros({
    url : 'ws://133.19.23.172:9090'
});

ros.on('connection', function() {
    console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
    console.log('Connection to websocket server closed.');
});
*/


$(window).on('load resize', function() {

    var stage = new createjs.Stage("myCanvas");

    var width = $(window).width();
    var height = $(window).height();
    
    //白目の半径
    var f_eye = width/6;

    //目と目の間の位置
    var x_root = width/2;
    var y_root = height/2;

    //右目の位置
    var x_eye_right = x_root/2;
    var x_eye_right = y_root;

    //左目の位置
    var x_eye_left = x_root*3/2;
    var x_eye_left = y_root;

    //右目のマスクとまぶたと背景の定義
    var eye_mask_right = new createjs.Shape();
    var eye_wink_state_right = 0;
    var wink_shape_right = new createjs.Shape();
    var eye_bg_right = new createjs.Shape();
    eye_mask_right.graphics.beginFill("#FFFFFF").drawCircle(x_eye_right, y_eye_right, f_eye);
    wink_shape_right.
	graphics.
	beginFill("#FFFFFF").
	drawRect(x_eye_right-f_eye*2, y_eye_right-f_eye*-2*2, f_eye*2, f_eye*2);
    eye_bg_right.graphics.beginFill("#006699").drawCircle(x_eye_right, y_eye_right, f_eye);

    //左目のマスクとまぶたと背景の定義
    var eye_mask_left = new createjs.Shape();
    var eye_wink_state_left = 0;
    var wink_shape_left = new createjs.Shape();
    var eye_bg_left = new createjs.Shape();
    eye_mask_left.graphics.beginFill("#FFFFFF").drawCircle(x_eye_left, y_eye_left, f_eye);
    wink_shape_left.
	graphics.
	beginFill("#FFFFFF").
	drawRect(x_eye_left-f_eye*2, y_eye_left-f_eye*-2*2, f_eye*2, f_eye*2);
    eye_bg_left.graphics.beginFill("#006699").drawCircle(x_eye_left, y_eye_left, f_eye);

    var dpi =getDPI();
    var inch = 0.0254;

    var x = 0, y=0, z=0;
    var goalX, goalY, goalZ;
    var diff = 0.1, th = 0.1;
    var frame = 30;
    var dis, rad_w, rad_h, deg;
    rad_h = f_eye;

    //var ellipse = new createjs.Shape();
    var theta, phi;
    var pupil_right = new createjs.Shape();
    
    var pupil_left = new createjs.Shape();


    var cliX, cliY, cliZ=2;
    $(window).mousemove( function(event) {
	//実世界(x, y, z)に変換する必要がある、、、
	cliX = (event.clientX - rootX)/dpi*inch;
	cliY = (event.clientY - rootY)/dpi*inch;
	console.log('cli---x:'+cliX+', y:'+cliY+', z:'+cliZ);
	init(cliX, cliY, cliZ);
    });

/*
    var listener = new ROSLIB.Topic({
	ros : ros,
	name : 'face_pos',
	messageType : 'geometry_msgs/Vector3'
    });
    
    listener.subscribe(function(msg) {
	init(msg.x, msg.y, msg.z);
    });


    function init(subX, subY, subZ){
	goalX = subX;
	goalY = subY;
	goalZ = subZ;
	stage.addChild(bg, ellipse, wink_shape);

	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(30);
    }
*/
    function getDPI() {
	var dpi = 0,
	div = document.createElement('div');
	div.
	    setAttribute('style', 
			 'height:1in;left:-100%;top:-100%;position:absolute;width:1in;');
	document.body.appendChild(div);
	dpi = div.offsetHeight;
	document.body.removeChild(div);
	div = null;
	
	return dpi;
    };
    

    function init(subX, subY, subZ){
	goalX = subX;
	goalY = subY;
	goalZ = subZ;
	stage.addChild(eye_bg_right, pupil_right, wink_shape_right);

	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(30);
    }

    function tick(event){

	var deltaX = (goalX - x)/frame;
	var deltaY = (goalY - y)/frame;
	var deltaZ = (goalZ - z)/frame;

	if( Math.abs( goalX - x ) > th ){
	    x = x + deltaX;
	}
	if( Math.abs( goalY - y ) > th ){
	    y = y + deltaY;
	}
	if( Math.abs( goalZ - z ) > th ){
	    z = z + deltaZ;
	}
	
	console.log('x:'+x+', y:'+y+', z:'+z);

	compParam(x, y, z);
	drawEyeball(dis, rad_w, deg);
	//wink();
	stage.update(event);
    }

/*
    //bgとellipseにマスクをかけwinkのようにみせる
    function wink(){

	var eye_diff = 20;
	if(wink_state==0){
	    //ランダムでwink ok=true
	    if(Math.random()<0.01){
		wink_state = 1;
	    }
	}else if(wink_state == 1){

	    wink_shape.y = wink_shape.y + eye_diff;

	    if(wink_shape.y == f_eye*2){
		wink_state = 2;
	    }
	}else if(wink_state == 2){
	    if(Math.random()<0.3){
		wink_state = 3;
	    }
	}else if(wink_state == 3){
	    wink_shape.y = wink_shape.y - eye_diff;
	    if(wink_shape.y == 0){
		wink_state = 0;
	    }
	}
	
    }
*/

    function compParam(x, y, z){
	theta = Math.atan2(z, x);
	phi = Math.atan2(y, Math.sqrt(x*x + z*z));
	deg = phi * 180/Math.PI;
	dis = f_eye / Math.tan( theta );
	rad_w = f_eye / Math.sin( theta );

	//console.log('comParam--deg:'+deg+',dis:'+dis+',rad_w:'+rad_w);
    }

    function drawEyeball(dis, rad_w, deg){

	var dis_x =  x_eye + dis * Math.cos( deg * Math.PI/180 );
	var dis_y =  y_eye + dis * Math.sin( deg * Math.PI/180 );
	//console.log('dis_x:'+dis_x+',dis_y:'+dis_y);

	ellipse.graphics.beginFill("red")
	    .drawCircle(0, 0, rad_h/2);
	ellipse.scaleX = rad_w / rad_h;
	ellipse.x = dis_x
	ellipse.y = dis_y;

	ellipse.rotation = deg;
	ellipse.mask = mask_eye;
    }

});

