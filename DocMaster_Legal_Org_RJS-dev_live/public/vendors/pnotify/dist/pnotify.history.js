(function (b, a) {
  "function" === typeof define && define.amd
    ? define("pnotify.history", ["jquery", "pnotify"], a)
    : "object" === typeof exports && "undefined" !== typeof module
      ? (module.exports = a(require("jquery"), require("./pnotify")))
      : a(b.jQuery, b.PNotify);
})(this, function (b, a) {
  var c, e;
  b(function () {
    b("body")
      .on("pnotify.history-all", function () {
        b.each(a.notices, function () {
          this.modules.history.inHistory &&
            (this.elem.is(":visible")
              ? this.options.hide && this.queueRemove()
              : this.open && this.open());
        });
      })
      .on("pnotify.history-last", function () {
        var b = "top" === a.prototype.options.stack.push,
          d = b ? 0 : -1,
          c;
        do {
          c = -1 === d ? a.notices.slice(d) : a.notices.slice(d, d + 1);
          if (!c[0]) return !1;
          d = b ? d + 1 : d - 1;
        } while (!c[0].modules.history.inHistory || c[0].elem.is(":visible"));
        c[0].open && c[0].open();
      });
  });
  a.prototype.options.history = {
    history: !0,
    menu: !1,
    fixed: !0,
    maxonscreen: Infinity,
    labels: { redisplay: "Redisplay", all: "All", last: "Last" },
  };
  a.prototype.modules.history = {
    inHistory: !1,
    init: function (a, d) {
      a.options.destroy = !1;
      this.inHistory = d.history;
      d.menu &&
        "undefined" === typeof c &&
        ((c = b("<div />", {
          class: "ui-pnotify-history-container " + a.styles.hi_menu,
          mouseleave: function () {
            c.animate({ top: "-" + e + "px" }, { duration: 100, queue: !1 });
          },
        })
          .append(
            b("<div />", {
              class: "ui-pnotify-history-header",
              text: d.labels.redisplay,
            }),
          )
          .append(
            b("<button />", {
              class: "ui-pnotify-history-all " + a.styles.hi_btn,
              text: d.labels.all,
              mouseenter: function () {
                b(this).addClass(a.styles.hi_btnhov);
              },
              mouseleave: function () {
                b(this).removeClass(a.styles.hi_btnhov);
              },
              click: function () {
                b(this).trigger("pnotify.history-all");
                return !1;
              },
            }),
          )
          .append(
            b("<button />", {
              class: "ui-pnotify-history-last " + a.styles.hi_btn,
              text: d.labels.last,
              mouseenter: function () {
                b(this).addClass(a.styles.hi_btnhov);
              },
              mouseleave: function () {
                b(this).removeClass(a.styles.hi_btnhov);
              },
              click: function () {
                b(this).trigger("pnotify.history-last");
                return !1;
              },
            }),
          )
          .appendTo("body")),
        (e =
          b("<span />", {
            class: "ui-pnotify-history-pulldown " + a.styles.hi_hnd,
            mouseenter: function () {
              c.animate({ top: "0" }, { duration: 100, queue: !1 });
            },
          })
            .appendTo(c)
            .offset().top + 2),
        c.css({ top: "-" + e + "px" }),
        d.fixed && c.addClass("ui-pnotify-history-fixed"));
    },
    update: function (a, b) {
      this.inHistory = b.history;
      b.fixed && c
        ? c.addClass("ui-pnotify-history-fixed")
        : c && c.removeClass("ui-pnotify-history-fixed");
    },
    beforeOpen: function (c, d) {
      if (a.notices && a.notices.length > d.maxonscreen) {
        var e;
        e =
          "top" !== c.options.stack.push
            ? a.notices.slice(0, a.notices.length - d.maxonscreen)
            : a.notices.slice(d.maxonscreen, a.notices.length);
        b.each(e, function () {
          this.remove && this.remove();
        });
      }
    },
  };
  b.extend(a.styling.jqueryui, {
    hi_menu: "ui-state-default ui-corner-bottom",
    hi_btn: "ui-state-default ui-corner-all",
    hi_btnhov: "ui-state-hover",
    hi_hnd: "ui-icon ui-icon-grip-dotted-horizontal",
  });
  b.extend(a.styling.bootstrap2, {
    hi_menu: "well",
    hi_btn: "btn",
    hi_btnhov: "",
    hi_hnd: "icon-chevron-down",
  });
  b.extend(a.styling.bootstrap3, {
    hi_menu: "well",
    hi_btn: "btn btn-default",
    hi_btnhov: "",
    hi_hnd: "glyphicon glyphicon-chevron-down",
  });
  b.extend(a.styling.fontawesome, {
    hi_menu: "well",
    hi_btn: "btn btn-default",
    hi_btnhov: "",
    hi_hnd: "fa fa-chevron-down",
  });
});
