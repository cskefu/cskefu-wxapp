module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1622286218798, function(require, module, exports) {


var _utils = require('./utils');

var _connectSocket = require('./connectSocket');

var _connectSocket2 = _interopRequireDefault(_connectSocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;
/**
 * 小程序 Websocket
 * @param       {DOMString}             url       url
 * @param       {DOMString|DOMString[]} protocols Optional 协议
 * @constructor
 */
function WebSocket(url, protocols) {
  var _this = this;

  if (protocols) {
    if ((0, _utils.isString)(protocols)) {
      /* eslint no-param-reassign: off */
      protocols = [protocols];
    } else if (!(0, _utils.isArray)(protocols)) {
      throw new _utils.DOMExceptionError('Failed to construct \'WebSocket\': The subprotocol \'' + protocols + '\' is invalid.');
    }
  }

  // binaryType
  this.binaryType = '';
  this.readyState = WebSocket.CONNECTING;
  this.$id = id;
  id += 1;
  this.$options = {
    url: url,
    header: {
      'content-type': 'application/json'
    },
    protocols: protocols,
    method: 'GET'
  };
  this.$handler = function (event, res) {
    if (event === 'close') {
      _this.readyState = WebSocket.CLOSED;
    } else if (event === 'open') {
      _this.readyState = WebSocket.OPEN;
    }
    if (_this['on' + event]) {
      _this['on' + event](res);
    }
  };
  try {
    this.$socket = (0, _connectSocket2.default)(this);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

WebSocket.prototype.send = function send(data) {
  if (this.readyState === WebSocket.CONNECTING) {
    throw new _utils.DOMExceptionError("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.");
  }
  if (this.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is already in CLOSING or CLOSED state.');
    return;
  }
  this.$socket.send({
    data: data
  });
};

WebSocket.prototype.close = function close(code, reason) {
  this.readyState = WebSocket.CLOSING;
  if (!this.$socket) {
    throw new _utils.DOMExceptionError("Failed to execute 'close' on 'WebSocket': instance is undefined.");
  }
  this.$socket.close({
    code: code,
    reason: reason
  });
};

WebSocket.CONNECTING = 0; // The connection is not yet open.
WebSocket.OPEN = 1; // The connection is open and ready to communicate.
WebSocket.CLOSING = 2; // The connection is in the process of closing.
WebSocket.CLOSED = 3; // The connection is closed or couldn't be opened.

module.exports = WebSocket;
}, function(modId) {var map = {"./utils":1622286218799,"./connectSocket":1622286218800}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1622286218799, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
function isMy() {
  return typeof my !== 'undefined';
}

var apis = isMy() ? my : wx;

function isString(o) {
  return typeof o === 'string';
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[Object array]';
}

/* eslint-disable no-undef */
var DOMExceptionError = typeof DOMException === 'undefined' ? Error : DOMException;
/* eslint-enable no-undef */

exports.default = {
  isString: isString,
  isArray: isArray,
  DOMExceptionError: DOMExceptionError,
  isMy: isMy,
  apis: apis
};
exports.isString = isString;
exports.isArray = isArray;
exports.DOMExceptionError = DOMExceptionError;
exports.isMy = isMy;
exports.apis = apis;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1622286218800, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectSocket;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _connectSingleSocket = require('./connectSingleSocket');

var _connectSingleSocket2 = _interopRequireDefault(_connectSingleSocket);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('socket.io-wxapp-client:connectSocket');

function socketEventHandle(handler, socketTask) {
  socketTask.onOpen(function () {
    handler('open');
  });
  socketTask.onError(function (res) {
    handler('error', res);
  });
  socketTask.onClose(function () {
    handler('close');
  });
  socketTask.onMessage(function (res) {
    handler('message', res);
  });
}

/**
 * 创建websocket链接，支持旧版本全局实例和新版本多实例
 * @param  {Object} options   websocket参数
 * @param  {Object} instance  当前实例
 * @param  {Function} handler 事件响应
 * @return {Object}           rocketTask { send, close },如果是旧版本,则降级为全
 * 局方法
 */
function connectSocket(instance) {
  if ((0, _utils.isMy)() || (0, _connectSingleSocket.hasSingleSocket)()) {
    return (0, _connectSingleSocket2.default)(instance);
  }
  var socketTask = _utils.apis.connectSocket(instance.$options);
  if (socketTask) {
    log('single, 有返回socketTask, 多socket');
    socketEventHandle(instance.$handler, socketTask);
    return socketTask;
  }
  (0, _connectSingleSocket.setGlobalSocket)(instance);
  return (0, _connectSingleSocket.createSingleSocketTask)(instance);
}
}, function(modId) { var map = {"./connectSingleSocket":1622286218801,"./utils":1622286218799}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1622286218801, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setGlobalSocket = setGlobalSocket;
exports.hasSingleSocket = hasSingleSocket;
exports.createSingleSocketTask = createSingleSocketTask;
exports.default = connectSingleSocket;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _socketGlobalEventHandle = require('./socketGlobalEventHandle');

var _socketGlobalEventHandle2 = _interopRequireDefault(_socketGlobalEventHandle);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalWebsocket = void 0;
var nextGlobalWebsocket = void 0;
var log = (0, _debug2.default)('socket.io-wxapp-client:connectSingleSocket');

function setGlobalSocket(instance) {
  globalWebsocket = instance;
  (0, _socketGlobalEventHandle2.default)(instance.$handler);
}

function hasSingleSocket() {
  return !!globalWebsocket;
}

function popGlobal() {
  _utils.apis.connectSocket(nextGlobalWebsocket.$options);
  setGlobalSocket(nextGlobalWebsocket);
  nextGlobalWebsocket = undefined;
}

function createSingleSocketTask(instance) {
  return {
    send: function send(ops) {
      if (globalWebsocket !== instance) {
        log('error send', 'globalWebsocket !== instance', ops);
        return;
      }
      _utils.apis.sendSocketMessage(ops);
    },
    close: function close(ops) {
      if (globalWebsocket !== instance) {
        log('error close', 'globalWebsocket !== instance', ops);
        instance.$handler('close');
        return;
      }

      _utils.apis.closeSocket(Object.assign({
        success: function success(res) {
          log('closeSocket success', res);
          if (nextGlobalWebsocket) {
            log('nextGlobalWebsocket将连接');
            popGlobal();
          }
        },
        fail: function fail(err) {
          log('closeSocket fail', err);
        }
      }, ops));
    }
  };
}

function connect(instance) {
  if (nextGlobalWebsocket) {
    log('nextGlobalWebsocket被跳过');
    nextGlobalWebsocket = instance;
    return;
  }
  nextGlobalWebsocket = instance;

  if (!globalWebsocket) {
    log('websocket将连接');
    popGlobal();
    return;
  }

  if (globalWebsocket.readyState === 3) {
    log('当前socket为断开状态，将打开新socket');
    popGlobal();
    return;
  }

  globalWebsocket.close();
}

function connectSingleSocket(instance) {
  connect(instance);
  return createSingleSocketTask(instance);
}
}, function(modId) { var map = {"./socketGlobalEventHandle":1622286218802,"./utils":1622286218799}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1622286218802, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('socket.io-wxapp-client:socketGlobalEventHandle');
var isInitSocketGlobalEvent = false;

var defaultGloableEventHandler = function defaultGloableEventHandler() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  log('没有socket全局处理事件 %O', args);
};

function mySocketGlobalEventHandle() {
  var handler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGloableEventHandler;

  // 绑定全局监听initListen
  my.onSocketOpen(function () {
    handler('open');
  });

  my.onSocketError(function (res) {
    handler('error', res);
  });

  my.onSocketClose(function () {
    handler('close');
  });

  my.onSocketMessage(function (res) {
    log('message', res);
    handler('message', res);
  });
}

// 全局事件接受者
var gloableEventHandler = void 0;
/**
 * 监听小程序socket全局的事件
 * @param  {Function} handler 事件接受者
 */
function weSocketGlobalEventHandle() {
  var handler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGloableEventHandler;

  // 设置全局事件接受者
  gloableEventHandler = handler;

  if (isInitSocketGlobalEvent) {
    return;
  }
  isInitSocketGlobalEvent = true;

  // 绑定全局监听initListen
  wx.onSocketOpen(function () {
    gloableEventHandler('open');
  });

  wx.onSocketError(function (res) {
    gloableEventHandler('error', res);
  });

  wx.onSocketClose(function () {
    gloableEventHandler('close');
  });

  wx.onSocketMessage(function (res) {
    log('message', res);
    gloableEventHandler('message', res);
  });
}

exports.default = (0, _utils.isMy)() ? mySocketGlobalEventHandle : weSocketGlobalEventHandle;
}, function(modId) { var map = {"./utils":1622286218799}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1622286218798);
})()
//miniprogram-npm-outsideDeps=["debug"]
//# sourceMappingURL=index.js.map