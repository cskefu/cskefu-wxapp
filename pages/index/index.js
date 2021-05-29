//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        InputBottom: 0
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
    }
})