!(function (e, o) {
  "function" == typeof define && define.amd
    ? define("pnotify.tooltip", ["jquery", "pnotify"], o)
    : "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = o(require("jquery"), require("./pnotify")))
      : o(e.jQuery, e.PNotify);
})(this, function (e, o) {});
