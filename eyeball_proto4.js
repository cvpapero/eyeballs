//マスク処理http://jsdo.it/dk4kd/wDZe
//目的、xyzを与えてその地点に円柱の中心を向ける
$(function() {
//var canvas = $()


    var stage = new createjs.Stage("myCanvas");

    //目玉の半径
    var f_eye = 300;
    var pupil = 100;
    //目玉の位置
    var x_eye = f_eye;
    var y_eye = f_eye;
    var mask_eye = new createjs.Shape();
    mask_eye.graphics.beginFill("#FFFFFF").drawCircle(x_eye, y_eye, f_eye);

    var wink_state = 0;
    var wink_shape = new createjs.Shape();

    wink_shape.graphics.beginFill("#FFFFFF").drawRect(0,f_eye*-2,f_eye*2,f_eye*2);
    var bg = new createjs.Shape();
    //bg.regX = f_eye;
    //bg.regY = f_eye;
    bg.graphics.beginFill("#006699").drawCircle(x_eye, y_eye, f_eye);


    var x = 1, y=0, z=1;
    var dis, rad_w, rad_h, deg;
    rad_h = f_eye;

    var ellipse = new createjs.Shape();

    var theta, phi;

    init();

    function init(){
	stage.addChild(bg, ellipse, wink_shape);

	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(30);
    }

    function tick(event){
	x = x + 0.1;
	if(x > 1){
	    x = 0; 
	    //rad_w = 100;
	    //ellipse.clear();
	}
	compParam(x, y, z);
	drawEyeball(dis, rad_w, deg);
	wink();
	stage.update(event);
    }

    //bgとellipseにマスクをかけwinkのようにみせる
    function wink(){

	var eye_diff = 20;
	if(wink_state==0){
	    //ランダムでwink ok=true
	    if(Math.random()<0.05){
		wink_state = 1;
	    }
	}else if(wink_state == 1){

	    wink_shape.y = wink_shape.y + eye_diff;

	    if(wink_shape.y == f_eye*2){
		wink_state = 2;
	    }
	}else if(wink_state == 2){
	    if(Math.random()<0.05){
		wink_state = 3;
	    }
	}else if(wink_state == 3){
	    wink_shape.y = wink_shape.y - eye_diff;
	    if(wink_shape.y == 0){
		wink_state = 0;
	    }
	}
	
    }

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

