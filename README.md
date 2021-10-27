# 春松客服小程序版
原生微信小程序客服对接页面

<img src="https://gitee.com/shih945/cskefu-wxapp/raw/master/static/images/Snipaste_2021-06-07_23-45-47.png" alt="原生page版" height="400px">
<img src="https://gitee.com/shih945/cskefu-wxapp/raw/master/static/images/Snipaste_2021-06-07_23-59-20.png" alt="webview版" height="400px">

## 用法
1. 实现接口
    - 找到后台项目中接口IMController接口`/text/{appid}`，位于`contact-center/app/src/main/java/com/chatopera/cc/controller/apps/IMController.java` 983行左右，将`RequestMapping`改为`GetMapping`;
    - 复制此接口放其后，将`GetMapping`改为`PostMapping`，在其上添加`@ResponseBody`注解,将`ModelAndView`替换为`Map<String,Object>`,修改接口第一行内容为`Map<String,Object> params = new HashMap<>();`  ,将`view.addObject`全部替换为`params.put`,最后一行改为`return params;` 即将原来传入模板引擎的参数全部放入map返回给前端如下所示
        <details>
        <summary>查看示例接口代码</summary>

        ```java
        @ResponseBody
        @PostMapping("/text/{appid}")
        @Menu(type = "im", subtype = "index", access = true)
        public Map<String,Object> postText(
                HttpServletRequest request,
                @PathVariable String appid,
                @Valid String traceid,
                @Valid String aiid,
                @Valid String exchange,
                @Valid String title,
                @Valid String url,
                @Valid String skill,
                @Valid String id,
                @Valid String userid,
                @Valid String agent,
                @Valid String name,
                @Valid String email,
                @Valid String phone,
                @Valid String ai,
                @Valid String orgi,
                @Valid String product,
                @Valid String description,
                @Valid String imgurl,
                @Valid String pid,
                @Valid String purl) throws Exception {
            Map<String,Object> params = new HashMap<>();
            CousultInvite invite = OnlineUserProxy.consult(
                    appid, StringUtils.isBlank(orgi) ? Constants.SYSTEM_ORGI : orgi);

            params.put("hostname", request.getServerName());
            params.put("port", request.getServerPort());
            params.put("schema", request.getScheme());
            params.put("appid", appid);
            params.put("channelVisitorSeparate", channelWebIMVisitorSeparate);
            params.put("ip", MainUtils.md5(request.getRemoteAddr()));

            if (invite.isSkill() && invite.isConsult_skill_fixed()) { 
                // 添加技能组ID
                // 忽略前端传入的技能组ID
                params.put("skill", invite.getConsult_skill_fixed_id());
            } else if (StringUtils.isNotBlank(skill)) {
                params.put("skill", skill);
            }

            if (StringUtils.isNotBlank(agent)) {
                params.put("agent", agent);
            }

            params.put("client", MainUtils.getUUID());
            params.put("sessionid", request.getSession().getId());

            params.put("id", id);
            if (StringUtils.isNotBlank(ai)) {
                params.put("ai", ai);
            }
            if (StringUtils.isNotBlank(exchange)) {
                params.put("exchange", exchange);
            }

            params.put("name", name);
            params.put("email", email);
            params.put("phone", phone);
            params.put("userid", userid);

            params.put("product", product);
            params.put("description", description);
            params.put("imgurl", imgurl);
            params.put("pid", pid);
            params.put("purl", purl);

            if (StringUtils.isNotBlank(traceid)) {
                params.put("traceid", traceid);
            }
            if (StringUtils.isNotBlank(title)) {
                params.put("title", title);
            }
            if (StringUtils.isNotBlank(traceid)) {
                params.put("url", url);
            }

            if (invite != null) {
                params.put("inviteData", invite);
                params.put("orgi", invite.getOrgi());
                params.put("appid", appid);

                if (StringUtils.isNotBlank(aiid)) {
                    params.put("aiid", aiid);
                } else if (StringUtils.isNotBlank(invite.getAiid())) {
                    params.put("aiid", invite.getAiid());
                }
            }

            return params;
        }
        ```
        </details>
2. 升级`netty-socketio`版本,因低版本会导致`weapp.socket.io`无法连接
    ```xml
    <dependency>
        <groupId>com.corundumstudio.socketio</groupId>
        <artifactId>netty-socketio</artifactId>
        <version>1.7.19</version>
    </dependency>
    ```

3. 配置index页面js文件中参数
配置部署项目的协议、域名、端口等。

## 提交工单
    
[https://github.com/chatopera/cskefu/issues/new/choose](https://github.com/chatopera/cskefu/issues/new/choose)    

## 鸣谢

- [春松客服](https://gitee.com/chatopera/cskefu)
- [ColorUI](https://www.color-ui.com)
- [weapp.socket.io](https://github.com/weapp-socketio/weapp.socket.io)
- [Day.js](https://dayjs.gitee.io/zh-CN/)
