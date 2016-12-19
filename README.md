# revealModal
模态窗口组件 弹出层组件
###兼容性
谷歌火狐主流浏览器，IE7+
###依赖文件
jquery.js 1.7+以上版本
###配置项
```
 $('.demo0').reModal({
               box:'#reModalBox0',//弹出层id或者class绑定
               width: 480,//设置宽度
               height: '',//设置高度
               positions: 'center',//弹出层显示位置  top/left/center(默认)
               resetForm: true,//关闭弹出层后是否重置表单 默认为true
               modalHide: false,//遮罩成是否可以点击关闭，默认为ture
               boxBg: '#eeeeee',//设置弹出层内容区域的北背景色
               modalBg: 'rgba(255,255,255,0.7)',//遮罩层的背景色
               closeBg: '#BC2600',//改变关闭按钮背景色,
               closeHide: false,//不显示关闭按钮
               triggerEvent: 'mouseenter',//鼠标移入触发
               effect: 'fadeOut',//淡出关闭效果
               escHide:'true',Esc键关闭弹出层
               afterHide: function(){//隐藏后回调
                  alert('隐藏后执行');
               },
               beforeShow: function(){//显示前回调
                  alert('显示前执行');
               }
            });
```
