function Item(id,name,child){
	this.id = id;
	this.name = name;
	this.child = child;
}
function Subitem(id,pid,name,child){
	this.id = id;
	this.pid = pid;
	this.name = name;
	this.child = child;
}
//Subitem.prototype = Object.create(Item.prototype);
//Subitem.prototype.constructor = Subitem;
function Task(id,pid,finish,name,date,text){
	this.id = id;
	this.pid = pid;
	this.finish = finish;
	this.name = name;
	this.date = date;
	this.text = text;
}
//add,delete,show
Item.prototype.show = function(){
	var itemLi = document.createElement("li");
	addClass(itemLi,"item-li");
	itemLi.setAttribute("itemid",this.id);
	itemLi.innerHTML = "<div class='item-wrap' onclick='handlers.itemClick(this)'><span class='itemName'>" + this.name + "</span><span class='itemNum'> (" + this.count() +")</span><button class='deleteBtn' onclick='handlers.delete(this)'></button></div><ul class='subitem-ul' pid=" + this.id + "></ul>";
	$(".item-ul").appendChild(itemLi);
}
Item.prototype.dom = function(){ // return li
	var itemLis = document.querySelectorAll("li.item-li");
	for(var i=0,len=itemLis.length;i<len;i++){
		if (parseInt(itemLis[i].getAttribute("itemid")) === this.id){
			return itemLis[i];
		}
	}
}
Item.prototype.count = function(){
	var itemChild = this.child, //subitem id
		result = 0;
	for(var i=0,len=itemChild.length;i<len;i++){
		result += subitem.query(itemChild[i]).count();
	}
	return result;
}
Item.prototype.delete = function(){
	//database update parent,self,child
	var subitemIdArr = this.child;
	for(var i=0,len=subitemIdArr.length;i<len;i++){
		var delSubitem = subitem.query(subitemIdArr[0]);
		delSubitem.delete();
	}
	arrayDelete(this.id,item.data);
	//dom update
	var itemLi = this.dom();
	itemLi.parentNode.removeChild(itemLi);
	delete this;
}
Item.prototype.click = function(){
	for(var i=0,len=this.child.length;i<len;i++){
		subitem.query(this.child[i]).click();
	}
	removeClass(document.querySelector(".item-ul .select"),"select");
	addClass(this.dom(),"select");
}
Item.prototype.update = function(){
	var itemNum = this.dom().getElementsByClassName('itemNum')[0];
	itemNum.innerHTML = " (" + this.count() + ")"
}
Subitem.prototype.show = function(){
	var subitemUl = item.query(this.pid).dom().childNodes[1];
	var subitemLi = document.createElement("li");
	addClass(subitemLi,"subitem-li");
	subitemLi.setAttribute("subitemid",this.id);
	subitemLi.innerHTML = "<div class='subitem-wrap' onclick='handlers.subitemClick(this)'><span class='subitemName'>" + this.name + "</span><span class='subitemNum'> (" + this.count() +")</span><button class='deleteBtn' onclick='handlers.delete(this)'></button></div>";
	subitemUl.appendChild(subitemLi);
}
Subitem.prototype.dom = function(){ // return li
	var subitemLis = document.querySelectorAll("li.subitem-li");
	for(var i=0,len=subitemLis.length;i<len;i++){
		if (parseInt(subitemLis[i].getAttribute("subitemid")) === this.id){
			return subitemLis[i];
		}
	}
}
Subitem.prototype.count = function(){
	return this.child.length;
}
Subitem.prototype.delete = function(){
	//database update
	var parentArr = item.query(this.pid).child;
	parentArr.splice(parentArr.indexOf(this.id),1);
	var taskIdArr = this.child;
	for(var i=0,len=taskIdArr.length;i<len;i++){
		var delTask = task.query(taskIdArr[0]); //taskIdArr会随着delTask.delete而更新
		delTask.delete();
	}
	arrayDelete(this.id,subitem.data);
	//dom update
	var subitemLi = this.dom();
	subitemLi.parentNode.removeChild(subitemLi);
	item.query(this.pid).update();
	delete this;
}
Subitem.prototype.click = function(){
	for(var i=0,len=this.child.length;i<len;i++){
		task.query(this.child[i]).show();
	}
	removeClass(document.querySelector(".item-ul .select"),"select");
	addClass(this.dom(),"select");
}
Subitem.prototype.update = function(){
	var subitemNum = this.dom().getElementsByClassName('subitemNum')[0];
	subitemNum.innerHTML = ' (' + this.count() + ')';
}

Task.prototype.show = function(){
	var taskLi = document.createElement("li");
	taskLi.innerHTML = "<div class='task-wrap'><span class='task-time'>" + this.date + "</span><span class='task-name' onclick='handlers.taskClick(this)' taskid=" + this.id + ">" + this.name + "</span></div>";
	if(this.finish == true){
        taskLi.getElementsByClassName("task-name")[0].className += " finish";
    }
	$(".task-list").appendChild(taskLi);
	if(showTask.indexOf(this) == -1) {
		showTask.push(this);
	}
}
Task.prototype.dom = function(){
	var taskSpan = document.querySelectorAll(".task-list .task-name");
	for(var i=0,len=taskSpan.length;i<len;i++){
		if (parseInt(taskSpan[i].getAttribute("taskid")) === this.id){
			return taskSpan[i];
		}
	}
}
Task.prototype.delete = function(){
	//database
	var parentArr = subitem.query(this.pid).child;
	parentArr.splice(parentArr.indexOf(this.id),1);
	arrayDelete(this.id,task.data);
	delete this;
}
Task.prototype.click = function(){
	$(".show-content").setAttribute("taskid",this.id);
    $(".content-title").innerHTML = this.name;
    $(".content-date").innerHTML = "任务日期: " + this.date;
    $(".content-text").innerHTML = this.text;
    if(this.finish === true){
        $(".content-manipulate").style.display = "none";
    }else {
        $(".content-manipulate").style.display = "block";
    }
    if(document.querySelector(".task-list .select")){
    	removeClass(document.querySelector(".task-list .select"),"select");
    }
	addClass(this.dom(),"select");
}
/*global variable*/
var item = {
	data:[],
	add:function(id,name,child){
		var addItem = new Item(id,name,child);
		this.data.push(addItem);
		addItem.show();
	},
	query:function(id){
		var itemData = this.data;
		for(var i=0,len = itemData.length;i<len;i++){
			if(itemData[i].id === id){
				return itemData[i];
			}
		}
	},
	showAll:function(){
		var itemData = this.data;
		for(var i=0,len = itemData.length;i<len;i++){
			itemData[i].show();
		}
	}
};
var subitem = {
	data:[],
	add:function(id,pid,name,child){
		var addSubitem = new Subitem(id,pid,name,child);
		this.data.push(addSubitem);
		//update parent item
		var parentItem = item.query(pid);
		parentItem.child.push(id);
		addSubitem.show();
	},
	query:function(id){
		var subitemData = this.data;
		for(var i=0,len = subitemData.length;i<len;i++){
			if(subitemData[i].id === id){
				return subitemData[i];
			}
		}
	},
	showAll:function(){
		var subitemData = this.data;
		for(var i=0,len = subitemData.length;i<len;i++){
			subitemData[i].show();
		}
	}
};
var task = {
	data:[],
	add:function(id,pid,finish,name,date,text){
		var addTask = new Task(id,pid,finish,name,date,text);
		this.data.push(addTask);
		var parentSubitem = subitem.query(pid);
		parentSubitem.child.push(id);
		addTask.show();
	},
	query:function(id){
		var taskData = this.data;
		for(var i=0,len = taskData.length;i<len;i++){
			if(taskData[i].id === id){
				return taskData[i];
			}
		}
	},
	showAll:function(){
		var taskData = this.data;
		showTask = [];
		$(".task-list").innerHTML = '';
		for(var i=0,len=taskData.length;i<len;i++){
			taskData[i].show();
		}
	},
	sort:function(){
		
	}
};
//event handler
var handlers = {
	addItem:function(e){
		e.preventDefault();
		var itemData = item.data,
    		selectItem = $(".select-item");
		$(".modal").style.display = "block";
    	$("input.in-itemname").value = "";
    	selectItem.innerHTML = "<option value ='default' itemid='-1'>新增分类</option>";
    	for(var i=0,len=itemData.length;i<len;i++){
    		selectItem.innerHTML +="<option value=" + itemData[i].name + " itemid=" + itemData[i].id + ">" + itemData[i].name + "</option>";
    	}
	},
	confirmItem:function(e){
		e.preventDefault();
		var selectedID = parseInt($(".select-item").selectedOptions[0].getAttribute("itemid"));
    	var inputValue = $("input.in-itemname").value;
    	if(selectedID === -1){ //add item
    		var itemData = item.data;
    		item.add(lastOfArray(itemData).id+1,inputValue,[]);
    	}else{ //add subitem
    		var subitemData = subitem.data;
    		subitem.add(lastOfArray(subitemData).id+1,selectedID,inputValue,[])
    	}
    	$(".modal").style.display = "none";
	},
	cancelItem:function(e){
		e.preventDefault();
    	$(".modal").style.display = "none";
	},
	itemClick:function(target){
		$(".task-list").innerHTML = '';
		showTask = [];
		var itemLi = target.parentNode;
		var itemID = parseInt(itemLi.getAttribute("itemid")),
			clickItem = item.query(itemID);
		clickItem.click();
		$(".content-title").innerHTML = "任务名称";
        $(".content-date").innerHTML = "任务日期";
        $(".content-text").innerHTML = "任务描述";
		if(clickItem.child.length>0){
			if(subitem.query(clickItem.child[0]).child.length>0){
				task.query(subitem.query(clickItem.child[0]).child[0]).click();
			}
		}
		removeClass(document.querySelector(".task-filter .select"),"select");
		addClass($(".task-filter .all"),"select");
		stopHandler(target);
	},
	subitemClick:function(target){
		$(".task-list").innerHTML = '';
		showTask = [];
		var subitemLi = target.parentNode;
		var subitemID = parseInt(subitemLi.getAttribute("subitemid")),
			clickSubitem = subitem.query(subitemID);
		clickSubitem.click();
		$(".content-title").innerHTML = "任务名称";
        $(".content-date").innerHTML = "任务日期";
        $(".content-text").innerHTML = "任务描述";
		if(clickSubitem.child.length>0){
			task.query(clickSubitem.child[0]).click();
		}
		removeClass(document.querySelector(".task-filter .select"),"select");
		addClass($(".task-filter .all"),"select");
		stopHandler(target);
	},
	taskClick:function(target){
		var taskID = parseInt(target.getAttribute("taskid")),	
			clickTask = task.query(taskID);
		clickTask.click();
	},
	addTask:function(e){
		e.preventDefault();
    	$(".show-content").style.display = "none";
    	$(".add-content").style.display = "block";
    	$("input.in-taskname").value="";
    	$("input.in-taskdate").value="";
   		$("textarea.in-tasktext").value="";
	},
	saveTask:function(e){
		e.preventDefault();
		//current select item
		if($(".add-content").getAttribute("edit")=="true"){
			taskID = parseInt($(".show-content").getAttribute("taskid"));
        	var taskEdit = task.query(taskID);
        	taskEdit.name = $("input.in-taskname").value;
        	taskEdit.date = $("input.in-taskdate").value;
       		taskEdit.text = $("textarea.in-tasktext").value;
       		taskEdit.click();
       		//中间栏更新
       		taskEdit.dom().innerHTML = taskEdit.name;
       		taskEdit.dom().previousSibling.innerHTML = taskEdit.date;
		}else{
			var selected = document.querySelector(".item-ul .select"),
			selectedID = 0,
			selectSubitem,selectItem,
			taskData = task.data;
			if(hasClass(selected,"item-head")){ //select all
				selectedID = 0;
			}else if(hasClass(selected,"item-li")){//select item
				var itemID = parseInt(selected.getAttribute("itemid"));
				selectItem = item.query(itemID);
				selectedID = selectItem.child[0];
			}else if(hasClass(selected,"subitem-li")){
				selectedID = parseInt(selected.getAttribute("subitemid"));
			}
			selectSubitem = subitem.query(selectedID);
			selectItem = item.query(selectSubitem.pid);
			task.add(lastOfArray(taskData).id+1,selectedID,false,$("input.in-taskname").value,$("input.in-taskdate").value,$("textarea.in-tasktext").value);
	    	lastOfArray(taskData).click();
	    	selectSubitem.update();
	    	selectItem.update();
	    	handlers.updateAllNum();
		}
		$(".show-content").style.display = "block";
	    $(".add-content").style.display = "none";
	    $(".add-content").setAttribute("edit","false");
	},
	cancelTask:function(e){
		e.preventDefault();
		$(".show-content").style.display = "block";
    	$(".add-content").style.display = "none";
    	$(".add-content").setAttribute("edit","false");
	},
	updateAllNum:function(){
		$(".item-all").innerHTML = task.data.length;
	},
	itemAll:function(e){
		e.preventDefault();
		var selected = document.querySelector(".item-ul .select");
		removeClass(selected,"select");
		addClass(e.target,"select");
		task.showAll();
		task.data[0].click();
	},
	delete:function(target){
		var itemLi = target.parentNode.parentNode;
		var r = confirm("Are you sure to delete this item?");
		if(r == true){
			if(hasClass(itemLi,"subitem-li")){
				var subitemID = parseInt(itemLi.getAttribute("subitemid"));
				var deleteSubitem = subitem.query(subitemID);
				deleteSubitem.delete();
			}
			if(hasClass(itemLi,"item-li")){
				var itemID = parseInt(itemLi.getAttribute("itemid"));
				var deleteItem = item.query(itemID);
				deleteItem.delete();
			}
		}
		handlers.updateAllNum();
		addClass($(".item-head"),"select");
		task.showAll();
		task.data[0].click();
		stopHandler(target);
	},
	edit:function(target){
    	var taskID = parseInt(target.parentNode.parentNode.getAttribute("taskid"));
    	var taskEdit = task.query(taskID);
    	$(".show-content").style.display = "none";
        $(".add-content").style.display = "block";
        $(".add-content").setAttribute("edit","true");
        $("input.in-taskname").value = taskEdit.name;
        $("input.in-taskdate").value = taskEdit.date;
        $("textarea.in-tasktext").value = taskEdit.text;
	},
	finish:function(target){
		var r = confirm("Are you sure to tag it as finished?");
		if( r == true){
			var taskID = parseInt(target.parentNode.parentNode.getAttribute("taskid"));
    		var taskFinish = task.query(taskID);
    		taskFinish.finish = true;
    		addClass(taskFinish.dom(),"finish");
    		taskFinish.click();
		}
	},
	finishFilter:function(target){
		removeClass(document.querySelector(".task-filter .select"),"select");
		addClass(target,"select");
		if(hasClass(target,"finish")){
			$(".task-list").innerHTML = '';
			var flag = 0;
			for(var i=0,len=showTask.length;i<len;i++){
				if(showTask[i].finish === true) {
					showTask[i].show();
					if(flag==0) {
						showTask[i].click();
						flag=1;
					}
				}
			}
		}
		if(hasClass(target,"unfinish")){
			$(".task-list").innerHTML = '';
			var flag = 0;
			for(var i=0,len=showTask.length;i<len;i++){
				if(showTask[i].finish === false) {
					showTask[i].show();
					if(flag==0) {
						showTask[i].click();
						flag = 1;
					}
				}
			}
		}
		if(hasClass(target,"all")){
			$(".task-list").innerHTML = '';
			for(var i=0,len=showTask.length;i<len;i++){
				showTask[i].show();
			}
			showTask[0].click();
		}
	}
};
var showTask = [],showSubItem=0;
function initial(){
	initDataBase();
	item.showAll();
	subitem.showAll();
	task.showAll();
	task.data[0].click();
	handlers.updateAllNum();
}
function initDataBase(){
	item.data.push(new Item(0,'Default',[0]));
	item.data.push(new Item(1,'Work',[1,2]));
	item.data.push(new Item(2,'Life',[3]));
	subitem.data.push(new Subitem(0,0,'Sub Default',[0]));
	subitem.data.push(new Subitem(1,1,'Front End',[1,2,3]));
	subitem.data.push(new Subitem(2,1,'Server',[4]));
	subitem.data.push(new Subitem(3,2,'Food',[]));
	task.data.push(new Task(0,0,false,'Task','2015-06-05','This is a task'));
	task.data.push(new Task(1,1,true,'IFE','2015-05-10','百度ife任务1'));
	task.data.push(new Task(2,1,false,'drools','2015-05-31','研究drools推理引擎'));
	task.data.push(new Task(3,1,true,'Sass','2015-06-31','学习慕课网的视频Sass'));
	task.data.push(new Task(4,2,false,'AMD','2015-07-31','学习AMD'));
}
function arrayDelete(id,array){
    var index = 0;
    for(var i=0,len=array.length;i<len;i++){
        if(array[i].id === id) {
            index = i;
            break;
        }
    }
    return array.splice(index,1);
}
function lastOfArray(array){
	return array[array.length-1];
}
function eventDelegate(element, tag, eventName, listener) {
    element.addEventListener(eventName,function(e){
        var event = e || window.event;
        var target = event.target || event.srcElement;
        if (target && target.tagName === tag.toUpperCase()) {
            listener.call(target, event);
        }
    })
}
function stopHandler(event){
    window.event?window.event.cancelBubble=true:event.stopPropagation();  
}  
initial();
