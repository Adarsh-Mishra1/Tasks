!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], a)
    : "object" == typeof exports
      ? (module.exports = a(require("jquery"), require("moment")))
      : a(jQuery, moment);
})(function (a, b) {
  !(function () {
    "use strict";
    function a(a) {
      return a > 1 && 5 > a && 1 !== ~~(a / 10);
    }
    function c(b, c, d, e) {
      var f = b + " ";
      switch (d) {
        case "s":
          return c || e ? "pár sekund" : "pár sekundami";
        case "m":
          return c ? "minuta" : e ? "minutu" : "minutou";
        case "mm":
          return c || e ? f + (a(b) ? "minuty" : "minut") : f + "minutami";
        case "h":
          return c ? "hodina" : e ? "hodinu" : "hodinou";
        case "hh":
          return c || e ? f + (a(b) ? "hodiny" : "hodin") : f + "hodinami";
        case "d":
          return c || e ? "den" : "dnem";
        case "dd":
          return c || e ? f + (a(b) ? "dny" : "dní") : f + "dny";
        case "M":
          return c || e ? "měsíc" : "měsícem";
        case "MM":
          return c || e ? f + (a(b) ? "měsíce" : "měsíců") : f + "měsíci";
        case "y":
          return c || e ? "rok" : "rokem";
        case "yy":
          return c || e ? f + (a(b) ? "roky" : "let") : f + "lety";
      }
    }
    var d =
        "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split(
          "_",
        ),
      e = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"),
      f = (b.defineLocale || b.lang).call(b, "cs", {
        months: d,
        monthsShort: e,
        monthsParse: (function (a, b) {
          var c,
            d = [];
          for (c = 0; 12 > c; c++)
            d[c] = new RegExp("^" + a[c] + "$|^" + b[c] + "$", "i");
          return d;
        })(d, e),
        shortMonthsParse: (function (a) {
          var b,
            c = [];
          for (b = 0; 12 > b; b++) c[b] = new RegExp("^" + a[b] + "$", "i");
          return c;
        })(e),
        longMonthsParse: (function (a) {
          var b,
            c = [];
          for (b = 0; 12 > b; b++) c[b] = new RegExp("^" + a[b] + "$", "i");
          return c;
        })(d),
        weekdays: "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
        weekdaysShort: "ne_po_út_st_čt_pá_so".split("_"),
        weekdaysMin: "ne_po_út_st_čt_pá_so".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm",
          LLLL: "dddd D. MMMM YYYY H:mm",
        },
        calendar: {
          sameDay: "[dnes v] LT",
          nextDay: "[zítra v] LT",
          nextWeek: function () {
            switch (this.day()) {
              case 0:
                return "[v neděli v] LT";
              case 1:
              case 2:
                return "[v] dddd [v] LT";
              case 3:
                return "[ve středu v] LT";
              case 4:
                return "[ve čtvrtek v] LT";
              case 5:
                return "[v pátek v] LT";
              case 6:
                return "[v sobotu v] LT";
            }
          },
          lastDay: "[včera v] LT",
          lastWeek: function () {
            switch (this.day()) {
              case 0:
                return "[minulou neděli v] LT";
              case 1:
              case 2:
                return "[minulé] dddd [v] LT";
              case 3:
                return "[minulou středu v] LT";
              case 4:
              case 5:
                return "[minulý] dddd [v] LT";
              case 6:
                return "[minulou sobotu v] LT";
            }
          },
          sameElse: "L",
        },
        relativeTime: {
          future: "za %s",
          past: "před %s",
          s: c,
          m: c,
          mm: c,
          h: c,
          hh: c,
          d: c,
          dd: c,
          M: c,
          MM: c,
          y: c,
          yy: c,
        },
        ordinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: { dow: 1, doy: 4 },
      });
    return f;
  })(),
    a.fullCalendar.datepickerLang("cs", "cs", {
      closeText: "Zavřít",
      prevText: "&#x3C;Dříve",
      nextText: "Později&#x3E;",
      currentText: "Nyní",
      monthNames: [
        "leden",
        "únor",
        "březen",
        "duben",
        "květen",
        "červen",
        "červenec",
        "srpen",
        "září",
        "říjen",
        "listopad",
        "prosinec",
      ],
      monthNamesShort: [
        "led",
        "úno",
        "bře",
        "dub",
        "kvě",
        "čer",
        "čvc",
        "srp",
        "zář",
        "říj",
        "lis",
        "pro",
      ],
      dayNames: [
        "neděle",
        "pondělí",
        "úterý",
        "středa",
        "čtvrtek",
        "pátek",
        "sobota",
      ],
      dayNamesShort: ["ne", "po", "út", "st", "čt", "pá", "so"],
      dayNamesMin: ["ne", "po", "út", "st", "čt", "pá", "so"],
      weekHeader: "Týd",
      dateFormat: "dd.mm.yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("cs", {
      buttonText: { month: "Měsíc", week: "Týden", day: "Den", list: "Agenda" },
      allDayText: "Celý den",
      eventLimitText: function (a) {
        return "+další: " + a;
      },
    });
});
