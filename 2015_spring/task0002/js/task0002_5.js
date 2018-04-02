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

$(".con")[0].addEventListener("drop",drop);
$(".con")[0].addEventListener("dragover",allowDrop);
$(".con")[1].addEventListener("drop",drop);
$(".con")[1].addEventListener("dragover",allowDrop);
eventDelegate($(".con")[0],"div","dragstart",drag);
eventDelegate($(".con")[1],"div","dragstart",drag);

function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}