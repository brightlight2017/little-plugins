~function(){
	//->createXHR:创建AJAX对象,兼容所有的浏览器,使用惰性思想进行封装处理
function createXHR() {
    var xhr = null, flag = 0;
    var ary = [
        function () {
            return new XMLHttpRequest;
        },
        function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
        }
    ];
    for (var i = 0, len = ary.length; i < len; i++) {
        try {
            var tempFn = ary[i];
            xhr = tempFn();
            //->success
            flag++;
            createXHR = tempFn;
            break;
        } catch (e) {
            //->error
        }
    }
    if (flag === 0) {
        throw new ReferenceError("your browser is not support ajax!");
    }
    return xhr;
}

//->ajax:封装一个AJAX请求数据的方法,以后只要是请求数据,我们直接的调取这个方法执行即可
function ajax(options) {
    //->init parameter
    var _default = {
        url: null,//->请求的URL地址
        type: 'get',//->请求的方式
        dataType: 'json',//->请求回来的数据内容格式,默认是JSON格式的对象(如果写的是JSON,需要在AJAX中把请求回来的字符串转换为JSON格式的对象)
        async: true,//->采用同步还是异步
        data: null,//->设置请求主体中的内容(传递进来的是字符串)
        success: null//->请求成功后执行的回调函数
    };
    //->把用户自己传递进来的某些属性的参数值覆盖默认的参数值,这样_default容纳了我们所需要的所有的参数
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->SEND AJAX
    var xhr = createXHR();

    //->如果当前的请求是GET,我们需要清除缓存:判断之前的URL是否存在问号,有的话用&_=,没有的话用?_=,后面把随机数拼接进去即可
    if (_default.type === 'get') {
        var code = _default.url.indexOf('?') > -1 ? '&' : '?';
        _default.url += code + '_=' + Math.random();
    }

    xhr.open(_default.type, _default.url, _default.async);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            var text = xhr.responseText;

            //->如果设定dataType='json'的话,我们需要把获取的数据转换为JSON格式的对象
            if (_default.dataType === 'json') {
                text = "JSON" in window ? JSON.parse(text) : eval('(' + text + ')');
            }

            //->执行我们传递进来的回掉函数,并且把AJAX获取的结果赋值给回调函数
            //if (typeof _default.success === 'function') {
            //    _default.success.call(xhr, text);
            //}
            _default.success && _default.success.call(xhr, text);
        }
    };
    xhr.send(_default.data);
}

window.ajax=ajax;
}()
