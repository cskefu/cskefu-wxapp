module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1622286218750, function(require, module, exports) {
/**
 * Module dependencies.
 */

var AssertionError = require('assert').AssertionError
  , callsite = require('callsite')
  , fs = require('fs')

/**
 * Expose `assert`.
 */

module.exports = process.env.NO_ASSERT
  ? function(){}
  : assert;

/**
 * Assert the given `expr`.
 */

function assert(expr) {
  if (expr) return;

  var stack = callsite();
  var call = stack[1];
  var file = call.getFileName();
  var lineno = call.getLineNumber();
  var src = fs.readFileSync(file, 'utf8');
  var line = src.split('\n')[lineno-1];
  var src = line.match(/assert\((.*)\)/)[1];

  var err = new AssertionError({
    message: src,
    stackStartFunction: stack[0].getFunction()
  });

  throw err;
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1622286218750);
})()
//miniprogram-npm-outsideDeps=["assert","callsite","fs"]
//# sourceMappingURL=index.js.map