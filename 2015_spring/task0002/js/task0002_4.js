//监听input输入事件，输入一个字符就遍历数组(之前得到的结果），进行正则匹配返回结果动态生成li
//选中后输入到input框中(事件代理
//监听键盘上移下移事件
/* 
1. 写的过程中，发现自己写的util函数有问题，直接copy了util_demo的写法，主要是事件代理函数。分分钟想用jquery。
2.一开始直接简单的用css处理hover的效果，然后要合并键盘上移下移事件时，发现有问题，改用mouseover和mousedown
3.键盘上下移时，怎么处理第一个和最后一个的问题
4.给li加span标签时，要注意span和li的顺序。
5.删除hintUl下的所有元素，直接用.innerHTML=""
6.deleteSpan参考了别人的写法，用match的方法会有一个bug，就是当整个单词匹配时 返回null值，则此时按下enter键
无法更新input值，后来采用了比较简单粗暴的replace方法
（另外对string的方法以及regexp仍不够熟)
*/
var suggestData = ['a', 'abandon', 'abdomen', 'abide', 'ability', 'able', 'abnormal', 'aboard', 'abolish', 'abound', 'about', 'above', 'fiction', 'field', 'fierce', 'fight', 'test2', 'test3'];
var hintUl = $(".hint-ul")[0];
var childs = hintUl.getElementsByTagName("li");
var autoInput = $("#autocomplete")
autoInput.addEventListener("input",function(){
	var inputStr = this.value;
	if(inputStr === "") {
		hintUl.innerHTML = "";
		hintUl.style.display = "none";
	}
	else {
		var resultData = compareStr(inputStr,suggestData);
		hintUl.style.display = "block";
		renderList(inputStr,resultData);
	}
	
});
eventDelegate(hintUl, "li", "click", function(){
	autoInput.value = deleteSpan(this.innerHTML);
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
		if(current === -1) 
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
		if(current === -1) 
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
	if(e.keyCode == "13"){
		var current = findCurrentActive();
		if(current >= 0){
			autoInput.value = deleteSpan(childs[current].innerHTML);
			hintUl.style.display = "none";
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
	hintUl.innerHTML = "";
	for(var i=0,len=resultData.length;i<len;i++){
		var li = document.createElement("li");
		var span = document.createElement("span");
		span.innerHTML = resultData[i].substr(0,inputStr.length)
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
	return -1;//如果没有找到，则返回-1
}
function deleteSpan(inpStr){
	/*var pattern = /^<span>(\w+)<\/span>(\w+)$/;
    var strArr = inpStr.match(pattern);
    return strArr[1] + strArr[2];*/
	inpStr = inpStr.replace("<span>","");
	inpStr = inpStr.replace("</span>","")
	return inpStr;
}