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
                temp[i]=cloneObject(a);
            }
            clone = temp;
            delete temp;
            break;
        case "[object Object]":
            var temp={};
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
    var reg = /^(\w+\.)*\w+\@\w+(\.\w+)+$/;
    return reg.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    var reg = /^1\d{10}$/;
    return reg.test(phone);
}

