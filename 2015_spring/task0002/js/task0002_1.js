function insertAfter(newElement,targetElement){
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement)
		parent.appendChild(newElement);
	else 
		parent.insertBefore(newElement,targetElement.nextSibling);
}
function uniqueStr(str){
	var arr =[];
	for(var i=0,len=str.length;i<len;i++){
		if(arr.indexOf(str[i])==-1) arr.push(str[i]);
	}
	return arr;
}
function filterStr(str){
	var arr = [];
	for(var i=0,len=str.length;i<len;i++){
		if(str[i].length!=0) arr.push(str[i]);
	}
	return arr;
}
$("#btn1").addEventListener("click",function(e){
	e.preventDefault();

	var text = $("#input1").value.trim().split(",");
	text = uniqueStr(text);
	text = text.join(",");

	var pElement = document.createElement("p");
	pElement.innerHTML = text;
	insertAfter(pElement,this);
});

$("#btn2").addEventListener("click",function(e){
	e.preventDefault();

	var reg = /[\n\s\,\，\、;]/;
	var text = $("#input2").value.trim().split(reg);//text可能存在为空的字符
	text = filterStr(text);
	text = uniqueStr(text);
	text = text.join(",");

	var pElement = document.createElement("p");
	pElement.innerHTML = text;
	insertAfter(pElement,this);
});

$("#btn3").addEventListener("click",function(e){
	e.preventDefault();

	var reg = /[\n\s\,\，\、;]/;
	var text = $("#input3").value.trim().split(reg);//text可能存在为空的字符
	text = filterStr(text);
	text = uniqueStr(text);

	if(text.length>=10) $("#message1").style.display = "block";
	else if(text.length==0) $("#message2").style.display = "block";
	else {
		$("#message1").style.display = "none";
		$("#message2").style.display = "none";
		
		for(var i=text.length-1;i>=0;i--){
			var labelEle = document.createElement("label");
			var checkBox = document.createElement("input");
			checkBox.setAttribute("type","checkbox");
			labelEle.innerHTML = text[i];
			insertAfter(checkBox,this);
			insertAfter(labelEle,checkBox);
		}
	}
});
