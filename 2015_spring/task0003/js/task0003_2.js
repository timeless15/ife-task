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
function Task(id,pid,finish,name,time,text){
	this.id = id;
	this.pid = pid;
	this.finish = finish;
	this.name = name;
	this.time = time;
	this.text = text;
}
//add,delete,show
Item.prototype.show = function(){
	var itemLi = document.createElement("li");
	addClass(itemLi,"item-li");
	itemLi.setAttribute("itemid",this.id);
	itemLi.innerHTML = "<div class='item-wrap'><span class='itemName'>" + this.name + "</span><span class='itemNum'> (" + this.count() +")</span></div><ul class='subitem-ul' pid=" + this.id + "></ul>";
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
	//database update
	arrayDelete(this.id,item.data);
	var subitemIdArr = this.child;
	for(var i=0,len=subitemIdArr.length;i<len;i++){
		var delSubitem = subitem.query(subitemIdArr[i]);
		delSubitem.delete();
	}
	//dom update
	var itemLi = this.dom();
	itemLi.parentNode.removeChild(itemLi);
	delete this;
}
Subitem.prototype.show = function(){
	var subitemUl = item.query(this.pid).dom().childNodes[1];
	var subitemLi = document.createElement("li");
	addClass(subitemLi,"subitem-li");
	subitemLi.setAttribute("subitemid",this.id);
	subitemLi.innerHTML = "<div class='subitem-wrap'><span class='subitemName'>" + this.name + "</span><span class='subitemNum'> (" + this.count() +")</span></div>";
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
	arrayDelete(this.pid)
	arrayDelete(this.id,subitem.data);
	var taskIdArr = this.child;
	for(var i=0,len=taskIdArr.length;i<len;i++){
		var delTask = task.query(taskIdArr[i]);
		delTask.delete();
	}
	//dom update
	var subitemLi = this.dom();
	subitemLi.parentNode.removeChild(subitemLi);
	delete this;
}
Task.prototype.delete = function(){
	//database
	var parentSubitem = subitem.query(this.pid);
	//TODO
	arrayDelete(this.id,task.data);

	delete this;
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
	add:function(id,pid,finish,name,time,text){
		this.data.push(new Task(id,pid,finish,name,time,text));
	},
	query:function(id){
		var taskData = this.data;
		for(var i=0,len = taskData.length;i<len;i++){
			if(taskData[i].id === id){
				return taskData[i];
			}
		}
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
    		item.add(itemData[itemData.length-1].id+1,inputValue,[]);
    	}else{ //add subitem
    		var subitemData = subitem.data;
    		subitem.add(subitemData[subitemData.length-1].id+1,selectedID,inputValue,[])
    	}
    	$(".modal").style.display = "none";
	},
	cancelItem:function(e){
		e.preventDefault();
    	$(".modal").style.display = "none";
	}

};

function initial(){
	initDataBase();
	item.showAll();
	subitem.showAll();
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
function find
initial();

