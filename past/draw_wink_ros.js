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
	messageType : 'std_msgs/Bool'
    });

    listener.subscribe(function(msg){
	draw_wink( msg.data );
    });


    $( '#eyeBalls' ).get( 0 ).width = $( window ).width();
    $( '#eyeBalls' ).get( 0 ).height = $( window ).height();

    var width = $(window).width();
    var height = $(window).height();

    var canvas = [];
    canvas = $('#eyeBalls')[0];
    //canvas[1] = $('#eyeBallL')[0];

    var frame, pupil, eyelid;
    frame = canvas.getContext('2d');
    pupil = canvas.getContext('2d');
    eyelid = canvas.getContext('2d');
 
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
    var pux = 0;
    draw_pupil( pux );
    
    function draw_pupil( px ){
	pupil.clearRect(0, 0, width, height);
	
	pupil.beginPath();
	pupil.arc(bEyeX[0], bEyeY[0], radius, 0, Math.PI*2);
	pupil.moveTo(bEyeX[1]-radius, bEyeY[1]);
	pupil.arc(bEyeX[1], bEyeY[1], radius, -Math.PI, Math.PI);
	pupil.stroke();
	pupil.clip();
	
	pupil.beginPath();
	pupil.arc(bEyeX[0]+px, bEyeY[0], radius/2, 0, Math.PI*2);
	pupil.fill();
	
	
	pupil.beginPath();
	pupil.scale(1, 1);	  
	pupil.arc(bEyeX[1]+px, bEyeY[1], radius/2, 0, Math.PI*2);
	pupil.fill();
	
	pupil.stroke();	
    }
  
    function draw_wink( torf ){

	var RAF = ( function(){
	    return window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
		    window.setTimeout( callback, 1000 / 60 );
		};
	} )();
	
	var now = window.performance && (
	    performance.now || 
		performance.mozNow || 
		performance.msNow || 
		performance.oNow || 
		performance.webkitNow );
	
	var getTime = function() {
	    return ( now && now.call( performance ) ) || ( new Date().getTime() );
	};
	
	
	var startTime = getTime();
	var fps = 10;
	var frameLength = 6;

	console.log('draw_wink');
	if( torf ){  
	    console.log('draw_wink:true');
	    draw_eyelid();
	}

	function draw_eyelid(){

	    xx = xx + 10;

	    var hx = Math.sin(xx * Math.PI /180)*height - height;
	    console.log('draw_eyelid width:'+width+',height:'+height+', hx:'+hx+', sin(xx):'+Math.sin(xx)+',xx:'+xx);
	    pupil.fillStyle = "rgb(255, 255, 255)";
	    pupil.fillRect(0, hx, width, height);
	    
	    if(xx > 180){
		xx = 0;
		return; 
	    }
	    RAF(draw_eyelid);
	    //requestAnimationFrame(draw_eyelid);
	}
	
    }


    
});



