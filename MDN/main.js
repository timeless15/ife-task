// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x,y,velX,velY,exists){
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	this.exists = exists;
}

function Ball(x,y,velX,velY,exists,color,size){
	Shape.call(this,x,y,velX,velY,exists);
	this.color = color;
	this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
//Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__,Ball.prototype继承了Shape.prototype的方法
Ball.prototype.constructor = Ball;//如果没有这句,此时Ball.prototype.constructor == Shape.prototype.constructor === Shape

Ball.prototype.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.fill();
}

Ball.prototype.update = function(){
	if(((this.x + this.size) >= width) || ((this.x - this.size) <= 0)){
		this.velX = - (this.velX);
	}
	if(((this.y + this.size) >= height) || ((this.y - this.size) <= 0)){
		this.velY = - (this.velY);
	}
	this.x += this.velX;
	this.y += this.velY;
}
Ball.prototype.collisionDetect = function(){
	for(var j=0;j<balls.length;j++){
		if(!(this === balls[j])){
			var dx = this.x - balls[j].x;
			var dy = this.y - balls[j].y;
			var distace = Math.sqrt(dx*dx+dy*dy);
			if(distace < this.size+balls[j].size){
				balls[j].color = 'rgb(' +random(0,255)+','+random(0,255)+','+random(0,255)+')';
			}
		}
	}
}

function EvilCircle(x,y,exists){
	Shape.call(this,x,y,20,20,exists,'white',10);
	this.color = 'white';
	this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;
EvilCircle.prototype.draw = function(){
	ctx.beginPath();
	ctx.strokeStyle = this.color;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.lineWidth = 3;
	ctx.stroke();
}
EvilCircle.prototype.checkBounds = function(){
	if(((this.x + this.size) >= width) || ((this.x - this.size) <= 0)){
		this.x = - (this.size);
	}
	if(((this.y + this.size) >= height) || ((this.y - this.size) <= 0)){
		this.y = - (this.size);
	}
}
EvilCircle.prototype.setControls = function(){
	var _this = this;//如果在keydow事件中用this，this指向的事window
	window.onkeydown = function(e) {
	    if (e.keyCode === 37) {
	      _this.x -= _this.velX;
	    } else if (e.keyCode === 39) {
	      _this.x += _this.velX;
	    } else if (e.keyCode === 38) {
	      _this.y -= _this.velY;
	    } else if (e.keyCode === 40) {
	      _this.y += _this.velY;
	    }
	}
}
EvilCircle.prototype.collisionDetect = function(){
	for(var j=0;j<balls.length;j++){
		if(balls[j].exists){
			var dx = this.x - balls[j].x;
			var dy = this.y - balls[j].y;
			var distace = Math.sqrt(dx*dx+dy*dy);
			if(distace < this.size+balls[j].size){
				balls[j].exists = false;
			}
		}
	}
}

var balls = [];
var evilcircle = new EvilCircle(random(0,width),random(0,height),true);
var p = document.getElementsByTagName("p")[0];
while (balls.length<25){
		var ball = new Ball(
			random(0,width),
			random(0,height),
			random(-7,7),
			random(-7,7),
			true,
			'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')',
			random(10,20)
		);
		balls.push(ball);
}
function loop(){
	ctx.fillStyle = 'rgba(0,0,0)';
	ctx.fillRect(0,0,width,height);
	var count = 0;
	for(var i=0;i<balls.length;i++){
		if(balls[i].exists){
			balls[i].draw();
			balls[i].update();
			balls[i].collisionDetect();
			count ++;
		}
	}
	evilcircle.draw();
	evilcircle.checkBounds();
	evilcircle.collisionDetect();
	requestAnimationFrame(loop);
	p.innerHTML = "Ball count: " + count;
}
evilcircle.setControls();
loop();