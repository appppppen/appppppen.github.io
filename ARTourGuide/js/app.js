/*
 * 相机 需要https
 * iOS 获取位置需要https；
 * */
//画图功能
const drawEvent = {
	stage: null,
	radarW: 80,
	fanAngle: 60,
	pointR: 2, //点半径
	pointGroup: null,
	radarLayer: null,
	init() {
		this.stage = new Konva.Stage({
			container: 'Radar',
			width:100,
			height: 100
		});
		//创建雷达
		this.createRadar();
		//TODO 创建3D场景
		this.createThreeScene();
	},

	//创建雷达
	createRadar() {
		this.radarLayer = new Konva.Layer();
		//背景圆
		var circle = new Konva.Circle({
			x:  20 + this.radarW / 2,
			y: 20 + this.radarW / 2,
			radius: this.radarW / 2,
			fill: 'rgba(0,0,0,0.6)'
		});
		//扇形
		var fan = new Konva.Arc({
			x: this.radarW / 2 + 20,
			y: this.radarW / 2 + 20,
			innerRadius: 0,
			outerRadius: this.radarW / 2,
			angle: this.fanAngle,
			rotation: this.fanAngle - 180,
			fill: 'rgba(216,216,216,0.75)',
		});
		//圆的layer				
		this.radarLayer.add(circle, fan);
		this.createPoint();
		this.stage.add(this.radarLayer);
	},

	//创建雷达点
	createPoint() {
		//存在先清除
		if(this.pointGroup) {
			this.pointGroup.destroy();
		};
		this.pointGroup = new Konva.Group({
			x: 20,
			y: 20
		});
		for(var i = 0; i < 20; i++) {
			var x = this.radarW * Math.random();
			var y = this.radarW * Math.random();
			var l = Math.sqrt((x - this.radarW / 2) * (x - this.radarW / 2) + (this.radarW / 2 - y) * (this.radarW / 2 - y));
			if(l + 2 < this.radarW / 2) {
				this.pointGroup.add(new Konva.Circle({
					x: x,
					y: y,
					radius: this.pointR,
					fill: 'rgba(241,31,31,1)',
				}))
			}
		}
		this.radarLayer.add(this.pointGroup);
		this.radarLayer.draw();
	},

	//创建3D场景
	createThreeScene() {
		

	}
};

//项目主程序
var fnObj = {

	//相机初始化
	cameraInit() {
        //开启摄像头初始化
        var ua = navigator.userAgent;

        var video = document.getElementById('camera');
        // video.style.width = document.width + 'px';
        // video.style.height = document.height + 'px';
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');

        var exfect = [];
        if (navigator && navigator.mediaDevices) {
            navigator.mediaDevices.enumerateDevices()
                .then(function gotDevices(deviceInfos) {
                    for (var i = 0; i !== deviceInfos.length; ++i) {
                        var deviceInfo = deviceInfos[i];
                        if (deviceInfo.kind === 'videoinput') {
                            exfect.push(deviceInfo.deviceId);
                        }
                    }
                    openCamera(exfect[1]);
                }).catch(function errorCallback(error) {
                console.log('navigator.getUserMedia error: ', error);
            });
        }

        var openCamera = (id) => {
            var constraints = {
                audio: false,
                video: {
                    deviceId: id,
                    //在电脑测试时，注释可调用摄像头
                    facingMode: { exact: "environment" }
                }
            };
            if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
                    if ("srcObject" in video) {
                        video.srcObject = stream;
                    } else {
                        video.src = window.URL.createObjectURL(stream);
                    }
                });
            } else {
                navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia;
                navigator.getUserMedia(constraints, function (stream) {
                    if ("srcObject" in video) {
                        video.srcObject = stream;
                    } else {
                        video.src = window.URL.createObjectURL(stream);
                    }
                }, function (err) {

                });
            }
        };



	},


};
document.addEventListener('touchmove', (e) => {
	e.preventDefault();
}, false);
//相机初始化
fnObj.cameraInit();
//雷达初始化
// drawEvent.init();