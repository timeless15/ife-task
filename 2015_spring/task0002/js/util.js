/*2. JavaScript数据类型及语言基础*/
// 判断arr是否为一个数组，返回一个bool值
function isArray(arr){
    return Array.isArray(arr);
}
// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn){
    return Object.prototype.toString.call(fn) =="[object Function]" ? true : false;
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
//https://www.jianshu.com/p/b0f323691cca
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
function cloneObject(src){
    var clone;
    switch (Object.prototype.toString.call(src)){
        case "[object Number]" :
            clone = (typeof src==='object'?new Number(src):parseInt(src.toString()));
            break;
        case "[object String]" :
            clone = (typeof src==="object"?new String(src):src.toString());
            break;
        case "[object Boolean]" :
            clone = (typeof src==="boolean"? new Boolean(src):src);
            break;
        case "[object Date]":
            clone = new Date(src);
            break;
        case "[object Array]":
            var temp = new Array();
            for(var i=0,a;a=src[i];i++){
                 //temp.push(cloneObject(a))，数组遍历，使用push的方法会使所有的元素变成undefined
                 //???试了一下push方法没有问题
                temp[i]=cloneObject(a);
            }
            clone = temp;
            delete temp;
            break;
        case "[object Object]":
            var temp={};
            //object自带keys的方法，得到的结果是数组
            var keys = Object.keys(src);
            for(var i=0,a;a=keys[i];i++){
                temp[a]=cloneObject(src[a]);
            }
            clone = temp;
            delete temp;
            break;
        default:
            break;
    }
    return clone;
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr){
    var result = cloneObject(arr);
    for(var i=0;i<arr.length;i++){
        var temp1 = arr[i];
        var flag = true;
        for(var j=0;j<result.length;j++){
            var temp2=result[j];
            if(temp1==temp2){
                if(flag==true) {
                    flag=false;
                    continue;
                }
                else {
                    result.splice(j,1);
                    flag = false;
                }
            }
        }
    }
    return result;
}
function uniqArray2(arr){
    var result=[];
    for(var i=0;i<arr.length;i++){
        if(result.indexOf(arr[i])==-1){
            result.push(arr[i]);
        }
    }
    return result;
}

// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
    var result="";
    for(var i=0;i<str.length;i++){
        if(str[i]!=" " && str[i]!="\t") break;
    }
    for(j=str.length-1;j>=0;j--){
        if(str[j]!=" " && str[j]!="\t") break;
    }
    result = str.slice(i,j+1);
    return result;
}
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str){
    var reg = /^\s+|\s+$/g;
    return str.replace(reg,"");
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr,fn){
    for(var i=0;i<arr.length;i++){
        fn(arr[i],i);
    }
}
// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj){
    return Object.keys(obj).length;
}
function getObjectLength2(obj){
    var count=0;
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            count++;
        }
    }
    return count;
}
// 判断是否为邮箱地址
function isEmail(emailStr) {
    //.可以出现在@前 ，后缀域名可以有多个
    var reg = /^(\w+\.)*\w+\@\w+(\.\w+)+$/;
    return reg.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    var reg = /^1\d{10}$/;
    return reg.test(phone);
}

/*DOM*/
// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    element.className+=" "+newClassName;
    //element.classList.add(newClassName);
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    var classNames = element.className.split(/\s+/);
    for (var i = 0, len = classNames.length; i < len; i++) {
        if (classNames[i] === oldClassName) {
            classNames.splice(i, 1);
            break;
        }
    }
    element.className = classNames.join(' ');
    //element.classList.remove(oldClassName);
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    //和parentNode的区别，parentElement returns null if the parent node is not an element node，一般parentNode使用更多
    return element.parentElement === siblingNode.parentElement;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    return {
        x:element.getBoundingClientRect().left,
        y:element.getBoundingClientRect().top
    };//offsetTop/Left 是相对于parent的位置，如果滚动的话offset值是会超过整屏的
}

// 实现一个简单的Query
function $(selector) {
   selector = selector.trim();
   var result = [];
   if(!selector) return null;
   if(selector==document) return document;
   if(selector.indexOf("=")==-1){//只有一个元素，直接查询
        result = miniQuery(selector);
   }
   else{
        var selectorArr = selector.split(/\s+/);
        var root = miniQuery(selectorArr[0],document);
        for(var i=1,len=selectorArr.length;i<len;i++){
            var temp = miniQuery(selector[i],root);
            root = temp;
        }
        result = root;
   }
   return result;//miniQuery直接返回元素列表中的第一个元素，简化
}
function miniQuery(selector,root){
    var result =[],
        content = selector.substr(1),
        childs = null,
        regSelect = new RegExp("\\b" + content + "\\b");
    root = root || document;
    switch (selector[0]){
        case '#': //id
            //getElementById只能被document调用，因为id全局只有一个
            //而getElementsByClass可以被element调用
            result.push(document.getElementById(content));
            break;
        case '.': //class
            if(root.getElementsByClassName(content)){
                result.push(root.getElementsByClassName(content));
            //getElementsByClasName在ie8以下不适用
            }else{
                childs = root.getElementsByTagName("*");
                for(var i=0;i<childs.length;i++){
                    var classStr = childs[i].getAttribute("class");
                    if (regSelect.test(classStr))
                        result.push(childs[i]);
                }
            }
            break;
        case '[': //attr
            //没有属性值
            if(selector.indexOf("=")===-1){
                childs = root.getElementsByTagName("*");
                for(var i=0;i<childs.length;i++){
                    if(childs[i].getAttribute(selector.slice(1,-1))!==null){
                        result.push(childs[i]);
                    }
                }
            }
            //有属性值
            else{
                var eindex = selector.indexOf("="),
                    key = select.slice(1,eindex),
                    value = select.slice(eindex+1,-1);
                childs = root.getElementsByTagName("*");
                for(var i=0;i<childs.length;i++){
                    if(childs[i].getAttribute(key)===value){
                        result.push(childs[i]);
                    }
                }
                
            }
            break;
        default: //tag
            result.push(root.getElementsByTagName(selector));
            break;
    }
    return result[0];
}

/*Event*/
// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    element.addEventListener(event,listener);
}
// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
    element.removeEventListenr(event,listener);
}
// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element,"click",listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    addEvent(element,"keydown",function(event){
        if(event.keyCode==13){ //keycode返回按下键的数组，enter是13
            listener();
        }
    });
}

//将函数与$绑定
$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;

function clickListener(event) {
    console.log(event);
}
function renderList() {
    $("#list").innerHTML = '<li>new item</li>';
}

function init() {
    each($("#list").getElementsByTagName('li'), function(item) {
        $.click(item, clickListener);
    });
    $.click($("#btn"), renderList);//rederList后面如果直接加（），函数会立即执行，ul更新为新的内容
}
//init();
// 事件代理
function delegateEvent(element, tag, eventName, listener) {
    $.on(element,eventName,function(e){
        var target = e.target || e.srcElement;
        if(target.nodeName == tag.toUpperCase() ){
            $.click(target,listener);
        }
    })
}
$.delegate = delegateEvent;
//$.click($("#btn"), renderList);
//$.delegate($("#list"), "li", "click", clickListener);

/*BOM*/
// 判断是否为IE浏览器，返回-1或者版本号
//IE11 "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0) like Gecko"
//IE10 "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)"
//IE9  "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)"
//IE8  "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)"
function isIE() {
    var s = navigator.userAgent;
    //11和10及以下不同
    s=s.match((/msie\s([\d.]+)/i) || (/rv\:([\d.]+)/i));
    if(s) return s[1]
    else return -1
}

// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
    var d = new Date();
    d.setTime(d.getTime()+(expiredays*24*60*60*1000));
    var expires ="expires="+d.toUTCString();
    document.cookie=cookieName+"="+encodeURIComponent(cookieValue)+";"+expires+";path=/"
}

// 获取cookie值
function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for(var i=0;i<ca.length;i++){
        var c = ca[i];
        while(c.charAt[0]==' '){
            c = c.substring(1);
        }
        if(c.indexOf(name)==0){
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

/*AJAX*/
// 学习Ajax，并尝试自己封装一个Ajax方法。实现如下方法：
/*options是一个对象，里面可以包括的参数为：
    type: post或者get，可以有一个默认值
    data: 发送的数据，为一个键值对象或者为一个用&连接的赋值字符串
    onsuccess: 成功时的调用函数
    onfail: 失败时的调用函数*/

function ajax(url, options) {
    //先处理data数据，如果data是obejct，要转换为&连接的字符串
    var dataR = options.data;
    if(typeof dataR == 'object' ){
        var str = ""
        for(var key in dataR){
            str += key + "=" + dataR[key] + "&";
        }
        dataR = str.slice(0,-1);//去掉最后一个&
    }

    var type = options.type || 'GET';//默认为get

    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObjec("Microsoft.XMLHTTP");
    
    xmlhttp.open(type,url,true);

    if(type == 'GET'){
        xmlhttp.send();
    }
    else {
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        //setRequestHeader要在open之后，send之前调用，后面的值针对不同的协议是固定的，上面的写法规定了http协议
        xmlhttp.send();
    }
    
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 ){
            if(xmlhttp.status==200)
                options.onsuccess(xmlhttp.responseText,xmlhttp.responseXML);
            else{
                if(options.onfail){
                    options.onfail();
                }
            }
                
        }
    }
    
}

// 使用示例：
/*ajax(
    'http://localhost:8080/server/ajaxtest', 
    {
        data: {
            name: 'simon',
            password: '123456'
        },
        onsuccess: function (responseText, xhr) {
            console.log(responseText);
        }
    }
);*/
