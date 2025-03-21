(function (e, c) {
  "function" === typeof define && define.amd
    ? define("pnotify.desktop", ["jquery", "pnotify"], c)
    : "object" === typeof exports && "undefined" !== typeof module
      ? (module.exports = c(require("jquery"), require("./pnotify")))
      : c(e.jQuery, e.PNotify);
})(this, function (e, c) {
  var d,
    f = function (a, b) {
      f =
        "Notification" in window
          ? function (a, b) {
              return new Notification(a, b);
            }
          : "mozNotification" in navigator
            ? function (a, b) {
                return navigator.mozNotification
                  .createNotification(a, b.body, b.icon)
                  .show();
              }
            : "webkitNotifications" in window
              ? function (a, b) {
                  return window.webkitNotifications.createNotification(
                    b.icon,
                    a,
                    b.body,
                  );
                }
              : function (a, b) {
                  return null;
                };
      return f(a, b);
    };
  c.prototype.options.desktop = {
    desktop: !1,
    fallback: !0,
    icon: null,
    tag: null,
  };
  c.prototype.modules.desktop = {
    tag: null,
    icon: null,
    genNotice: function (a, b) {
      this.icon =
        null === b.icon
          ? "http://sciactive.com/pnotify/includes/desktop/" +
            a.options.type +
            ".png"
          : !1 === b.icon
            ? null
            : b.icon;
      if (null === this.tag || null !== b.tag)
        this.tag =
          null === b.tag ? "PNotify-" + Math.round(1e6 * Math.random()) : b.tag;
      a.desktop = f(a.options.title, {
        icon: this.icon,
        body: b.text || a.options.text,
        tag: this.tag,
      });
      !("close" in a.desktop) &&
        "cancel" in a.desktop &&
        (a.desktop.close = function () {
          a.desktop.cancel();
        });
      a.desktop.onclick = function () {
        a.elem.trigger("click");
      };
      a.desktop.onclose = function () {
        "closing" !== a.state && "closed" !== a.state && a.remove();
      };
    },
    init: function (a, b) {
      b.desktop &&
        ((d = c.desktop.checkPermission()),
        0 !== d
          ? b.fallback || (a.options.auto_display = !1)
          : this.genNotice(a, b));
    },
    update: function (a, b, c) {
      (0 !== d && b.fallback) || !b.desktop || this.genNotice(a, b);
    },
    beforeOpen: function (a, b) {
      (0 !== d && b.fallback) ||
        !b.desktop ||
        a.elem.css({ left: "-10000px" }).removeClass("ui-pnotify-in");
    },
    afterOpen: function (a, b) {
      (0 !== d && b.fallback) ||
        !b.desktop ||
        (a.elem.css({ left: "-10000px" }).removeClass("ui-pnotify-in"),
        "show" in a.desktop && a.desktop.show());
    },
    beforeClose: function (a, b) {
      (0 !== d && b.fallback) ||
        !b.desktop ||
        a.elem.css({ left: "-10000px" }).removeClass("ui-pnotify-in");
    },
    afterClose: function (a, b) {
      (0 !== d && b.fallback) ||
        !b.desktop ||
        (a.elem.css({ left: "-10000px" }).removeClass("ui-pnotify-in"),
        "close" in a.desktop && a.desktop.close());
    },
  };
  c.desktop = {
    permission: function () {
      "undefined" !== typeof Notification && "requestPermission" in Notification
        ? Notification.requestPermission()
        : "webkitNotifications" in window &&
          window.webkitNotifications.requestPermission();
    },
    checkPermission: function () {
      return "undefined" !== typeof Notification && "permission" in Notification
        ? "granted" === Notification.permission
          ? 0
          : 1
        : "webkitNotifications" in window
          ? 0 == window.webkitNotifications.checkPermission()
            ? 0
            : 1
          : 1;
    },
  };
  d = c.desktop.checkPermission();
});
