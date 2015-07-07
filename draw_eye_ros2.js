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


    var listener = new ROSLIB.Topic({
	ros : ros,
	name : '/humans/eye_contact',
	messageType : 'eyeballs_msgs/Eyeballs'
    });

    listener.subscribe(function(msg){
	$('#state').text('now_state:'+msg.state);
	$('#fps').text('fps:'+msg.fps);
	if(msg.right.x && msg.left.x)
	    draw_eyes( msg );
	else
	    wait_eyes();
    });


    $( '#eyeBalls' ).get( 0 ).width = $( window ).width();
    $( '#eyeBalls' ).get( 0 ).height = $( window ).height();

    var width = $(window).width();
    var height = $(window).height();

    var canvas = [];
    canvas = $('#eyeBalls')[0];
    //canvas[1] = $('#eyeBallL')[0];

    var frame, mask = [], pupil;
    frame = canvas.getContext('2d');
    //frame[1] = canvas.getContext('2d');
    pupil = canvas.getContext('2d');
    //pupil[1] = canvas.getContext('2d');

    var rootX = width/2;
    var rootY = height/2;

    var radius = width/6;

    var bEyeX = [];
    var bEyeY = [];

    bEyeX[0] = rootX/2;
    bEyeY[0] = rootY;

    bEyeX[1] = 3*rootX/2;
    bEyeY[1] = rootY;

    var xx = 0; 


    //draw_eyes();
    

    var pux_rand = 100;    
    function draw_eyes( msg ){

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
	    pupil.clearRect(0, 0, width, height);

	    pupil.beginPath();
	    pupil.arc(bEyeX[0], bEyeY[0], radius, 0, Math.PI*2);
	    //pupil.stroke();
	   // pupil.beginPath();
	    pupil.moveTo(bEyeX[1]-radius, bEyeY[1]);
	    pupil.arc(bEyeX[1], bEyeY[1], radius, -Math.PI, Math.PI);
	    pupil.stroke();
	    pupil.clip();

	    pupil.beginPath();
	    //pupil.scale(1/2, 1);
	    pupil.arc(bEyeX[0]+px, bEyeY[0], radius/2, 0, Math.PI*2);

	    //pupil.closePath();
	    pupil.fill();

  
	    pupil.beginPath();
	    pupil.scale(1, 1);	  
	    pupil.arc(bEyeX[1]+px, bEyeY[1], radius/2, 0, Math.PI*2);
	    pupil.fill();
	    
	    pupil.stroke();
	 	    
	}
    }

    var count = 0;
    function wait_eyes(){
	
	var pux = count % 2 * 10;
	
	++count;

	draw_pupil( pux );

	function draw_pupil( px ){
	    pupil.clearRect(0, 0, width, height);

	    pupil.beginPath();
	    pupil.arc(bEyeX[0], bEyeY[0], radius, 0, Math.PI*2);
	    //pupil.stroke();
	   // pupil.beginPath();
	    pupil.moveTo(bEyeX[1]-radius, bEyeY[1]);
	    pupil.arc(bEyeX[1], bEyeY[1], radius, -Math.PI, Math.PI);
	    pupil.stroke();
	    pupil.clip();

	    pupil.beginPath();
	    //pupil.scale(1/2, 1);
	    pupil.arc(bEyeX[0]+px, bEyeY[0], radius/2, 0, Math.PI*2);

	    //pupil.closePath();
	    pupil.fill();

  
	    pupil.beginPath();
	    pupil.scale(1, 1);	  
	    pupil.arc(bEyeX[1]+px, bEyeY[1], radius/2, 0, Math.PI*2);
	    pupil.fill();
	    
	    pupil.stroke();
	 	    
	}
    }



});



