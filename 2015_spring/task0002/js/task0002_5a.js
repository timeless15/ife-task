function Box(id,top,left,con){
    this.id = id;
    this.top = top;
    this.left = left;
    this.con = con;
}
Box.prototype.initial = function(){
    var box = document.createElement("div"),
        _that = this;
    this.con.appendChild(box);
    addClass(box,"box");
    box.id = this.id;
    box.textContent = this.id;
    box.style.left = this.left + "px";
    box.style.top = this.top + "px";
    box.addEventListener("mousedown",function(e){
        _that.mouseDown(e);
        document.addEventListener("mousemove",function(e){
            _that.mouseMove(e);
        })
        document.addEventListener("mouseup",function(e){
            _that.mouseUp(e);
            return false;
        })
    });
}
Box.prototype.updatePos = function(){
    var parent = this.parent;
    var childs = parent.children;
    for (var i = 0, len = childs.length; i < len; i++) {
        childs[i].style.top = 60 * i + 2 + "px";
        childs[i].style.left = "";
    }
}
Box.prototype.mouseDown = function(e){
    var target = e.target;
    this.target = target;
    this.parent = target.parentNode;
    this.deltaPos = [target.offsetLeft - e.clientX, target.offsetTop - e.clientY,]
    this.firstMove = true;
    target.style.opacity = "0.5";
}
Box.prototype.mouseMove = function(e){
    var target = this.target;
    var parent = this.parent;
    if(this.firstMove){
        parent.removeChild(target);
        parent.parentNode.appendChild(target);
    }
    this.firstMove = false;
    if(outOfScreen(e)){
        target.parentNode.removeChild(target);
        parent.appendChild(target);
        this.updatePos();
        document.onmousemove = null;
    }else{
        target.style.left = e.clientX + this.deltaPos[0] + "px";
        target.style.top = e.clientY + this.deltaPos[1] + "px";
        this.updatePos();
    }
}
Box.prototype.mouseUp = function(e){
    var target = this.target;
    target.style.opacity = "1";
    target.parentNode.removeChild(target);
    if (judgeIn(e.clientX, e.clientY, $(".right-con"))) {
        this.parent = $(".right-con");
    }
    if (judgeIn(e.clientX, e.clientY, $(".left-con"))) {
        this.parent = $(".left-con")
    }
    this.parent.appendChild(target);
    this.updatePos();
    document.onmousemove = null;
    document.onmouseup = null;
}
function judgeIn(x, y, block) {
    var x0 = getPosition(block).x;
    var y0 = getPosition(block).y;
    var x1 = x0 + block.offsetWidth;
    var y1 = y0 + block.offsetHeight;
    return x > x0 && x < x1 && y > y0 && y < y1;
}

function outOfScreen(e) {
    var maxW = window.innerWidth;
    var maxH = window.innerHeight;
    return e.clientX <= 0 || e.clientX >= maxW || e.clientY <= 0 || e.clientY >= maxH;
}
function initial(){
    for (var i = 0; i < 5; i++) {
        var box1 = new Box("left-" + i, 60 * i + 2, "", $(".left-con"));
        var box2 = new Box("right-" + i, 60 * i + 2, "", $(".right-con"));
        box1.initial();
        box2.initial();
    }
}
initial();
