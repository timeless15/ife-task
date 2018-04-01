//监听input输入事件，输入一个字符就遍历数组(之前得到的结果），进行正则匹配返回结果动态生成li
//选中后输入到input框中(事件代理
//监听键盘上移下移事件
var suggestData = ['a', 'abandon', 'abdomen', 'abide', 'ability', 'able', 'abnormal', 'aboard', 'abolish', 'abound', 'about', 'above', 'fiction', 'field', 'fierce', 'fight', 'test2', 'test3'];
var hintUl = $(".hint-ul")[0];
var childs = hintUl.getElementsByTagName("li");
var autoInput = $("#autocomplete")
autoInput.addEventListener("input",function(){
	var inputStr = this.value;
	if(inputStr === "") hintUl.style.display = "none";
	else {
		var resultData = compareStr(inputStr,suggestData);
		hintUl.style.display = "block";
		renderList(inputStr,resultData);
	}
	
});
eventDelegate(hintUl, "li", "click", function(){
	autoInput.value = this.innerHTML;
	hintUl.style.display = "none";
});
eventDelegate(hintUl,"li","mouseover",function(){
	addClass(this,"active");
});
eventDelegate(hintUl,"li","mouseout",function(){
	removeClass(this,"active");
})
autoInput.addEventListener("keydown",function(e){
	if(e.keyCode == "40"){
		var current = findCurrentActive();
		if(current === false) 
			addClass(childs[0],"active");
		else if (current == childs.length-1) {
			removeClass(childs[childs.length-1],"active");
			addClass(childs[0],"active");		
		}
		else {
			removeClass(childs[current],"active");
			addClass(childs[current+1],"active");
		}
	}
	if(e.keyCode == "38"){
		var current = findCurrentActive();
		if(current === false) 
			addClass(childs[childs.length-1],"active");
		else if (current == 0) {
			removeClass(childs[0],"active");
			addClass(childs[childs.length-1],"active");			
		}
		else {
			removeClass(childs[current],"active");
			addClass(childs[current-1],"active");
		}
	}
})
function eventDelegate(element, tag, eventName, listener) {
	element.addEventListener(eventName,function(e){
		var event = e || window.event;
        var target = event.target || event.srcElement;
        if (target && target.tagName === tag.toUpperCase()) {
            listener.call(target, event);
        }
	})
}
function compareStr(inputStr,suggestData){
	var resultData = [];
	var reg = new RegExp("^"+inputStr,"i");
	for (var i=0,len=suggestData.length;i<len;i++){
		if(reg.test(suggestData[i])) resultData.push(suggestData[i]);
	}
	return resultData;
}
function renderList(inputStr,resultData){
	for(var i=0,len = childs.length;i<len;i++){
		hintUl.removeChild(childs[0]);
	}
	for(var i=0,len=resultData.length;i<len;i++){
		var li = document.createElement("li");
		var span = document.createElement("span");
		span.innerHTML = inputStr;
		li.appendChild(span)
		li.innerHTML += resultData[i].substr(inputStr.length);
		hintUl.appendChild(li);
	}
}
function findCurrentActive(){
	var reg = new RegExp(/active/);
	for(var i=0,len=childs.length;i<len;i++){
		if (reg.test(childs[i].className)){
			return i;
		}
	}
	return false;//如果没有找到，则返回false
}
