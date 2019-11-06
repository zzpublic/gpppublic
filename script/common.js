/**
 * author : shilinqing & zhangfayi
 * comment: 公共js类
 * @type {{}}
 */
var debug = false; //是否为测试
// 请求加载
var uiLoading = '';

var $cs = {};
var isAndroid = (/android/gi).test(navigator.appVersion);

$cs.isDebug = function(){
    return debug;
}

$cs.getWxAppid = function () {
    return 'wx4e4a8586cb169aab';
}

$cs.fixBarHeader = function(h_el){
    if(h_el){
        $(h_el).css({paddingTop: api.safeArea.top+'px'});
    }
}
$cs.fixBarFooter = function(f_el){
    if(f_el){
        $(f_el).css({paddingBottom: api.safeArea.bottom+'px'});
    }
}
$cs.fph = function(hid,fid,pid){
    var hh = 0;
    var fh = 0;
    if(hid){
        hh = $(hid).height() + api.safeArea.top;
    }
    if(fid){
        fh = $(fid).height() + api.safeArea.bottom
    }
    var ph = api.winHeight - hh - fh + 'px';
    $(pid).css({height:ph})
}
$cs.fpchidren = function(id){
    $(id).parent().css({height:($(id).height() - $('#fid').height() - api.safeArea.top / 2) + 'px'});
}

/**
 * openWin 打开二级页面
 * @param url 跳转地址
 * @param page_name 页面名称
 * @param params array 传递参数
 * @param bgColor 背景色
 */
$cs.toUrl = function(url, page_name, params = {}, bgColor = "#fff", slidBackEnabled = true,animation= 'movein'){

    api.openWin({
        name: page_name,
        url: url,
        rect: { x: 0, y: 0, w: 'auto',h: 'auto'},
        bgColor: bgColor,
        pageParam: params,
        allowEdit:true,
        slidBackEnabled: slidBackEnabled,
        animation:{
            type:animation
        }
    });
}

$cs.toFrame = function(url, page_name, params = {}, rect= { x: 0, y: 0, w: 'auto',h: 'auto'}, bgColor = "#fff", slidBackEnabled = true,animation= 'movein'){
    api.openFrame({
        name: page_name,
        url: url,
        rect: rect,
        bgColor: bgColor,
        pageParam: params,
        slidBackEnabled: slidBackEnabled,
        animation:{
            type:animation
        }
    });
}


$cs.toWin = function (url, winName, opts) {
    if (!url)
        return this.toast(api.winName + "openWin时url不能为空");

    var _opts = {
        name: winName,
        url: url + ".html"
    };

    if (this.isObject(opts)) {
        for (var k in opts) {
            _opts[k] = opts[k];
        }
    }
    api.openWin(_opts);
}

$cs.isObject = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
}
/**
 * 关闭当前页面
 */
$cs.closeWin = function(){
    // api.closeWin()
    window.location.href = './index.html'
}


// storage 操作方法
var uzStorage = function () {
    var ls = window.localStorage;
    if (isAndroid) {
        ls = os.localStorage();
    }
    return ls;
};
// 设置storage
$cs.setStorage = function (key, value) {
    if (arguments.length === 2) {
        var v = value;
        if (typeof v == 'object') {
            v = JSON.stringify(v);
            v = 'obj-' + v;
        } else {
            v = 'str-' + v;
        }
        var ls = uzStorage();
        if (ls) {
            ls.setItem(key, v);
        }
    }
};
// 获取storage
$cs.getStorage = function (key) {
    var ls = uzStorage();
    if (ls) {
        var v = ls.getItem(key);
        if (!v) {
            return;
        }
        if (v.indexOf('obj-') === 0) {
            v = v.slice(4);
            return JSON.parse(v);
        } else if (v.indexOf('str-') === 0) {
            return v.slice(4);
        }
    }
};
// 移除一个storage
$cs.rmStorage = function (key) {
    var ls = uzStorage();
    if (ls && key) {
        ls.removeItem(key);
    }
};
// 清楚全部storage
$cs.clearStorage = function () {
    var old_language = $cs.getStorage('language_type');
    var ls = uzStorage();
    if (ls) {
        ls.clear();
    }
    $cs.setStorage('language_type',old_language);
};
/**
 * 设置路径
 * type:  image：图片路径 ajax:请求路径（默认）
 */
$cs.url = function(type){
    if(debug){
        if(type == 'image'){
            return 'http://10.0.0.49:95/'
        }else if(type == 'ws'){
            return 'ws://jc168.ifc001.com:9501/';
        }else{
            return 'http://192.168.1.122:84/'
        }
    }else{
        //正式
        if(type == 'image'){
            return 'http://www.b01system.com/'
        }else if(type == 'ws'){
            // return 'ws://admin.caihongyule.net:9501/';
            return 'ws://161.117.4.159:9501/';
        }else{
            return 'http://www.b01system.com/'
        }
    }
}
/*加载中——*/
$cs.showProgress = function(title){
    return api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: title || '',
        text: '',
        modal: true
    });
}
/**
 * ajax 请求
 * url : 接口地址
 * data：参数
 * callback ： 回调函数
 * method ： 请求方式   默认：POST   GET
 *  */
$cs.ajax = function(url,data,callback,method){
    if(!method){
        method = 'POST'
    }
    data['version'] = api.appVersion;
    data['token'] = $cs.getStorage('token')
    data['uid'] = $cs.getStorage('uid')

    var _data = {}
    _data.values = data;
    if (data.__file) {
        _data.files = {
            file: data.__file
        }
        delete data.__file;
    }
    var lang = 'zh-cn'
    var language_type = $cs.getStorage('language_type');
    if(language_type){
        language_type = JSON.parse(language_type)
        var old_language_type = language_type.old_language;
        var current_language_type = language_type.language;
        if(current_language_type=='CH'){
          lang = 'zh-cn'
        }else if(current_language_type=='EN'){
          lang = 'en-us'
        }else if(current_language_type=='RS'){
            lang = 'ru-ru'
        }else if(current_language_type=='JP'){
            lang = 'ja-jp'
        }else if(current_language_type=='KR'){
            lang = 'ko-kr'
        }
    }
    console.log('--------'+lang)
    api.ajax({
        url: $cs.url() + url+'?lang='+lang,
        method: method,
        data : _data
    },function(ret,err){
        console.log('参数:' + JSON.stringify(_data))
        console.log('接口:'+$cs.url() + url);
        console.log('返回:'+JSON.stringify(ret))
        if(ret){
            if( ret.code == -1 ){
                $cs.msg(ret.message)
                setTimeout(function(){
                    $cs.toUrl("widget://html/login/index.html",'login','','',false)
                },1000)
            }
            if(typeof callback == 'function'){
                callback(ret)
            }
        }else{
            console.log('报错：' + JSON.stringify(err));
            if(typeof callback == 'function'){
                callback({'success':false,'message':'请求失败'})
            }
        }
    })
}
/**
 * 加载中
 * text ： 加载的提示字符
 */
$cs.loading = function(text){
    var win_h = 0;
    var win_w = 0;
    if(typeof api != 'undefined'){
        win_h = api.winHeight;
        win_w = api.winWidth;
    }else{
        win_h = 560;
        win_w = 375;
    }
    $('body').append('<div id="cs_loading_screen" style="position:fixed !important;top:0;left:0;z-index:9999;height:'+ win_h +'px;width:' + win_w+ 'px; background-color:transparent;" class="bui-panel"></div>');
    uiLoading = bui.loading({
        appendTo:"#cs_loading_screen",
        callback: function (argument) {
            console.log("clickloading")
        }
    });
    uiLoading.show();
    if(!text){
        text = 'loading....'
    }
    uiLoading.text(text);

}
// 关闭加载图标
$cs.hide_loading = function(){
    if(uiLoading){
        uiLoading.hide();
        $('body').remove('#cs_loading_screen');
    }
}
/**
 * toast 显示
 * msg: 要显示的内容
 * location：显示位置，默认：中间， middle  top  bottom
 * duration：时间 以毫秒为单位 默认：2000
 * eg: $cs.toast('测试','middle',2000)
 *  */
$cs.toast = function (msg,location,duration){
    if(!location){
        location = 'middle'
    }
    if(!duration){
        duration = 2000
    }
    api.toast({
        msg: msg,
        duration: duration,
        location: location
    });
}

$cs.toString = function(data){
    bui.alert(JSON.stringify(data))
}
/**
 * 弹出框
 */
$cs.show_screen = function(open_page,params,cb){
    api.openFrame({
        name: 'encapsulation_model_screen',
        url: (open_page + '.html'),
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        bgColor:'rgba(0,0,0,0)',
        pageParam: {
            data: params
        }
    });
    api.addEventListener({
        name: 'screen_event'
    }, function(ret, err) {
        api.closeFrame({
            name: 'encapsulation_model_screen'
        });
        if(typeof cb == 'function'){
            cb(ret)
        }
    });
}
/**
 * 弹出框从左向右
 */
$cs.show_screen_left = function(open_page,params,cb){
    api.openFrame({
        name: 'encapsulation_model_screen',
        url: (open_page + '.html'),
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        bgColor:'rgba(0,0,0,0)',
        pageParam: {
            data: params
        },
        animation:{
            type:"movein",
            subType:"from_left",
        }
    });
    api.addEventListener({
        name: 'screen_event'
    }, function(ret, err) {
        api.closeFrame({
            name: 'encapsulation_model_screen'
        });
        if(typeof cb == 'function'){
            cb(ret)
        }
    });
}
/**
 * 弹出框之上弹出
 */
$cs.show_screen_game = function(open_page,params,cb){
    api.openFrame({
        name: 'game_model_screen',
        url: (open_page + '.html'),
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        bgColor:'rgba(0,0,0,0)',
        pageParam: {
            data: params
        }
    });
    api.addEventListener({
        name: 'screen_event_game'
    }, function(ret, err) {
        api.closeFrame({
            name: 'game_model_screen'
        });
        if(typeof cb == 'function'){
            cb(ret)
        }
    });
}

$cs.msg = function(msg){
    bui.hint({content:$cl.change_js_language_event(msg), position:"center" , effect:"fadeInDown"});
}

$cs.waiting = function(){
    $cs.toast($cl.change_js_language_event('暂未开放，敬请期待!'));
}



// 把div转化成图片
$cs.build_img_dom = function(dom_id,cb){
    console.log(dom_id)
    var canvas2 = document.createElement("canvas");
    let _canvas = document.querySelector(dom_id);
    var w = parseInt(window.getComputedStyle(_canvas).width);
    var h = parseInt(window.getComputedStyle(_canvas).height);
    //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
    canvas2.width = w * 2;
    canvas2.height = h * 2;
    canvas2.style.width = w + "px";
    canvas2.style.height = h + "px";
    var context = canvas2.getContext("2d");
    context.scale(2, 2);
    html2canvas(document.querySelector(dom_id), { canvas: canvas2 }).then(function(canvas) {
        var url = canvas.toDataURL('image/png')

        // var url_1 = url.substr(22)
        // var trans = api.require('trans');
        // trans.saveImage({
        //     base64Str: url_1,
        //     album:true
        // }, function(ret, err) {
        //     if (ret.status) {
        //         alert('保存成功')
        //     } else {
        //         alert('保存失败')
        //     }
        // });

       if(typeof cb == 'function'){
           cb(url)
       }
    });
}
// 复制
$cs.copy = function (val){
    if (typeof api == 'undefined') {
        // 没有api对象时调用浏览器复制方法
        // 添加虚拟dom元素
        var fictitious_dom = document.createElement('textarea');
        fictitious_dom.style.opacity = '0';
        fictitious_dom.style.height = '0.1px';
        fictitious_dom.setAttribute('id','in_browser_fictitious_dom');
        fictitious_dom.innerHTML = val;
        document.body.appendChild(fictitious_dom);
        var in_browser_fictitious_dom1 = document.getElementById('in_browser_fictitious_dom');
        in_browser_fictitious_dom1.select();
        document.execCommand("Copy");
        // 移除虚拟dom元素
        $('body').remove('#in_browser_fictitious_dom');
        $cs.msg($cl.change_js_language_event('复制成功'));
        return ;
    }
    // 有api对象时复制
    var obj = api.require('clipBoard');
    obj.set({
        value: val
    }, function(ret, err){
        if(ret.status){
            $cs.msg($cl.change_js_language_event('复制成功'));
        }else{
            $cs.msg(err.msg);
        }
    });
}
$cs.setRefreshHeaderInfo = function (cb) {
    api.setRefreshHeaderInfo({
        visible: true,
        bgColor: '#e4e4e4',
        textColor: '#8a8a8a',
        textDown: 'loading...',
        textUp: 'loading...',
        showTime: true
    }, function (ret, err) {
        cb();
        api.refreshHeaderLoadDone()
    });
}
$cs.scrollMore = function(bottom, cb){
    var threshold = 0
    if(bottom){
        threshold = bottom
    }
    api.addEventListener({
        name:'scrolltobottom',
        extra:{
            threshold:threshold            //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function(ret, err){
        cb();
    });
}
$cs.format_url = function(url){
    if(url){
        var reg = /^https?:\/\/|^http?:\/\//i;
        if(!reg.test(url)){
            url =  $cs.url('image') +url
        }
    }
    return url;
}
// 用户等级
$cs.format_level=function(level) {
    var src = '';
    var bgc = '';
    switch (level) {
        case '秀才':
            src = '../../image/liveplay/level/0.png';
            bgc = '#5eb438'
            break;
        case '状元':
            src = '../../image/liveplay/level/1.png';
            bgc = '#4cb8c7'
            break;
        case '知县':
            src = '../../image/liveplay/level/2.png';
            bgc = '#4291f9'
            break;
        case '巡抚':
            src = '../../image/liveplay/level/3.png';
            bgc = '#ec4a5b'
            break;
        case '将军':
            src = '../../image/liveplay/level/4.png';
            bgc = '#fc8a2d'
            break;
        case '国师':
            src = '../../image/liveplay/level/5.png';
            bgc = '#b109ff'
            break;
        case '亲王':
            src = '../../image/liveplay/level/6.png';
            bgc = '#731efa'
            break;
        case '帝皇':
            src = '../../image/liveplay/level/7.png';
            bgc = '#d11e39'
            break;
        default:
            src = '';
            bgc = '';
    }
    return {'src': src, 'bgc': bgc};
}
// 时间转换 今天 昨天 刚刚
$cs.format_time = function(timestamp){
    // console.log('时间转化前:'+timestamp)
    var timestamp = (new Date(timestamp.replace(/-/g,'/'))).getTime()/1000;
    // console.log('时间转化hou:'+timestamp)
    function zeroize( num ) {
        return (String(num).length == 1 ? '0' : '') + num;
    }
    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
    var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
    var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

    if ( timestampDiff < 60 ) { // 一分钟以内
        return "刚刚";
    } else if( timestampDiff < 3600 ) { // 一小时前之内
        return Math.floor( timestampDiff / 60 ) + "分钟前";
    } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
        return '今天' + zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
        if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
                return '昨天' + zeroize(H) + ':' + zeroize(i);
        } else if ( curDate.getFullYear() == Y ) {
                return  zeroize(m) + '月' + zeroize(d) + '日 '  + zeroize(H) + ':' + zeroize(i);
        } else {
                return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        }
    }
}

// 提示框
$cs.confirm = function(title, msg, callback){
    api.confirm({
        title: title,
        msg: msg,
        buttons:  [$cl.change_js_language_event('确定'), $cl.change_js_language_event('取消')]
    }, function(ret, err) {
        var index = ret.buttonIndex;
        if (index == 1) {
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    });
}
// 事件监听
$cs.eventListen = function(name, callback){
    api.addEventListener({
        name: name
    }, function(ret, err) {
        if (callback && typeof callback === 'function') {
            callback(ret);
        }
    });
}
// 发送事件
$cs.eventSend =  function(name, params) {
    api.sendEvent({
        name: name,
        extra: params
    });
}
// 选择下拉
$cs.actionSheet = function (title , btns , callback) {
    api.actionSheet({
        title: title,
        cancelTitle: $cl.change_js_language_event('取消'),
        buttons: btns
    }, function(ret, err) {
        var index = ret.buttonIndex;
        if(index > btns.length) return;
        else{
            if(callback && typeof callback === 'function'){
                callback(index);
            }
        }
    });
}
// 弹出确定选项
$cs.prompt = function(title ,msg , type,callback) {
    api.prompt({
        title: title,
        msg: msg,
        type : type,
        buttons: [$cl.change_js_language_event('确定'), $cl.change_js_language_event('取消')]
    }, function(ret, err) {
        var index = ret.buttonIndex;
        var text = ret.text;
        if(index == 1){
            if(callback && typeof callback === 'function'){
                callback(text)
            }
        }else{

        }
    });
}
// 传图片
$cs.upload_base64 = function (quality,callback) {
    api.actionSheet({
        title: $cl.change_js_language_event('选择图片'),
        cancelTitle: $cl.change_js_language_event('取消'),
        buttons: [$cl.change_js_language_event('图片库'), $cl.change_js_language_event('相机'), $cl.change_js_language_event('相册')]
    }, function(ret, err) {
        var index = ret.buttonIndex;
        var sourceType =['library' , 'camera' ,'album'];
        var btnIndex = index -1;
        if(index>3){
            return;
        }else{
            api.getPicture({
                sourceType: sourceType[btnIndex],
                encodingType: 'jpg',
                mediaValue: 'pic',
                destinationType: 'base64', //'base64'
                allowEdit: true,
                quality: quality,
                targetWidth: 1000,
                targetHeight: 1000,
                saveToPhotoAlbum: false
            }, function(ret, err) {
                if (ret.data) {
                    var uploadfile = ret.base64Data;
                    if(callback && typeof callback === 'function'){
                        callback(uploadfile)
                    }
                } else {
                    $cs.msg( $cl.change_js_language_event( "选取照片失败，请重试") ,"middle");
                }
            });
        }
    })
}
