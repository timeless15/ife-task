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
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
	console.log(ev.target.id)
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(data)
    ev.target.appendChild(document.getElementById(data));
}