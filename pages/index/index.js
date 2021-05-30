const app = getApp()
// const io = require('weapp.socket.io');
const dayjs = require('../../utils/dayjs.min.js')
const io = require('../../utils/weapp.socket.io.js')

var socket = null;

//=====================================
var service_end = true;

var hostname = "192.168.1.5:8036";
var protocol = "http";

Page({
    data: {
        content: "", //输入框值
        InputBottom: 0,
        config: {},

        messageList: [],
        notice: "",
    },
    onLoad() {
        this.connect();
    },
    InputFocus(e) {
        this.setData({
            InputBottom: e.detail.height
        })
    },
    InputBlur(e) {
        this.setData({
            InputBottom: 0
        })
    },
    inputing() {
        if (!socket) return;
        if (!this.data.content) return;
        socket.emit('message', {
            appid: this.data.config.appid,
            userid: this.data.config.userid,
            type: "writing",
            session: this.data.config.sessionid,
            orgi: this.data.config.orgi,
            message: this.data.content,
        });
        setTimeout(() => {
            socket.emit('message', {
                appid: this.data.config.appid,
                userid: this.data.config.userid,
                type: "writing",
                session: this.data.config.sessionid,
                orgi: this.data.config.orgi,
                message: "",
            });
        }, 2000);
    },
    sendMsg() {
        if (!socket) return;
        if (!this.data.content) return;
        socket.emit('message', {
            appid: this.data.config.appid,
            userid: this.data.config.userid,
            type: "message",
            session: this.data.config.sessionid,
            orgi: this.data.config.orgi,
            message: this.data.content,
        });
        this.setData({
            content: ""
        })
    },
    async connect() {
        let _this = this;

        let response = await this.request({
            url: "http://192.168.1.5:8035/im/text/0npljl",
            method: "POST"
        })
        //console.log(response.data);
        response.data.userid = "shih";
        let {
            userid,
            orgi,
            sessionid,
            appid,
        } = response.data;
        this.setData({
            config: response.data,
        })

        // const socket = io(`wss://socketio-chat-h9jt.herokuapp.com/`)

        socket = io(
            `${protocol}://${hostname}/im/user?userid=${userid}&orgi=${orgi}&session=${sessionid}&appid=${appid}`, {
                transports: ['websocket']
            }
        );

        // socket.on('connect', () => {
        //     console.log('connection created.')
        // });

        socket.on('connect', function () {
            //console.log("on connect ...");
            if ('#{contacts.name}') {
                socket.emit('new', {
                    name: "测试微信小程序",
                    phone: "15238194793",
                    email: "123@qq.com",
                    memo: "来访原因",
                    orgi: _this.data.config.inviteData.orgi,
                    appid: _this.data.config.appid
                });
            }
        })
        socket.on("agentstatus", function (data) {
            console.log("agentstatus", data);
        })
        socket.on("status", function (data) {
            console.log("[status]", data);

            if (data.messageType == "end") {
                service_end = true;
                _this.setData({
                    notice: data
                })

            } else if (data.messageType == "text") {
                service_end = false;
                console.log(data.message);
                _this.setData({
                    notice: data
                })
            } else if (data.messageType == "message" && !data.noagent) {
                // 服务恢复
                service_end = false;
                //console.log(data.message);
                _this.setData({
                    notice: data
                })
            }
        })
        socket.on('message', function (data) {
            data.createtime = dayjs(data.createtime).format('YYYY-MM-DD HH:mm:ss');
            //console.log("on message", data);
            _this.setData({
                messageList: [..._this.data.messageList, ...[data]],
            })
            if (data.msgtype == "image") {} else if (data.msgtype == "file") {}
            if (data.calltype == "呼入") {} else if (data.calltype == "呼出") {
                let context = wx.createInnerAudioContext();
                context.autoplay = true;
                context.src = "/utils/14039.mp3";
                context.onPlay(() => {
                    //console.log("play");
                });
                context.onError((res) => { //打印错误
                    console.log(res.errMsg); //错误信息
                    console.log(res.errCode); //错误码
                })
                context.play();
            }
            _this.pageScrollToBottom();
        });

        socket.on('disconnect', function () {
            console.log("editor.readonly();", '连接失败');
        });

        socket.on('satisfaction', function () {
            console.log("[satisfaction]");
        });
    },

    request: (options) => {
        return new Promise((resolve, reject) => {
            options.success = (e) => {
                resolve(e);
            }
            options.fail = (e) => {
                reject(e);
            }
            wx.request(options);
        })

    },

    // 获取容器高度，使页面滚动到容器底部
    pageScrollToBottom: function () {
        wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
            if (rect) {
                // 使页面滚动到底部
                console.log(rect.height);
                wx.pageScrollTo({
                    scrollTop: rect.height
                })
            }
        }).exec()
    },
})