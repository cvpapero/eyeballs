$(function(){

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

/*
    var requestAnimationFrame = window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame;
  */  
    draw_eyes();
    

    
    function draw_eyes(){

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

	//setInterval(draw_pupil, 100);
	
	draw_pupil();

	function draw_pupil(){
	    pupil.clearRect(0, 0, width, height);

	    xx = xx+1;
	    var px = Math.sin(xx)*150;
	    console.log('px:'+px);
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
	 
	    //requestAnimationFrame(draw_pupil);   
	    RAF(draw_pupil);
	    var lastTime = getTime();
	    var frame = Math.floor( (lastTime - startTime) / (1000/fps) % frameLength );
	    console.log(frame);
	    
	}
    }
});


