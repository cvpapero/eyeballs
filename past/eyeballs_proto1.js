//マスク処理http://jsdo.it/dk4kd/wDZe
//目的、xyzを与えてその地点に円柱の中心を向ける
//クリック時に更新する
//変数 rootX
//オブジェクト wink_shape

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


$(function() {

    $( '#myCanvas' ).get( 0 ).width = $( window ).width();
    $( '#myCanvas' ).get( 0 ).height = $( window ).height();

    var stage = new createjs.Stage("myCanvas");

    var width = $(window).width();
    var height = $(window).height();
   
    var dpr = window.devicePixelRatio;
    var dpi = 96;
    var inch = 2.54;//0.0254;

    console.log('width:'+width+',height:'+height+',dpr:'+dpr);
    console.log('realwidth:'+width/(dpi*dpr)*inch+',height:'+height/(dpi*dpr)*inch); 

    //白目の半径
    var eyeR = width/6;

    //目と目の間の位置
    var rootX = width/2;
    var rootY = height/2;

    //右目[0],左目[1]の位置
    var eyeX = [];
    var eyeY = [];

    eyeX[0] = rootX/2;
    eyeY[0] = rootY;
    eyeX[1] = rootX*3/2;
    eyeY[1] = rootY;

    //右目[0]と左目[1]のマスク,まぶた,背景,瞳の定義
    var eye_mask = [];
    var eyeWinkState = [];
    var wink_shape = [];
    var eye_bg = []; 
    //var pupil = [];
    var pupil = new createjs.Shape();
    //pupil[1] = new createjs.Shape();

    //右目[0]と左目[1]の位置パラメータの定義
    var x = [], y = [], z = [];
    var goalX = [], goalY, goalZ;
    var diff = 0.1, th = 0.1;
    var frame = 10;
    //var dis = [], radW = [], radH = [], deg = [];
    var dis=[], radW=[], radH, deg=[];
    //var theta, phi;

    //右目[0]と左目[1]の初期化
    for(var i = 0; i < 2 ; ++i){
	eye_mask[i] = new createjs.Shape();
	eyeWinkState[i] = 0;
	wink_shape[i] = new createjs.Shape();
	eye_bg[i] = new createjs.Shape();
	pupil[i] = new createjs.Shape();

	eye_mask[i].graphics.beginFill("#FFFFFF").drawCircle(eyeX[i], eyeY[i], eyeR);
	wink_shape[i].
	    graphics.
	    beginFill("#FFFFFF").
	    drawRect(eyeX[i]-eyeR*2, eyeY[i]-eyeR*-2*2, eyeR*2, eyeR*2);
	eye_bg[i].graphics.beginFill("#006699").drawCircle(eyeX[i], eyeY[i], eyeR);

	//pupil[i].graphics.beginFill("red")
	//    .drawCircle(0, 0, eyeR/2);

	radH = eyeR;
	x[i] = 0;
	y[i] = 0;
	z[i] = 0;
    }


    var cliX, cliY, cliZ=2;

    $(window).mouseup( function(event) {
	//実世界(x, y, z)に変換する必要がある、、、
	cliX = pixelToMeter(event.clientX - rootX);
	cliY = pixelToMeter(event.clientY - rootY);
	console.log('cli---x:'+cliX+', y:'+cliY+', z:'+cliZ);
	init(cliX, cliY, cliZ);
    });

    function pixelToMeter(pix) {
	return pix/(dpi*dpr) * inch;
    }

    function init(subX, subY, subZ){
	var disM = Math.sqrt(subX*subX+subY*subY+subZ*subZ);

	//for(var i = 0; i < 2; ++i){
	goalX[0] = subX - disM*Math.cos(Math.atan2(subZ, subX));
	goalX[1] = subX + disM*Math.cos(Math.PI - Math.atan2(subZ, subX));
	goalY = subY;
	goalZ = subZ;
	//}
	for(var i = 0; i < 2 ; ++i){
	    stage.addChild(eye_bg[i], pupil[i], wink_shape[i]);
	}
	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(60);
    }

    function tick(event){

	for(var i = 0; i < 2; ++i){
	    var deltaX = (goalX[i] - x[i])/frame;
	    var deltaY = (goalY - y[i])/frame;
	    var deltaZ = (goalZ - z[i])/frame;
	    
	    if( Math.abs( goalX[i] - x[i] ) > th ){
		x[i] = x[i] + deltaX;
	    }
	    if( Math.abs( goalY - y[i] ) > th ){
		y[i] = y[i] + deltaY;
	    }
	    if( Math.abs( goalZ - z[i] ) > th ){
		z[i] = z[i] + deltaZ;
	    }
	    
	    //console.log('x:'+x[i]+', y:'+y[i]+', z:'+z[i]);
	    
	    compParam(i, x[i], y[i], z[i]);
	    drawEyeball(i, dis[i], radW[i], deg[i]);
	    //wink();
	}
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

    function compParam(i, x, y, z){
	var theta = Math.atan2(z, x);
	var phi = Math.atan2(y, Math.sqrt(x*x + z*z));
	deg[i] = phi * 180/Math.PI;
	dis[i] = eyeR / Math.tan( theta );
	radW[i] = eyeR / Math.sin( theta );

	console.log('comParam--deg:'+deg+',dis:'+dis+',radW:'+radW);
    }

    function drawEyeball(i, dis, radW, deg){

	var disX =  eyeX[i] + dis * Math.cos( deg * Math.PI/180 );
	var disY =  eyeY[i] + dis * Math.sin( deg * Math.PI/180 );
	//console.log('dis_x:'+dis_x+',dis_y:'+dis_y);
                

	pupil[i].graphics.beginFill("red")
	    .drawCircle(0, 0, radH/2);
	pupil[i].scaleX = radW / radH;
	pupil[i].x = disX;
	pupil[i].y = disY;
       
	pupil[i].rotation = deg;

	pupil[i].mask = eye_mask[i];
    }

});

