# 春松客服小程序版

原生微信小程序客服对接页面，春松客服自 [dc9e06d](https://github.com/chatopera/cskefu/commit/dc9e06db4926cd56cd3a1e13e2c0e7659a50bed8) 起支持本小程序。

<img src="https://gitee.com/shih945/cskefu-wxapp/raw/master/static/images/Snipaste_2021-06-07_23-45-47.png" alt="原生page版" height="400px">
<img src="https://gitee.com/shih945/cskefu-wxapp/raw/master/static/images/Snipaste_2021-06-07_23-59-20.png" alt="webview版" height="400px">

## 用法

1. 配置后台https和wss，小程序上线必须支持

    参考[春松客服配置 CDN和HTTPS | 春松客服](https://chatopera.blog.csdn.net/article/details/105820829)

2. 配置index页面js文件中参数
    
    后台添加渠道，取得渠道ID；

    在`pages/index/index.js`配置部署项目的协议、域名、端口和渠道ID。


## 作者

* [shih945](https://github.com/shih945)

## 提交工单
    
[https://github.com/chatopera/cskefu/issues/new/choose](https://github.com/chatopera/cskefu/issues/new/choose)    

## 鸣谢

- [春松客服](https://gitee.com/chatopera/cskefu)
- [ColorUI](https://www.color-ui.com)
- [weapp.socket.io](https://github.com/weapp-socketio/weapp.socket.io)
- [Day.js](https://dayjs.gitee.io/zh-CN/)
