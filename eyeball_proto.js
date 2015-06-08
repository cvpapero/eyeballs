$(function() {
    var canvas = $('#myCanvas')[0];
    var context = canvas.getContext('2d'); 
    var cx = 0;
    var cy = 0;
    var radius1 = 30;
    var radius2 = 50;

    var x, y, z;
    var t, d, r;

    drawEye(t, d, r);

    function compParam(x, y, z){

    }

    function drawEye(t, d, r){
	context.save();
	// translate context
	context.translate(canvas.width / 2, canvas.height / 2);
	
	context.beginPath();
	context.arc(cx, cy, radius1, 0, 2 * Math.PI, false);
	context.clip();

	// rotation
	context.rotate( 20 * Math.PI / 180 ); 
	// scale context horizontally
	context.scale(2, 1);
	
	// draw circle which will be stretched into an oval
	context.beginPath();
	context.arc(cx, cy, radius2, 0, 2 * Math.PI, false);
	// restore to original state
	context.restore();
	
	// apply styling
	context.fillStyle = '#8ED6FF';
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = 'black';
	context.stroke();
    }
});


/*
var ros = new ROSLIB.Ros({
    url: 'ws://licalhost:9090'
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



/*
    var listener = new ROSLIB.Topic({
	ros: ros,
	name: 'arg_listener',
	messageType : ''
    });

    listener.subscribe(function(message) {
	
    });

    function
*/


