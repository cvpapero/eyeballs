/*
2015.6.10
問題
処理が遅いのは、一秒に数回アニメーションしているから
必要な時だけアニメーションするようにしたい
canvasを使う方が良いと思う

2目がそっちの方向を向かない

*/


$(function() {

    $( '#myCanvas' ).get( 0 ).width = $( window ).width();
    $( '#myCanvas' ).get( 0 ).height = $( window ).height();

    var stage = new createjs.Stage("myCanvas");

    var width = $(window).width();
    var height = $(window).height();
   
    var dpr = window.devicePixelRatio;
    var dpi = 96;
    var inch = 0.0254;

    console.log('width:'+width+',height:'+height+',dpr:'+dpr);
    console.log('realwidth:'+width/(dpi*dpr)*inch+',height:'+height/(dpi*dpr)*inch); 

    //白目の半径
    var eyeR = width/6;

    //ブラウザ座標(左上)における目と目の間の位置
    var rootX = width/2;
    var rootY = height/2;

    //ブラウザ座標(左上)における右目[0],左目[1]の位置
    var bEyeX = [];
    var bEyeY = [];

    bEyeX[0] = rootX/2;
    bEyeY[0] = rootY;
    bEyeX[1] = rootX*3/2;
    bEyeY[1] = rootY;

    //rootX, rootYを原点としたときの右目[0],左目[1]の位置
    var rEyeX = [];
    var rEyeY = [];

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
    var frame = 1;
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

	eye_mask[i].graphics.beginFill("#FFFFFF").drawCircle(bEyeX[i], bEyeY[i], eyeR);
	wink_shape[i].
	    graphics.
	    beginFill("#FFFFFF").
	    drawRect(bEyeX[i]-eyeR*2, bEyeY[i]-eyeR*-2*2, eyeR*2, eyeR*2);
	eye_bg[i].graphics.beginFill("#006699").drawCircle(bEyeX[i], bEyeY[i], eyeR);

	//pupil[i].graphics.beginFill("red")
	//    .drawCircle(0, 0, eyeR/2);

	radH = eyeR/2;
	x[i] = 0;
	y[i] = 0;
	z[i] = 0;

	rEyeX[i] = bEyeX[i] - rootX;
	rEyeY[i] = (bEyeY[i] - rootY)*-1;

	stage.addChild(eye_bg[i]);
    }

    var eye_mid = new createjs.Shape();
    eye_mid.graphics.beginFill("#006699").drawCircle(rootX, rootY, 10);

    

    stage.addChild(eye_mid);

    var cliX, cliY, cliZ=0.5;

    $(window).mousedown( function(event) {
	//実世界(x, y, z)に変換する必要がある、、、
	cliX = event.clientX - rootX;
	cliY = (event.clientY - rootY)*-1;
	//var str = 'eye:'+ pixelToMeter(eyeX[1]-eyeX[0]) +', x:'+pixelToMeter(cliX)+'  y:'+pixelToMeter(cliY)+'  z:'+cliZ;
	//$("#output").text(str);
	console.log('mouse x:'+cliX+', y:'+cliY);
	init(cliX, cliY, cliZ);
    });

  $(window).mousemove( function(event) {
      //実世界(x, y, z)に変換する必要がある、、、
      cliX = event.clientX - rootX;
      cliY = (event.clientY - rootY)*-1;
     // var str = 'eye:'+ pixelToMeter(eyeX[1]-eyeX[0]) +', x:'+pixelToMeter(cliX)+'  y:'+pixelToMeter(cliY)+'  z:'+cliZ;
      //$("#output").text(str);
      //init(cliX, cliY, cliZ);
    });

    function pixelToMeter(pix) {
	return pix/(dpi*dpr) * inch;
    }

    function init(subX, subY, subZ){

	//実世界での座標
	goalX[0] = pixelToMeter(subX - rEyeX[0]);//subX + disEye;
	goalX[1] = pixelToMeter(subX - rEyeX[1]);//subX - disEye;
	goalY = pixelToMeter(subY - rEyeY[0]);//=subY - rEyeX[1]
	goalZ = subZ;

	//var str = 'x:'+subX+'  y:'+subY+'  z:'+subZ;
	//$("#output").text(str);
	var str2 = 'init: goalx0:'+goalX[0]+'  goalx1:'+goalX[1]+' goalY:'+goalY+', goalZ:'+goalZ;
	//$("#rotate").text(str2);
	console.log(str2);

	//}
	for(var i = 0; i < 2 ; ++i){
	    stage.addChild(pupil[i]);
	}

	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(1);
    }

    function tick(){
	var paused;
	createjs.Ticker.setPaused(false);
	for(var i = 0; i < 2; ++i){
	    
	    compParam(i, goalX[i], goalY, goalZ);
	    drawEyeball(i, dis[i], radW[i], deg[i]);

	}
	createjs.Ticker.setPaused(true);
	stage.update();
    }

    function compParam(i, x, y, z){
	//console.log('x:'+x+', y:'+y+', z:'+z);

	var theta = Math.atan2(y, x);
	var phi = Math.atan2(z, x);
	deg[i] = theta * 180/Math.PI;
	dis[i] = radH / Math.tan( phi );
	radW[i]= radH / Math.sin( phi );//ほんとうにここeyeRでOKか？

	console.log('deg['+i+ ']:'+deg[i]+',dis:'+dis[i]+',radW:'+radW[i]+', phi:'+phi*180/Math.PI);
    }

    function drawEyeball(i, dis, radW, deg){

	//rEyeXとdisはピクセル,
	var disX =  rEyeX[i] + dis * Math.cos( deg * Math.PI/180 );
	var disY =  rEyeY[i] + dis * Math.sin( deg * Math.PI/180 );
	console.log('dis_x:'+disX+',dis_y:'+disY);       

	pupil[i].graphics.beginFill("red")
	    .drawCircle(0, 0, radH);
	pupil[i].scaleX = radW / radH*2;
	pupil[i].x = disX;
	pupil[i].y = disY;
       
	pupil[i].rotation = deg;

	pupil[i].mask = eye_mask[i];
    }

});

