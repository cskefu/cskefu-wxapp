const app = getApp()
// const io = require('weapp.socket.io');
const dayjs = require('../../utils/dayjs.min.js')
const io = require('../../utils/weapp.socket.io.js')

var socket = null;

//=====================================
var service_end = true;

var hostname = "192.168.1.5:8036";
var protocol = "http";
// var username = "wxapp";

//var userid = "86976df0c1fc3f76f343b065d137c5a5";
// var appid = "0npljl";
//var sessionid = "";
// var osname = "wxapp";
// var orgi = "cskefu";
Page({
    data: {
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
    sendMsg() {
        if (!socket) return;
        let message = "测试文本";
        socket.emit('message', {
            appid: this.data.config.appid,
            userid: this.data.config.userid,
            type: "message",
            session: this.data.config.sessionid,
            orgi: this.data.config.orgi,
            message: message
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

    async connect() {
        let _this = this;

        let response = await this.request({
            url: "http://localhost:8035/im/text/0npljl",
            method: "POST"
        })
        console.log(response.data);
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
            console.log("on connect ...");
            if ('#{contacts.name}') {
                socket.emit('new', {
                    name: "测试微信小程序",
                    phone: "15238194793",
                    email: "123@qq.com",
                    memo: "#{contacts.memo}",
                    orgi: "#{inviteData.orgi}",
                    appid: "#{appid}"
                });
            }
        })
        socket.on("agentstatus", function (data) {
            console.log("agentstatus", data);
            ///document.getElementById('connect-message').innerHTML = data.message;
        })
        socket.on("status", function (data) {
            // if (false)
            //     output('<span id="connect-message">' + data.message + '</span>', 'message connect-message', false);
            // else
            //     output('<span id="connect-message">' + data.message + '</span>', 'message connect-message', true);

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
            console.log("on message", data);
            _this.setData({
                messageList: [..._this.data.messageList, ...[data]],
            })
            if (data.msgtype == "image") {} else if (data.msgtype == "file") {}
            if (data.calltype == "呼入") {} else if (data.calltype == "呼出") {}
        });

        socket.on('disconnect', function () {
            console.log("editor.readonly();", '连接失败');
        });

        socket.on('satisfaction', function () {
            console.log("[satisfaction]");
        });
    },
})