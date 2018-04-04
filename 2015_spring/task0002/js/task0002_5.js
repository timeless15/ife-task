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
/*
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
eventDelegate($(".con")[1],"div","dragend",dragend);*/

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
//client-鼠标先对于当前window的位置(即如果有scroll，获得的值还是相对于当前screen）；
//movement-鼠标相较于上一次mousemove事件，移动的相对位置
//offset-鼠标相对于目标元素的位置，就是鼠标点下去的位置相对点的元素边缘的位置；
//page鼠标相对于document的位置；
//screen-鼠标相对于screen的位置

//事件顺序： mousedown 原来容器内的元素remove，同时把元素放到再上一层的容器中，跟随鼠标移动。
//mouseup： 把元素放append到另一个容器
function mouseDown(ev){
    var target = ev.target;
    var parent = target.parentNode;
    target.style.opacity = "0.5";
    parent.removeChild(target);
    parent.parentNode.appendChild(target);
    //console.log(target,parent);

}
function mouseMove(ev){

}
eventDelegate($(".con")[0],"div","mousedown",mouseDown);
$(".main")[0].addEventListener("mousemove",mouseMove);
