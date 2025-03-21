(function (e, c) {
  "function" === typeof define && define.amd
    ? define("pnotify.confirm", ["jquery", "pnotify"], c)
    : "object" === typeof exports && "undefined" !== typeof module
      ? (module.exports = c(require("jquery"), require("./pnotify")))
      : c(e.jQuery, e.PNotify);
})(this, function (e, c) {
  c.prototype.options.confirm = {
    confirm: !1,
    prompt: !1,
    prompt_class: "",
    prompt_default: "",
    prompt_multi_line: !1,
    align: "right",
    buttons: [
      {
        text: "Ok",
        addClass: "",
        promptTrigger: !0,
        click: function (b, a) {
          b.remove();
          b.get().trigger("pnotify.confirm", [b, a]);
        },
      },
      {
        text: "Cancel",
        addClass: "",
        click: function (b) {
          b.remove();
          b.get().trigger("pnotify.cancel", b);
        },
      },
    ],
  };
  c.prototype.modules.confirm = {
    container: null,
    prompt: null,
    init: function (b, a) {
      this.container = e(
        '<div class="ui-pnotify-action-bar" style="margin-top:5px;clear:both;" />',
      )
        .css("text-align", a.align)
        .appendTo(b.container);
      a.confirm || a.prompt ? this.makeDialog(b, a) : this.container.hide();
    },
    update: function (b, a) {
      a.confirm
        ? (this.makeDialog(b, a), this.container.show())
        : this.container.hide().empty();
    },
    afterOpen: function (b, a) {
      a.prompt && this.prompt.focus();
    },
    makeDialog: function (b, a) {
      var h = !1,
        l = this,
        g,
        d;
      this.container.empty();
      a.prompt &&
        (this.prompt = e(
          "<" +
            (a.prompt_multi_line ? 'textarea rows="5"' : 'input type="text"') +
            ' style="margin-bottom:5px;clear:both;" />',
        )
          .addClass(
            ("undefined" === typeof b.styles.input ? "" : b.styles.input) +
              " " +
              ("undefined" === typeof a.prompt_class ? "" : a.prompt_class),
          )
          .val(a.prompt_default)
          .appendTo(this.container));
      for (
        var m =
            a.buttons[0] &&
            a.buttons[0] !== c.prototype.options.confirm.buttons[0],
          f = 0;
        f < a.buttons.length;
        f++
      )
        if (
          !(
            null === a.buttons[f] ||
            (m &&
              c.prototype.options.confirm.buttons[f] &&
              c.prototype.options.confirm.buttons[f] === a.buttons[f])
          )
        ) {
          g = a.buttons[f];
          h ? this.container.append(" ") : (h = !0);
          d = e('<button type="button" class="ui-pnotify-action-button" />')
            .addClass(
              ("undefined" === typeof b.styles.btn ? "" : b.styles.btn) +
                " " +
                ("undefined" === typeof g.addClass ? "" : g.addClass),
            )
            .text(g.text)
            .appendTo(this.container)
            .on(
              "click",
              (function (k) {
                return function () {
                  "function" == typeof k.click &&
                    k.click(b, a.prompt ? l.prompt.val() : null);
                };
              })(g),
            );
          a.prompt &&
            !a.prompt_multi_line &&
            g.promptTrigger &&
            this.prompt.keypress(
              (function (b) {
                return function (a) {
                  13 == a.keyCode && b.click();
                };
              })(d),
            );
          b.styles.text &&
            d.wrapInner('<span class="' + b.styles.text + '"></span>');
          b.styles.btnhover &&
            d.hover(
              (function (a) {
                return function () {
                  a.addClass(b.styles.btnhover);
                };
              })(d),
              (function (a) {
                return function () {
                  a.removeClass(b.styles.btnhover);
                };
              })(d),
            );
          if (b.styles.btnactive)
            d.on(
              "mousedown",
              (function (a) {
                return function () {
                  a.addClass(b.styles.btnactive);
                };
              })(d),
            ).on(
              "mouseup",
              (function (a) {
                return function () {
                  a.removeClass(b.styles.btnactive);
                };
              })(d),
            );
          if (b.styles.btnfocus)
            d.on(
              "focus",
              (function (a) {
                return function () {
                  a.addClass(b.styles.btnfocus);
                };
              })(d),
            ).on(
              "blur",
              (function (a) {
                return function () {
                  a.removeClass(b.styles.btnfocus);
                };
              })(d),
            );
        }
    },
  };
  e.extend(c.styling.jqueryui, {
    btn: "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only",
    btnhover: "ui-state-hover",
    btnactive: "ui-state-active",
    btnfocus: "ui-state-focus",
    input: "",
    text: "ui-button-text",
  });
  e.extend(c.styling.bootstrap2, { btn: "btn", input: "" });
  e.extend(c.styling.bootstrap3, {
    btn: "btn btn-default",
    input: "form-control",
  });
  e.extend(c.styling.fontawesome, {
    btn: "btn btn-default",
    input: "form-control",
  });
});
