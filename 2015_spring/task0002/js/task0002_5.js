//user-select跨浏览器
function eventDelegate(element, tag, eventName, listener) {
	element.addEventListener(eventName,function(e){
		var event = e || window.event;
        var target = event.target || event.srcElement;
        if (target && target.tagName === tag.toUpperCase()) {
            listener.call(target, event);
        }
	})
}
//drop事件应用于被放置的对象
$(".con")[0].addEventListener("dropenter",dropenter);
$(".con")[1].addEventListener("dropenter",dropenter);
//默认元素不能被拖拽进入其他元素
$(".con")[0].addEventListener("dragover",allowDrop);
$(".con")[1].addEventListener("dragover",allowDrop);
$(".con")[0].addEventListener("dragleave",allowDrop);
$(".con")[1].addEventListener("dragleave",allowDrop);
$(".con")[0].addEventListener("drop",drop);
$(".con")[1].addEventListener("drop",drop);

//drag事件应用于被拖拽的对象
eventDelegate($(".con")[0],"div","dragstart",dragstart);
eventDelegate($(".con")[1],"div","dragstart",dragstart);
eventDelegate($(".con")[0],"div","drag",drag);
eventDelegate($(".con")[1],"div","drag",drag);
eventDelegate($(".con")[0],"div","dragend",dragend);
eventDelegate($(".con")[1],"div","dragend",dragend);

function dragstart(ev) {
	//dragstart设置的style是拖拽起来的对象
	ev.target.style.opacity = "0.4";
    ev.dataTransfer.setData("text", ev.target.id);
}
function drag(ev){
	//drag设置的style是拖拽以后留在原处的
	ev.target.style.backgroundColor = "black";
}
function dragend(ev){
	//deagend时 drag和dragstart设置的style都会被应用
	ev.target.style.opacity = "1";
	ev.target.style.backgroundColor = "red";
}
function dropenter(ev){
	console.log(ev.target);
    ev.target.style.border = "2px dotted red";
}
function dropleave(ev){
	event.target.style.border = "";
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

/*Mouse Event*/
