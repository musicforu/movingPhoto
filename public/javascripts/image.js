/**
 * Created by  on 2015/5/31.
 */
//动态图片墙页面js脚本，使用html5中的audio方面的api，使用ajax获取后台数据
window.onload=function() {

    var m=document.getElementsByClassName('pic').length;
    var xhr=new XMLHttpRequest();
    //获取audio的上下文环境
    var ac=new (window.AudioContext||window.webkitAudioContext)();
    var musicUrl=document.getElementsByClassName('music')[0].title;
    var gainNode=ac[ac.createGain?'createGain':'createGainNode']();
    gainNode.connect(ac.destination);
    var analyser=ac.createAnalyser();
    var size=16;

    analyser.fftSize=size*2;
    analyser.connect(gainNode);
    //更改音量
    $('#volume')[0].onchange=function(){
        changeValue(this.value/this.max);
    }
    $('#volume')[0].onchange();
    //载入音乐
    load('../media/'+musicUrl);
    visualizer();
   /** setInterval(function () {
        for (var i = 0; i < m; i++) {
            var x = Math.floor(Math.random() * 850);
            var y = Math.floor(Math.random() * 200);
            //var rotate = Math.floor(Math.pow(-1, Math.floor(Math.random() * 10)) * Math.random() * 20);
            var rotate=arr[i]/256*90;
            document.getElementsByClassName('pic')[i].style.cssText =
                'left:' + x + 'px;top:' + y + 'px;-webkit-transform:rotate(' + rotate + 'deg)';
        }
    }, 2000);
   **/
    //var source=null;
    //var count=0;
    function load(url) {
        //var n=++count;
        //source && source[source.stop?'stop':'noteOff']();
        //xhr.abort();
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
          //if(n!=count)  return;
          ac.decodeAudioData(xhr.response, function (buffer) {
              //if(n!=count) return;
                var bufferSource = ac.createBufferSource();
                bufferSource.buffer = buffer;
                //bufferSource.connect(gainNode);
                bufferSource.connect(analyser);
                //bufferSource.connect(ac.destination);
                bufferSource[bufferSource.start ? 'start' : 'noteOn'](0);
                //source=bufferSource;

            }, function (err) {
                console.log(err);
            })
        }
        xhr.send();
    }
//更改音量值
    function changeValue(percent){
        gainNode.gain.value=percent*percent;
    }

    function visualizer(){
        arr=new Uint8Array(analyser.frequencyBinCount);

        requestAnimationFrame=window.requestAnimationFrame||
                              window.webkitRequestAnimationFrame;
        //设置图片css样式，改变位置坐标，旋转角度以及图片大小
        function v(){
           analyser.getByteFrequencyData(arr);

            for (var i = 0; i < m; i++) {
                var x = Math.floor(Math.random() * 850);
                var y = Math.floor(Math.random() * 200);
                //var rotate = Math.floor(Math.pow(-1, Math.floor(Math.random() * 10)) * Math.random() * 20);
                var rotate=Math.pow(-1,Math.floor(Math.random() * 10))*arr[i]/256*15;
                var scale=arr[i]/256*1.5;
                document.getElementsByClassName('pic')[i].style.cssText =
                    'left:' + x + 'px;top:' + y + 'px;-webkit-transform:rotate(' + rotate + 'deg) scale('+scale+')';
            }
            setTimeout(v,1000);
            console.log(arr);
        }
        setTimeout(v,1000);
    }
}