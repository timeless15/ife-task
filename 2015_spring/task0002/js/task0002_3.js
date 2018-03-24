window.onload=function(){
	var image_wrap = $(".image-wrap")[0];
	image_wrap.style.left="0px";
	var t = setInterval(function(){timer(image_wrap)},0.5);

};
function timer(image_wrap){
	var left = parseInt(image_wrap.style.left);
	if(left > -2000 ) left = left -1;
	else left = 0;
	image_wrap.style.left = left + "px";
}