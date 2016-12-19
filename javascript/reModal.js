/**
 * reModal - 模态窗口 组件
 * @version 1.0.0
 * @since 2016.12.12
 * @author gao li
 */
;(function($, window, document, undefined) {
    var $body=$('body');
    var methods={
        init:function (options) {
            return this.each(function () {
                var $this=$(this),
                    opt=$this.data('reModal');
                if (typeof (opt)=='undefined'){
                    var defaults={
                        box: '.reModalBox',     //弹框默认选择器
                        boxBg: '#fff',          //弹框默认背景颜色
                        modalBg: 'url(./images/reModalBg.png)', //遮罩默认背景颜色
                        closeBg: '#fff',        //弹框关闭按钮默认背景颜色
                        width: 480,             //弹框默认宽度
                        height: '',            //弹框默认高度
                        positions: 'center',    //弹框位置(默认center：居中，top：顶部居中，left：顶部居左)
                        triggerEvent: 'click',  //触发方式(默认click：点击，mouseenter：悬浮)
                        effect: 'hide',         //弹框关闭效果(默认hide，淡出关闭：fadeOut)
                        resetForm: true,        //是否清空表单(默认true：清空，false：不清空)
                        modalHide: true,        //是否点击遮罩背景关闭弹框(默认true：关闭，false：不可关闭)						
                        closeHide: true,        //是否隐藏关闭按钮(默认true：不隐藏，false：隐藏)
                        escHide: true,          //是否支持ESC关闭弹框(默认true：关闭，false：不可关闭)
                        beforeShow: function(){}, //显示前的回调方法
                        afterHide: function(){}   //隐藏后的回调方法
                    };
                    opt=$.extend({},defaults,options);
                    $this.data('reModal',opt);
                }
                opt=$.extend({},defaults,options);
                $(opt.box).hide(); //隐藏容器
                
                //元素点击事件
                var thisModal;

                $(this).on(opt.triggerEvent,function () {
                    thisModal=$(opt.box);
                    //重置表单
                    if(opt.resetForm) { //默认值是true，清空表单
                        var $obj = $(opt.box);
                        $obj.find('input[type=text],textarea').val('');
                        $obj.find('select option').removeAttr('selected');
                        $obj.find('input[type=radio],input[type=checkbox]').removeAttr('checked');
                        $body.css('overflow','hidden');
                    }
                    //支持ESC关闭
                    if(opt.escHide) {
                        $(document).keyup(function(event){
                            switch(event.keyCode) {
                                case 27:
                                    methods.close(opt);
                                    break;
                            }
                        });
                    }
                    //调用显示之前回调函数
                    methods.fire.call(this, opt.beforeShow);
                    //显示弹框
                    methods.add(opt,$this);
                    //点击关闭事件
                    var $close = $('.HCloseBtn');
                    if(opt.modalHide){ 
                        $close = $('.reModalLay,.HCloseBtn'); 
                    }
                    $close.on('click',function(event) {
                        event = event || window.event;
                        event.stopPropagation();
                        methods.close(opt);
                    });
                });
                //浏览器窗口大小改变
                $(window).resize(function () {
                    methods.resize(opt,$this);
                })
            })
        },
        //显示弹框
        add:function (o) {
            var w,h,t,l,m, size,
                $obj = $(o.box),
                modalBg = o.modalBg,
                closeBg = o.closeBg;
            //定义弹出层的显示大小 large medium small
            size=$obj.attr('data-size');
            switch (size){
                case 'large':
                    o.width=880;
                    break;
                case 'medium':
                    o.width=680;
                    break;
                case 'small': //默认480
                    break;
                default:
            }
            w = o.width != undefined ? parseInt(o.width) : '480';
            $obj.stop().css({'width':w});
            //获取弹出层自动高度，如果内容高度大于屏幕高度的80%；则就将弹出层的高度设置成屏幕高度80%，小于的话就是自动内容高度
            h= ($obj.outerHeight()>$(window).height()*0.7)?$(window).height()*0.7:$obj.outerHeight();
            m = o.height ? ""+(-(o.height/2))+'px 0 0 '+(-(w/2))+"px": ""+(-(h/2))+'px 0 0 '+(-(w/2))+"px";
            methods.remove('.reModalLay,.HCloseBtn');
            $body.stop().append("<div class='reModalLay animated' style=background:"+modalBg+";'></div>");
            //弹框位置
            switch (o.positions) {
                case 'center':
                    t = l = '50%';
                    break;
                case 'top':
                    t = 0; l = '50%'; m = "0 0 0 "+(-(w/2))+"px";
                    break;
                case 'left':
                    t = l = m = 0;
                    break;
                default:
                    t = l = '50%';
            }
            if(o.closeHide != false){
                $obj.stop().append('<a class="HCloseBtn" title="关闭"><span style="color:'+closeBg+';">×</span></a>');
            }
            $obj.stop().css({
                'backgroundColor':o.boxBg,
                'position': 'fixed',
                'z-index': 100000,
                'top':t,
                'left':l,
                'margin':m,
                'width':o.width,
                'height':o.height ? o.height:h
            }).removeAttr('class').addClass('reModalBox animated ').show();
            $obj.find('.wrapper').css({
                'width':o.width-30,
                'height':o.height ? o.height-89-30:h-89-30,  //89表示弹出层title和btn-area的高度，30是padding的高度
                'overflow-y':'auto'
            });
        },
        // resize:function (o,$this) {
        //     var obj=$(o.box);
        //     // alert(obj);
        // },
        //关闭弹框
        close:function (o, urls) {
            var $obj = $(o.box);
            //关闭效果
            switch(o.effect){
                case "hide":
                    $obj.stop().hide(_effect);
                    break;
                case "fadeOut":
                    $obj.stop().fadeOut(_effect);
                    break;
                default:
                    $obj.stop().hide(_effect);
            }
            function _effect() {
                $body.attr('style','');
                $('.reModalLay,.HTooltip').fadeOut(200).remove();
                // methods.remove('.reModalLay,.HTooltip');
                $(this).removeAttr('style').addClass('animated').hide().find('.wrapper').removeAttr('style');
                if(urls != undefined) { 
                    setTimeout(function() {window.location.href = urls; },1000);
                }
                //隐藏后的回调方法
                methods.fire.call(this, o.afterHide); 
            }
        },
        //移除元素
        remove: function (a) { 
            $(a).remove();
        },
        //调用回调函数 
        fire: function (event, data) { 
            if($.isFunction(event)) { return event.call(this, data); }
        }
    };

    $.fn.reModal = function (method) {
        if(methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }else {
            $.error('Error! Method' + method + 'does not exist on reModal！');
        }
    };

    // 内置扩展
    $.extend({
        /**
         * @decription 给方法添加加载函数
         * @param t : string 加载文字
         * @param w : string 加载框宽度
         * @param h : string 加载框高度
         */
        //显示加载
        showDialog: function (t, w, h) {
            t = t != undefined ? t : '正在加载中...';
            w = w != undefined ? parseInt(w) : '200';
            h = h != undefined ? parseInt(h) : '30';
            var margin = ""+(-(h/2))+'px 0 0 '+(-(w/2))+"px";
            $('body').css('overflow','hidden').stop().append('<div id="TB_overlayBG" style="display: block;"></div> ' +
                '<div id="HLoading" class="fadeIn animated" ' +
                'style="width:'+w+'px;height:'+h+'px;line-height:'+h+'px;' +
                'background: white;color: #444;border-radius: 3px;z-index:100;padding: 5px 10px;font-size: 14px;' +
                'text-align:center;position:fixed;top:50%;left:50%;margin:'+margin+';">'+t+'</div>');
        },
        //移除加载
        hideDialog: function () {
            $('body').attr('style','').find('#HLoading , #TB_overlayBG2').remove();
        },
        /**
         * @decription 给方法添加提示函数
         * @param t1 : string 提示文字
         * @param t2 : string 提示时间
         * @param t3 : boolean 提示类型，默认为false
         */
        tooltip: function (t1,t3,t2) {
            t1 = t1 != undefined ? t1 : '哎呀，出错啦 ！';
            t2 = t2 != undefined ? parseInt(t2) : 2500;
            if(t3 =="success"||"") {
                var tip = '<div class="HTooltip fadeInDown animated"' +
                    ' style="width:280px;padding:10px;text-align:center;background-color:#5cb85c;color:#fff;position:fixed;top:10px;left:50%;z-index:100001;margin-left:-150px;box-shadow:1px 1px 5px #333;-webkit-box-shadow:1px 1px 5px #333;">'+t1+'</div>'; 
            }else if(t3 =="alert"){
                tip = '<div class="HTooltip shake animated" style="width:280px;padding:10px;text-align:center;background-color:#D84C31;color:#fff;position:fixed;top:10px;left:50%;z-index:100001;margin-left:-150px;box-shadow:1px 1px 5px #333;-webkit-box-shadow:1px 1px 5px #333;">'+t1+'</div>';
            }
            methods.remove('.HTooltip');
            $body.stop().append(tip);
            setTimeout(function() { methods.remove('.HTooltip'); },t2);
        },
        /**
         * @decription 返回顶部
         * @param b : string 和屏幕底部的距离
         * @param r : string 和屏幕右侧的距离
         */
        goTop: function (b, r) {
            b = b != undefined ? b : '30px';
            r = r != undefined ? r : '20px';
            methods.remove('#reModalGoTop');
            $body.stop().append('<a id="reModalGoTop" href="javascript:;" class="animated" style="width:40px;height:40px;line-height:40px;display:inline-block;text-align:center;background:#333;color:#fff;position:fixed;bottom:'+b+';right:'+r+';z-index:100000;">Top</a>').find('#reModalGoTop').hide();
            $(window).scroll(function(){
                if($(window).scrollTop()>150){
                    $('#reModalGoTop').removeClass('rollIn rollOut').addClass('rollIn').show();
                }else{
                    $('#reModalGoTop').removeClass('rollIn rollOut').addClass('rollOut');
                }
            });
            //返回顶部按钮点击事件
            $('#reModalGoTop').on('click',function(){
                $('body,html').animate({ scrollTop:0 },500);
                return false;
            });
        }
    });
    
})(jQuery, window, document);