window.onload=function(){
	var next = 0;
	var active = 1;
	var navs = $(".nav-li");
	var images = $(".image-li");
	var image_wrap = $(".image-wrap")[0];
	var timerInner = null;
	var timer = null;
	var timeInterval = parseInt($("#time").value) || 3000;
	var order = $("#order").value || 1;
	var cycle = $("#cycle").value || 1;
	image_wrap.style.left = "0px"
	timer = setInterval(rotate,timeInterval);
	for(var i=0,len=navs.length;i<len;i++){
		navs[i].addEventListener("click",function(e){
			e.preventDefault();
			clearInterval(timer);
			num = parseInt(this.getAttribute("data-num"));//data-num取到的值是string
			rotate(num);
			timer = setInterval(rotate,timeInterval);
		})
	}

	function move(target){
		//target是终点
		clearInterval(timerInner);
		/*var left = parseInt(image_wrap.style.left);
		image_wrap.style.left = target + "px";*/
		timerInner = setInterval(function(){
			var left = parseInt(image_wrap.style.left);
			var speed = (target - left) / 6; 
			//逐渐变慢，最后停止，距离越远速度越大，速度由距离决定
			//速度=(目标值-当前值)/缩放系数，取整，否则移动会有不完全；
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); 
			image_wrap.style.left = left + speed + "px";
		},30);
	}
	function rotate(num){
		if(num) next = num;
		else next = active<=4?active+1:1;
		removeClass(findNum(active),"active");
		addClass(findNum(next),"active");
		move(-(next-1)*500);
		active = next;
	}
	function findNum(num){
		for(var i=0,len=navs.length;i<len;i++){
			if(navs[i].getAttribute("data-num")==num) return navs[i];
		}
	}
};
