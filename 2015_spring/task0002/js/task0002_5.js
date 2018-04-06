//user-select跨浏览器
//使用mouse事件时，要将draggable设为false默认值，否则会由问题
function eventDelegate(element, tag, eventName, listener) {
    element.addEventListener(eventName,function(e){
        var event = e || window.event;
        var target = event.target || event.srcElement;
        if (target && target.tagName === tag.toUpperCase()) {
            listener.call(target, event);
        }
    })
}

var conLeft = $(".con")[0];
var conRight = $(".con")[1];
/*
//drop事件应用于被放置的对象
conLeft.addEventListener("dropenter",dropenter);
conRight.addEventListener("dropenter",dropenter);
//默认元素不能被拖拽进入其他元素
conLeft.addEventListener("dragover",allowDrop);
conRight.addEventListener("dragover",allowDrop);
conLeft.addEventListener("dragleave",allowDrop);
conRight.addEventListener("dragleave",allowDrop);
conLeft.addEventListener("drop",drop);
conRight.addEventListener("drop",drop);

//drag事件应用于被拖拽的对象
eventDelegate(conLeft,"div","dragstart",dragstart);
eventDelegate(conRight,"div","dragstart",dragstart);
eventDelegate(conLeft,"div","drag",drag);
eventDelegate(conRight,"div","drag",drag);
eventDelegate(conLeft,"div","dragend",dragend);
eventDelegate(conRight,"div","dragend",dragend);
//将div的属性值设为drabble
for(var i=0,len=conLeft.children.length;i<len;i++){
    conLeft.children[i].setAttribute("draggable",true);
    conRight.children[i].setAttribute("draggable",true);
}*/

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
    initPosition(conLeft);
    initPosition(conRight);
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

//initial set top value
initPosition(conLeft);
initPosition(conRight);
eventDelegate(conLeft,"div","mousedown",mouseDown);
eventDelegate(conRight,"div","mousedown",mouseDown);

function initPosition(block){
    var childs = block.children;
    for(var i = 0,len=childs.length;i<len;i++){
        childs[i].style.top = 60*i + 2 + "px";
        childs[i].style.left = "";
    }
}
function outOfScreen(e){
    var maxW = window.innerWidth;
    var maxH = window.innerHeight;
    return e.clientX<=0 || e.clientX>=maxW || e.clientY<=0 || e.clientY>=maxH
}
function judgeIn(x,y,block){
    var x0 = getPosition(block).x;
    var y0 = getPosition(block).y;
    var x1 = x0 + block.offsetWidth;
    var y1 = y0 + block.offsetHeight;
    return x > x0 && x < x1 && y > y0 && y < y1;
}
function mouseDown(ev){
    var target = ev.target;
    var parent = target.parentNode;
    /*鼠标位置
    var mouseX = ev.clientX;
    var mouseY = ev.clientY;
    //div位置
    var divLeft = target.offsetLeft;
    var divTop = target.offsetTop;*/
    var deltaY = target.offsetTop - ev.clientY;
    var deltaX = target.offsetLeft - ev.clientX;

    target.style.opacity = "0.5";
    
    var firstMove = true;

    document.onmousemove = function(e){
        if(firstMove){
            parent.removeChild(target);
            parent.parentNode.appendChild(target);//target在main下
        }
        firstMove = false;
        var currentX = e.clientX;
        var currentY = e.clientY;

        if(outOfScreen(e)){
            target.parentNode.removeChild(target);
            parent.appendChild(target);
            initPosition(parent);
            document.onmousemove = null;
        }else{
           target.style.top = currentY + deltaY + "px";
           target.style.left = currentX + deltaX + "px";
           initPosition(parent); 
        }
    }
    document.onmouseup = function(e){
        document.onmousemove = null;
        document.onmouseup = null;

        target.style.opacity = "1";
        target.parentNode.removeChild(target);

        if(judgeIn(e.clientX,e.clientY,conLeft)){
            conLeft.appendChild(target);
            initPosition(conLeft);
        }
        else if(judgeIn(e.clientX,e.clientY,conRight)){
            conRight.appendChild(target);
            initPosition(conRight);
        }
        else{
            parent.appendChild(target);
            initPosition(parent);
        }
    }
    return false;
}
