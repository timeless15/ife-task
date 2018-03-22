function format(str){
	//var reg = /^\d{4}\-\d{2}\-\d{2}$/;
	//时间输入格式匹配要注意范围
	var reg = /^\d{4}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2]\d)|(3[0-1]))$/
	if(reg.test(str)){
		str = str.split("-");
		str = str.map(x=>parseInt(x));
		return str;
	}
	return -1;
}
function dateCheck(target,current){
	var result = [];
	var units = [60*60*24,60*60,60,1]
	var diff = target - current;
	if(diff<0) return -1;
	diff = Math.round(diff/1000);
	for(var i=0;i<4;i++){
		result.push(Math.floor(diff/units[i]));
		diff = diff - result[i]*units[i];
	}
	return result;

}
$("#btn").addEventListener("click",function(e){
	e.preventDefault();
	var targetStr = $("#date").value;
	targetStr = format(targetStr);
	if(targetStr == -1){
		$("#message1").style.display="block";
		$("#message2").style.display="none";
	}
	else {
		var targetDate = new Date(targetStr[0],targetStr[1]-1,targetStr[2]);
		var currentDate = new Date();
		var diffArr = dateCheck(targetDate,currentDate);
		if(targetDate < currentDate){
			$("#message2").style.display="block";
			$("#message1").style.display="none";
		}
		else{
			$("#message2").style.display="none";
			$("#message1").style.display="none";
			var pElement = document.createElement("p");
			$("#output").appendChild(pElement);
			var t = setInterval(function(){timer(targetDate)},1000);
			function timer(targetDate){
				var currentDate = new Date();
				var diffArr = dateCheck(targetDate,currentDate);
				pElement.innerHTML = "距离"+targetStr[0]+"年"+targetStr[1]+"月"+targetStr[2]+"日还有"+diffArr[0]+"天"+diffArr[1]+"小时"+diffArr[2]+"分"+diffArr[3]+"秒";	
				if(currentDate==targetDate) clearInterval(t);
			}
		}
	}
});

//check format
//check currentday
//both satisfy then count display