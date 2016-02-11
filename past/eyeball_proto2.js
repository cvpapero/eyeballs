//http://jsdo.it/dk4kd/wDZe

$(function() {
//var canvas = $()


    var stage = new createjs.Stage("myCanvas");

    var mask = new createjs.Shape();
    //circle.grahics.beginFill("red").drawCircle(0,0,80).endFill();
    mask.x = 100;
    mask.y = 100;
    mask.graphics.beginFill("#FFF").drawCircle(0,0,80);

    var ellipse = new createjs.Shape();
    ellipse.graphics.beginFill("red").drawEllipse(0, 0,200, 100);
    ellipse.x = 100;
    ellipse.y = 100;
    ellipse.regX = 100;
    ellipse.regY = 50;
    ellipse.rotation = 90;
    ellipse.mask = mask;
    //ellipse.graphics.arc(75,75,50,0,Math.PI*2, false);
    var bg = new createjs.Shape();
    bg.graphics.beginFill("#006699").drawCircle(100,100,80);

/*
    var shape = new createjs.Shape();
    shape.graphics.beginFill("#ff0000");
    shape.graphics.drawRect(0,0,150,150);
    shape.graphics.arc(75, 75, 50, 0, Math.PI*2, true);
*/

    stage.addChild(bg, ellipse);
    stage.update();

    function compParam(x, y, z){

    }

    function drawEye(t, d, r){

    }
});

