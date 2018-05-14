var data = [{
	"month":"Jan",
	"AQI":[9,8,8,7]
},{
	"month":"Feb",
	"AQI":[7,7,6,8]
},{
	"month":"Jan",
	"AQI":[8,7,9,7]
}];
var vinyls = {
	"classic":10,
	"rock":14,
	"pop":2,
	"Jazz":12
};
//var canvas = document.getElementById("AQICanvas");
function drawLine(ctx,startX,startY,endX,endY,color){
	ctx.save();
	ctx.strokeColor = color;
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX,endY);
	ctx.stroke();
	ctx.restore();
}
function drawBar(ctx,x,y,width,height,color){
	//width,height:px
	ctx.save();
	ctx.fillStyle = color;
	ctx.fillRect(x,y,width,height);
	ctx.restore();
}
var Barchart = function(options){
	this.options = options;
	this.canvas = options.canvas;
	this.ctx = this.canvas.getContext("2d");
	this.colors = options.colors;
	this.draw = function(){
		var maxValue = 0;
		var data = this.options.data;
		for(var categ in data){
			maxValue = Math.max(maxValue,data[categ]);
		}
		var canvasActualHeight = this.canvas.height-this.options.padding*2;
		var canvasActualWidth = this.canvas.width-this.options.padding*2;
		var barIndex = 0;
		var numberOfBars = Object.keys(data).length;
		var barSize = canvasActualWidth/numberOfBars;
		for(categ in data){
			var val = data[categ];
			var barHeight = Math.round(canvasActualHeight*val/maxValue);
			drawBar(
				this.ctx,
				this.options.padding+barIndex*barSize,
				this.canvas.height - barHeight - this.options.padding,
				barSize,
				barHeight,
				this.colors[barIndex%this.colors.length]
			);
			barIndex++;
		}
	}
};
var myBarchart = new Barchart({
	canvas:document.getElementById("AQICanvas"),
	padding:10,
	data:vinyls,
	colors:["#a55ca5","#67b6c7","#bccd7a","#eb9743"]
});
myBarchart.draw();
