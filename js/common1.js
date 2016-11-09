'use strict';

/**
 * 顶部通知条模块
 * 
 */
(function () {
	var tips=document.getElementById('J_top-tips');
	var tipsClose=document.getElementById('J_tips-close');
	tips.style.display='none';
	var cookies=getCookie();
	/*var cookies=document.cookie;*///读取cookie
	/*console.log(cookies);*/
	/*var k='tipsHidden=1';*/
	if (!cookies.tipsHidden) {//判断cookie中是否存在'tipsHidden=1'值
		tips.style.display='block';//如过不存在，则显示tips通知条
		addEventListener(tipsClose,'click', function () {
		tips.style.display='none'; //添加鼠标点击事件，点击关闭通知条
		setCookie('tipsHidden',1)		//并在cookie上加上内容
		/*console.log(document.cookie);*/
		})
	}/*else {
		tips.style.display='none';//如果判断不存在
	} */
	
})();
/*
获取cookie并转化成对象
 */
function getCookie() {
	var cookie = {};
	var all = document.cookie;
	if (all === '') return cookie;
	var list = all.split('; ');
	for (var i = 0, len = list.length; i < len; i++) {
		var item = list[i];
		var p = item.indexOf('=');
		var name = item.substring(0, p);
		name = decodeURIComponent(name);
		var value = item.substring(p + 1);
		value = decodeURIComponent(value);
		cookie[name] = value;
	}
	return cookie;
}

/*
设置cookie
 */

function setCookie(name, value, expires, path, domain, secure) {
	var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	if (expires)
		cookie += '; expires=' + expires.toGMTString();
	if (path)
		cookie += '; path=' + path;
	if (domain)
		cookie += '; domain=' + domain;
	if (secure)
		cookie += '; secure=' + secure;
	document.cookie = cookie;
}
/*删除cookie*/
function removeCookie(name) {
	document.cookie = name+'= '+'; max-age=0';
}
/*
ajax封装
 */
function ajax(data) {
	//第一步 创建ajax对象
	var xhr = null;
	if (window.XMLHttpRequest) { //标准浏览器
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject("Microsoft.XMLHTTP"); //低版本IE
	}

	//第二部 准备发送一些请求
	var type = data.type == 'get' ? 'get' : 'post'; //请求方式
	var url = ''; //请求地址
	if (data.url) {
		url = data.url;
	}
	var flag = data.asyn == 'true' ? 'true' : 'false'; //请求方式，默认是true表示异步，false表示同步

	xhr.open(type, url, flag);

	//第三步 执行发送的动作
	xhr.send(null);

	//第四步 指定回调函数

	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {//this指向xhr，4 浏览器已经接收到服务器返回的数据
			if (this.status==200) { //200表示http请求成功，404表示页面找不到，503服务器端有错
				/*var jsdata=JSON.parse(this.responseText)*/
				data.success(this.responseText);//接收服务器返回的数据
			}
		}
	}
}
/*(function () {
	var data={
		type:'get',//请求方式
		//请求地址
		//{
		//pageNo:当前页码
		//psize:每页返回数据个数
		//type:筛选类型（ 10：产品设计； 20： 编程语言）
		//}
		url:'http://study.163.com/webDev/couresByCategory.htm?pageNo=1&psize=10&type=10',
		//同步异步方式
		asyn:true,
		success:fn
	}
	function fn (e) {
		console.log(e)
	}
	console.log(data);
	console.log(ajax(data)) ;

})();*/



/*
获取课程列表模块
 */
function addEventListener(el, e, fun) {
		if (el.addEventListener) {
			el.addEventListener(e, fun, false);
		} else if (el.attachEvent) { //兼容旧ie版本
			el.attachEvent('on'+e, fun);
		}
}

(function () {
	/*
	兼容ie的添加事件函数
	参数：el 事件对象；e 事件类型；fun 事件触发函数
	 */
	
	//给选项卡添加鼠标点击事件
	var JCourseTabes=document.getElementById('J_course-tabs');
	var preocutDesin=JCourseTabes.children[0];
	var proLanguage=JCourseTabes.children[1];
		/*设置发送请求的参数*/
	var sendData = {
		type:'get',//请求类型
		pageNo:1,//当前页数
		psize:20,//每页返回数据个数
		stype:10,//筛选类型（ 10：产品设计； 20： 编程语言）
		asyn: true,
		url: '//study.163.com/webDev/couresByCategory.htm' + '?pageNo=' + 1 + '&psize=' + 20 + '&type=' + 10,
		sendUrl: function() {
			sendData.url = '//study.163.com/webDev/couresByCategory.htm' + '?pageNo=' + sendData.pageNo + '&psize=' + sendData.psize + '&type=' + sendData.stype;
		}
	}
	
	/*console.log(sendData);*/
	/*设置回调函数*/
	sendData.success=function (datas) {
		/*console.log(e);*/
		var e=JSON.parse(datas)
		var course=document.getElementById('J_course');
		course.innerHTML='';
		/*遍历获取到的课程数据，添加到li列表*/
		for (var i = 0; i < e.list.length; i++) {
			var eprice=e.list[i].price==0?'免费':'￥'+e.list[i].price;//如果价格为0，则显示免费
			course.innerHTML+='<li>'+
								  '<img src='+e.list[i].middlePhotoUrl+'>'+
							  	  '<h3>'+e.list[i].name+'</h3>'+
							      '<span>'+e.list[i].provider+'</span>'+
							 	  '<i>'+e.list[i].learnerCount+'</i>'+
							 	  '<em>'+eprice+'</em>'+
						 	  '</li>';
		}
		
		
	}	
	
	ajax(sendData);//初始化数据


	/*切换选项卡*/
	/*当选中产品设计时*/
	addEventListener(preocutDesin,'click',function () {
		preocutDesin.className='select';
		proLanguage.className='';
		sendData.pageNo=1;
		sendData.stype=10;
		pages(1)()
		/*sendData.sendUrl();
		ajax(sendData);*/
	});
		/*当选中编程语言时*/
	addEventListener(proLanguage,'click',function () {
		proLanguage.className='select';
		preocutDesin.className=''; 
		sendData.stype=20;
		/*sendData.sendUrl();
		ajax(sendData);*/
		pages(1)();
	});
	
	var page=document.getElementById('J_course_page');
	var lis=page.getElementsByTagName('li');
	/*封装一个页面函数*/
	function pages (i) {
		return function () {
			sendData.pageNo=i;//获取要打开的页码*/
			/*console.log(sendData);*/
			for (var j=0;j<lis.length;j++){
				lis[j].className='';
			}
			lis[i-1].className='select';
			sendData.sendUrl();
			ajax(sendData);

		}
	}


	/*添加鼠标点击事件，点击页码进入相应的页面*/
	for (var i = 0; i < lis.length; i++) {
		addEventListener(lis[i],'click',pages(i+1));
	}

	/*前一页和后一页*/
	var prePage=document.getElementById('J_course_prepage');
	var nextPage=document.getElementById('J_course_nextpage');
	/*前一页*/
	addEventListener(prePage,'click',function () {
		/*alert(sendData.pageNo);*/
		if (sendData.pageNo>1) {
			pages(sendData.pageNo-1)();
		}
	})
	/*后一页*/
	nextPage.onselectstart='return false';
	addEventListener(nextPage,'click',function () {
		if (sendData.pageNo<lis.length) {
			pages(sendData.pageNo+1)();
		}
	})
})();
/**
 * 登录弹窗模块
 */

! function() {



	var closelg = document.getElementById("J_close_loginwd");
	var loginwd = document.getElementById('J_login');
	var loginbg = document.getElementById('J_loginbg')

	/*点击x关闭登录框*/
	addEventListener(closelg, 'click', function() {
		loginwd.style.display = 'none';
		document.body.style.overflow='auto';
	})
	addEventListener(loginbg, 'click', function() {
			document.body.style.overflow='auto';
			loginwd.style.display = 'none';
		})
		/**
		 * 登录表单验证
		 */
	var userName = document.getElementById('userName');
	var password = document.getElementById('password');
	var button = document.getElementById('J_login_buttom');
	var tips = document.getElementById('J_login_validation');
	/*输入框鼠标焦点事件，清空内容*/
	addEventListener(userName, 'focus', function(event) {
		var e = event || window.event;
		var target = e.target || e.srcElement;
		target.value = '';
		/*console.log(e.srcElement);*/

	});
	addEventListener(password, 'focus', onFocus)

	function onFocus(event) {
		var e = event || window.event;
		var target = e.target || e.srcElement;
		target.value = '';
	}
	/**
	 * 登陆按钮点击事件
	 * 判断是否已经输入账号密码
	 * 把输入的账号密码进行md5加密，传送给后台，根据返回的数据判断是否输入正确
	 */

	addEventListener(button, 'click', function(e) {
		var e = e || window.event;
		console.log(userName.value);
		console.log(password.value);
		var data = {
				type: 'get', //请求类型
				asyn: true,
				url: '//study.163.com/webDev/login.htm' + '?userName=' + MD5(userName.value) + '&password=' + MD5(password.value)
			}
			/*处理服务器返回数据的回调函数*/
		data.success = function(data) {
			if (data == 0) {
				/*如果账号密码错误，提示用户继续输入*/
				tips.innerHTML = '账号或密码错误!请重新输入！';
			} else {
				tips.innerHTML = '';
				/*如果账号密码正确，执行函数*/
				/*设置登录cookie*/
				setCookie('loginSuc', 1)
				loginSuccessful();
				document.body.style.overflow='auto';
			}
		};
		/*向服务器发送请求之前先判断用户是否已经输入*/
		if (userName.value == '') {
			tips.innerHTML = '请输入账号!'
		} else if (password.value == '') {
			tips.innerHTML = '请输入密码!'
		} else {
			/*如果用户已经输入，则向服务器发送请求*/
			ajax(data);
		}

		/*阻止默认的button事件*/
		stopDefault(e);
	})

	/*关注模块*/
	var attention = document.getElementById('J_attention');
	var focused = document.getElementById('J_focused');
	var fans = document.getElementById('J_fans');
	var cFocuse = focused.getElementsByTagName('span')[0];
	/*如果已登录并且已经关注，直接调用关注成功函数*/
	if (getCookie().loginSuc && getCookie().followSuc) {
		attentioned();
	}
	/**
	 * 给关注按钮添加点击事件，
	 * 首先登录的cookie是否已经设置(loginSuc);
	 * 如未设置，则弹出登录框;
	 */
	addEventListener(attention, 'click', function() {
		/*alert(1);*/
		var cookies = getCookie();
		/*查看本地cookie，如果登录的cookie没有设置，则弹出登录框登录*/
		if (!cookies.loginSuc) {
			loginwd.style.display = 'block';
			document.body.style.overflow='hidden';
		} else {
			/*如果已经设置登录cookie,直接调用登录成功函数发送关注请求*/
			loginSuccessful();
		}
	})


	/**
	 * 登录成功调用函数：
	 * 设置登录cookie(loginSuc)
	 * 调用关注API，并设置关注成功的cookie（followSuc）
	 * “关注”按钮变成不可点的“已关注”状态。
	 */
	function loginSuccessful() {
		
		
			//调用关注api,并设置关注成功的cookie（followSuc）
		var data = {
			type: 'get',
			asyn: true,
			url: 'http://study.163.com/webDev/attention.htm',
		};
		data.success = function(data) {
			if (data == 1) {
				attentioned();
				setCookie('followSuc', 1);
				console.log(data);
			}
		}
		ajax(data);
	}
	/**
	 * 关注成功后调用函数
	 * @return {[type]} [description]
	 */
	function attentioned() {

		attention.style.visibility = 'hidden';
		focused.style.display = 'block';
		fans.style.marginLeft = '60px';
		loginwd.style.display = 'none';

	}
	/*取消关注*/
	addEventListener(cFocuse, 'click', function() {
		attention.style.visibility = 'visible';
		focused.style.display = 'none';
		fans.style.marginLeft = '14px';
		removeCookie('followSuc');
	})

}();
/**
 * 阻止浏览器默认事件函数兼容写法
 
 */
function stopDefault(e) {
	//阻止默认浏览器动作(W3C) 
	if (e && e.preventDefault)
		e.preventDefault();
	//IE中阻止函数器默认动作的方式 
	else
		window.event.returnValue = false;
	return false;
}
