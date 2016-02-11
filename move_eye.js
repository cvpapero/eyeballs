
$(function(){
 
    $( '#eyeBalls' ).get( 0 ).width = $( window ).width();
    $( '#eyeBalls' ).get( 0 ).height = $( window ).height();

    var width = $(window).width();
    var height = $(window).height();

    var canvas = [];
    canvas = $('#eyeBalls')[0];

    var frame, pupil;
    frame = canvas.getContext('2d');
    pupil = canvas.getContext('2d');

    var rootX = width/2;
    var rootY = height/2;

    var radius = width/6;

    var bEyeX = [];
    var bEyeY = [];

    bEyeX[0] = rootX/2;
    bEyeY[0] = rootY;

    bEyeX[1] = 3*rootX/2;
    bEyeY[1] = rootY;  

    var pux_rand = 100;   
    var deg_count = 0;


    //まばたきのスピード
    //var start_array = [-90, -40, 0, 90, 90, 90, 0, -40];
    //var end_array =   [270,220, 180,90, 90, 90, 180, 220];
    //var start_array = [-90, -80, -70, -60, -50, -40, -30, -20, 0, 90, 90, 90, 0, -40];
    //var end_array =   [270, 260, 250, 240, 230, 220, 210, 190,180,90, 90, 90, 180, 220];
    var start_array = [-90, -40, -20,  0, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,  0, -20, -40];
    var end_array =   [270, 220, 200,180, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 180, 200, 220];

    var blink = 1;
    var blink_state = false;
    var blink_seq = 0;
    var blink_times = 0;
    var blink_count = 0;

    //現在の状態保持
    var state = 4;

    //目の縁の描画
    function draw_edges(){
	pupil.beginPath();
	pupil.arc(bEyeX[0], bEyeY[0], radius, 0, Math.PI*2, true);
	pupil.closePath(); 
	pupil.stroke();	
	pupil.beginPath();
	pupil.arc(bEyeX[1], bEyeY[1], radius, 0, Math.PI*2, true);
	pupil.closePath(); 
	pupil.stroke();
    }

    function eyelids( msg ){
	if(!msg)
	    blink_state = true;

	draw_eyelids(blink_seq);

	if(blink_state){	   
	    if(!(blink_seq < (start_array.length - 1))){
		blink_state = false;
		blink_seq = 0;
	    }
	    ++blink_seq;
	}else{
	    blink_seq = 0;
	}
    }

    //まぶたの描画
    function draw_eyelids( seq ){	
	var deg_start = start_array[seq];
	var deg_end = end_array[seq];	
	var rad_start = deg_start*(Math.PI/180.);
	var rad_end = deg_end*(Math.PI/180.);
	pupil.beginPath();
	pupil.arc(bEyeX[0], bEyeY[0], radius, rad_start, rad_end, false);
	pupil.closePath(); 
	pupil.stroke();	
	pupil.beginPath();
	pupil.arc(bEyeX[1], bEyeY[1], radius, rad_start, rad_end, false);
	pupil.closePath();
	pupil.stroke();
	
	//まぶた以外の場所をクリッピング
	pupil.beginPath();
	pupil.arc(bEyeX[0], bEyeY[0], radius, rad_start, rad_end, false);
	pupil.arc(bEyeX[1], bEyeY[1], radius, rad_start, rad_end, false);
	pupil.clip(); 
    }

    var rx = 0;
    var lx = 0;
    var enl = 0
    //瞳の描画
    function draw_pupils( rx, lx, enlarge ){
	/*
	if (!enlarge){
	    enl = 10
	}else{
	    enl = 0
	}
	*/
	pupil.beginPath();
	pupil.arc(bEyeX[0]+rx, bEyeY[0], (radius+enl)/2, 0, Math.PI*2);
	pupil.fill();
	pupil.beginPath();	  
	pupil.arc(bEyeX[1]+lx, bEyeY[1], radius/2, 0, Math.PI*2);
	pupil.fill();
    }

    var micro = 5
    var gap = 40;
    var speed = 5
    var cnt = 0;
    /*
    var look_x=0 
    var max = 100, min = -100;
    //瞳の移動量の決定
    function pupils(state){
	state = 4
	switch (state){
	case 1:	   
	    rx = look_x + micro*Math.sin(cnt*speed*Math.PI/180.);
	    lx = look_x + micro*Math.sin(cnt*speed*Math.PI/180.);
	    if(look_x > max)
		look_x = max
	    look_x += 1
	    break;
	case 2:
	    rx = look_x + micro*Math.sin(cnt*speed*Math.PI/180.);
	    lx = look_x + micro*Math.sin(cnt*speed*Math.PI/180.);
	    if(look_x < min)
		look_x = min
	    look_x -= 1
	    break;
	case 3:
	    rx = look_x + micro*Math.sin(cnt*speed*Math.PI/180.);
	    lx = look_x + micro*Math.sin(cnt*speed*Math.PI/180.);
	    if(look_x > min)
		look_x = min
	    look_x -= 1
	    
	    break;
	case 4:
	    rx = gap*Math.sin(cnt*speed*Math.PI/180.);
	    lx = gap*Math.sin(cnt*speed*Math.PI/180.);
	    break;
	default:
	    break;
	} 
	console.log('rx:'+rx);
	cnt += 1;
    }
    */
    function pupils_(state){
	rx = gap*Math.sin(cnt*speed*Math.PI/180.);
	lx = rx;
	cnt += 1;
    }

    var time_accum = 0;
    var start_time = new Date();

    function draw_eyes(eye_state, eye_blink, enlarge){
	pupil.save();
	pupil.clearRect(0, 0, width, height);
	//縁の描画	
	draw_edges();
	//まぶた
	eyelids(eye_blink);
	//瞳の移動の計算
	pupils_(eye_state);
	//瞳の描画
	draw_pupils(rx, lx, enlarge);
	pupil.restore(); 	    		
    }
    
    
    function random_state(min, max){
	var br;
	br = parseInt(Math.random()*(max-min)+min);
	//console.log('br:'+br);
	if (br == 0)
	    return parseInt(Math.random()*3)+1;
	else
	    return 4;	
    }

    function random_timing(min, max){
	var br;
	br = parseInt(Math.random()*(max-min)+min);
	//console.log('br:'+br);
	if (br == 0)
	    return false;
	else
	    return true;
    }
    
    state_holder = 0
    function animation_frame(){

	if(state_holder%500 == 0){
	   state = random_state(0, 2);
	}
	state_holder += 1
	var interval_state = state

	console.log('state:'+interval_state)
	var interval_blink = random_timing(0, 300);
	var interval_enlarge = random_timing(0, 100);
	draw_eyes(interval_state, interval_blink, interval_enlarge);
	requestAnimationFrame(animation_frame);	
    }

    (function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
    })();

    requestAnimationFrame(animation_frame);
});



