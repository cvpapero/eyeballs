/*
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

    var before_draw = 0;
    var after_draw = 0;

    var listener = new ROSLIB.Topic({
	ros : ros,
	name : '/humans/eye_contact',
	messageType : 'eyeballs_msgs/Eyeballs'
    });

    listener.subscribe(function(msg){
	$('#state').text('now_state:'+msg.state);
	$('#fps').text('fps:'+msg.fps);
	//var date1 = new Date();
	draw_eyes( msg );
	//var date2 = new Date();
	$('#drawtime').text('window update:'+ (after_draw-before_draw)/1000. +'[s]');
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

    var start_array = [-90,-40, 0, 40, 90, 40, 0,-40];
    var end_array =   [270,220,180,140,90,140,180,220];

    function draw_eyes( msg ){
	before_draw = new Date();
	var pux;

	if( msg ){
	    pux = msg.right.x; 
	}
	else{

	    pux = 0;

	    var rand = Math.random();
	    if (rand < 0.5)
		pux_rand = radius/2;
	    else
		pux_rand = -radius/2;

	}
	draw_pupil( pux );


	function draw_pupil( px ){
	    pupil.save();
	    pupil.clearRect(0, 0, width, height);
 
	    //目の縁
	    pupil.beginPath();
	    pupil.arc(bEyeX[0], bEyeY[0], radius, 0, Math.PI*2, true);
	    pupil.closePath(); 
	    pupil.stroke();

	    pupil.beginPath();
	    pupil.arc(bEyeX[1], bEyeY[1], radius, 0, Math.PI*2, true);
	    pupil.closePath(); 
	    pupil.stroke();

	    //まぶたを描く
	    var deg_start = start_array[deg_count%8];
	    var deg_end = end_array[deg_count%8];
	    console.log('deg_count%8:'+deg_count%8+', start,end:'+start_array[deg_count%16]+','+end_array[deg_count%16]);
	    deg_count+=1;
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

	    pupil.beginPath();
	    pupil.arc(bEyeX[0]+px, bEyeY[0], radius/2, 0, Math.PI*2);
	    pupil.fill();
 
	    pupil.beginPath();	  
	    pupil.arc(bEyeX[1]+px, bEyeY[1], radius/2, 0, Math.PI*2);
	    pupil.fill();
	    pupil.restore(); 	    
	}
	after_draw = new Date();
    }

});



