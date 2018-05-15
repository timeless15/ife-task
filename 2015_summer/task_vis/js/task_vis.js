var testdata = [{
	"month":"Jan",
	"AQI":[9,8,8,7]
},{
	"month":"Feb",
	"AQI":[7,7,6,8]
},{
	"month":"Jan",
	"AQI":[8,7,9,7]
}];
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
function addText(ctx,color,x,y,text){
	ctx.save();
	ctx.fillStyle = color;
	ctx.font = "16px Arial"
	ctx.fillText(text,x,y);
	ctx.restore(); 
}
var Barchart = function(options){
	this.canvas = options.canvas;
	this.ctx = this.canvas.getContext("2d");
	this.colors = options.colors;
	this.data = options.data;
	this.draw = function(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);//clear for redraw
		var padding = options.padding,
			canvasWidth = this.canvas.width - padding * 2,
			canvasHeight = this.canvas.height - padding * 2,
			barIndex = this.data.length,
			barHeight = Math.round(canvasHeight / barIndex),
			initialY = padding;
		for (var i=0;i<barIndex;i++) {
			var AQIdata = this.data[i].AQI,
				month = this.data[i].month,
				initialX = padding + 30;
			addText(this.ctx, "#000", padding , initialY + 20, month);
			for(var j=0;j<AQIdata.length;j++){
				drawBar(this.ctx, initialX, initialY +5 , 10 * AQIdata[j], barHeight-10, this.colors[j]);
				addText(this.ctx, "#fff", initialX + 10, initialY + 22, AQIdata[j]);
				initialX += 10 * AQIdata[j];
			}
			initialY += barHeight;
		}
	}
};
var myBarchart = new Barchart({
	canvas:document.getElementById("AQICanvas"),
	padding:10,
	data: testdata,
	colors:["#a55ca5","#67b6c7","#bccd7a","#eb9743"]
});
myBarchart.draw();

var checkboxs = document.querySelectorAll("input[name=type]");
var checkArr = [1,1,1,1];
for(var i=0,len=checkboxs.length;i<len;i++){
	checkboxs[i].addEventListener("change",function(){
		if(this.checked){
			checkArr[]=1;
		}else{
			checkArr[]=0;
		}console.log(checkArr)
	})
}
