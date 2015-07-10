/*
オートメーションの動きを実現

まばたきを実装する
*/

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


$(function(){

    var look_rx, look_lx;

    var listener = new ROSLIB.Topic({
	ros : ros,
	name : '/humans/eye_contact',
	messageType : 'eyeballs_msgs/Eyeballs'
    });

    listener.subscribe(function(msg){
	$('#state').text('now_state:'+msg.state);
	$('#fps').text('fps:'+msg.fps);

	state = msg.state;
	blink = msg.blink;

	//注視の場合の目の向き
	look_rx = msg.right.x;
	look_lx = msg.left.x;

	draw_eyes(state, blink);
	$('#name').text('id:'+msg.okao_id+', name:'+msg.name);
	$('#blinkfps').text('blink_state:'+blink_state+', seq:'+blink_seq);
    });


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

    //var start_array = [-90,-40, 0, 40, 90, 40, 0,-40];
    //var end_array =   [270,220,180,140,90,140,180,220];

    //まぶたの大きさ
    var start_array = [-90, -40, 0, 90, 90, 90, 0, -40];
    var end_array =   [270,220, 180,90, 90, 90, 180, 220];

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

    //瞳の描画
    function draw_pupils( rx, lx ){
	pupil.beginPath();
	pupil.arc(bEyeX[0]+rx, bEyeY[0], radius/2, 0, Math.PI*2);
	pupil.fill();
	pupil.beginPath();	  
	pupil.arc(bEyeX[1]+lx, bEyeY[1], radius/2, 0, Math.PI*2);
	pupil.fill();
    }

    var micro_gap = 5;
    var gap = 200;
    var state4 = 0;
    //瞳の移動量の決定
    function pupils(state){
	switch (state){
	case 1:
	    /*
	      1.a秒間、相手の見ている方向を自分も見つめる
	      2.b秒間、相手を見つめる
	      3.1へ
	      ただし、a>b
	    */
/*
	    if(rx > 0){
		rx = -1*micro_gap;
		lx = -1*micro_gap;
	    }else{
		rx = micro_gap;
		lx = micro_gap;
	    }
*/	    
	    rx = look_rx;
	    lx = look_rx;

	    break;
	case 2:
	    /*
	      1.a秒間、相手をみつめる
	      2.b秒間、相手から目をそらす
	      3.1へ
	      ただし、a>b
	    */
/*
	    if(rx > 0){
		rx = -1*micro_gap;
		lx = -1*micro_gap;
	    }else{
		rx = micro_gap;
		lx = micro_gap;
	    }
*/
	    rx = look_rx;
	    lx = look_rx;
	    break;
	case 3:
	    rx = -1*gap;
	    lx = -1*gap;
	    break;
	case 4:
	    rx = gap*Math.sin(state4*10*Math.PI/180.);
	    lx = gap*Math.sin(state4*10*Math.PI/180.);
	    state4+=1;
	    break;
	default:
	    break;
	} 
    }

    var time_accum = 0;
    var start_time = new Date();

    function draw_eyes(eye_state, eye_blink){
	pupil.save();
	pupil.clearRect(0, 0, width, height);
	//縁の描画	
	draw_edges();
	//まぶた
	eyelids(eye_blink);
	//瞳の移動の計算
	pupils(eye_state);
	//瞳の描画
	draw_pupils(rx, lx);
	pupil.restore(); 	    		
    }
    
    //サブスクライブ待ちのとき呼び出す
    setInterval(function(){
	var interval_state = state; 
	var interval_blink = blink_random(0, 100);
	draw_eyes(interval_state, interval_blink);	
    }, 100);

   function blink_random(min, max){
       var br;
       br = parseInt(Math.random()*(max-min)+min);
       console.log('br:'+br);
       if (br == 0)
	   return false;
       else
	   return true;
   }

});



