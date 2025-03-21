!(function (t, e) {
  "function" == typeof define && define.amd
    ? define("pnotify.reference", ["jquery", "pnotify"], e)
    : "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = e(require("jquery"), require("./pnotify")))
      : e(t.jQuery, t.PNotify);
})(this, function (t, e) {
  (e.prototype.options.reference = {
    put_thing: !1,
    labels: { text: "Spin Around" },
  }),
    (e.prototype.modules.reference = {
      thingElem: null,
      init: function (e, n) {
        var i = this;
        this.notice,
          this.options,
          n.put_thing &&
            ((this.thingElem = t(
              '<button style="float:right;" class="btn btn-default" type="button" disabled><i class="' +
                e.styles.athing +
                '" />&nbsp;' +
                n.labels.text +
                "</button>",
            ).appendTo(e.container)),
            e.container.append('<div style="clear: right; line-height: 0;" />'),
            e.elem.on({
              mouseenter: function (t) {
                i.thingElem.prop("disabled", !1);
              },
              mouseleave: function (t) {
                i.thingElem.prop("disabled", !0);
              },
            }),
            this.thingElem.on("click", function () {
              var t = 0,
                n = setInterval(function () {
                  (t += 10),
                    360 == t && ((t = 0), clearInterval(n)),
                    e.elem.css({
                      "-moz-transform": "rotate(" + t + "deg)",
                      "-webkit-transform": "rotate(" + t + "deg)",
                      "-o-transform": "rotate(" + t + "deg)",
                      "-ms-transform": "rotate(" + t + "deg)",
                      filter:
                        "progid:DXImageTransform.Microsoft.BasicImage(rotation=" +
                        (t / 360) * 4 +
                        ")",
                    });
                }, 20);
            }));
      },
      update: function (t, e, n) {
        this.notice,
          this.options,
          e.put_thing && this.thingElem
            ? this.thingElem.show()
            : !e.put_thing && this.thingElem && this.thingElem.hide(),
          this.thingElem &&
            this.thingElem.find("i").attr("class", t.styles.athing);
      },
      beforeOpen: function (t, e) {},
      afterOpen: function (t, e) {},
      beforeClose: function (t, e) {},
      afterClose: function (t, e) {},
      beforeDestroy: function (t, e) {},
      afterDestroy: function (t, e) {},
    }),
    t.extend(e.styling.jqueryui, { athing: "ui-icon ui-icon-refresh" }),
    t.extend(e.styling.bootstrap2, { athing: "icon-refresh" }),
    t.extend(e.styling.bootstrap3, { athing: "glyphicon glyphicon-refresh" }),
    t.extend(e.styling.fontawesome, { athing: "fa fa-refresh" });
});
