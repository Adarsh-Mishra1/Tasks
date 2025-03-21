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
      return a > 1 && 5 > a;
    }
    function c(b, c, d, e) {
      var f = b + " ";
      switch (d) {
        case "s":
          return c || e ? "pár sekúnd" : "pár sekundami";
        case "m":
          return c ? "minúta" : e ? "minútu" : "minútou";
        case "mm":
          return c || e ? f + (a(b) ? "minúty" : "minút") : f + "minútami";
        case "h":
          return c ? "hodina" : e ? "hodinu" : "hodinou";
        case "hh":
          return c || e ? f + (a(b) ? "hodiny" : "hodín") : f + "hodinami";
        case "d":
          return c || e ? "deň" : "dňom";
        case "dd":
          return c || e ? f + (a(b) ? "dni" : "dní") : f + "dňami";
        case "M":
          return c || e ? "mesiac" : "mesiacom";
        case "MM":
          return c || e ? f + (a(b) ? "mesiace" : "mesiacov") : f + "mesiacmi";
        case "y":
          return c || e ? "rok" : "rokom";
        case "yy":
          return c || e ? f + (a(b) ? "roky" : "rokov") : f + "rokmi";
      }
    }
    var d =
        "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split(
          "_",
        ),
      e = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_"),
      f = (b.defineLocale || b.lang).call(b, "sk", {
        months: d,
        monthsShort: e,
        weekdays: "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split(
          "_",
        ),
        weekdaysShort: "ne_po_ut_st_št_pi_so".split("_"),
        weekdaysMin: "ne_po_ut_st_št_pi_so".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm",
          LLLL: "dddd D. MMMM YYYY H:mm",
        },
        calendar: {
          sameDay: "[dnes o] LT",
          nextDay: "[zajtra o] LT",
          nextWeek: function () {
            switch (this.day()) {
              case 0:
                return "[v nedeľu o] LT";
              case 1:
              case 2:
                return "[v] dddd [o] LT";
              case 3:
                return "[v stredu o] LT";
              case 4:
                return "[vo štvrtok o] LT";
              case 5:
                return "[v piatok o] LT";
              case 6:
                return "[v sobotu o] LT";
            }
          },
          lastDay: "[včera o] LT",
          lastWeek: function () {
            switch (this.day()) {
              case 0:
                return "[minulú nedeľu o] LT";
              case 1:
              case 2:
                return "[minulý] dddd [o] LT";
              case 3:
                return "[minulú stredu o] LT";
              case 4:
              case 5:
                return "[minulý] dddd [o] LT";
              case 6:
                return "[minulú sobotu o] LT";
            }
          },
          sameElse: "L",
        },
        relativeTime: {
          future: "za %s",
          past: "pred %s",
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
    a.fullCalendar.datepickerLang("sk", "sk", {
      closeText: "Zavrieť",
      prevText: "&#x3C;Predchádzajúci",
      nextText: "Nasledujúci&#x3E;",
      currentText: "Dnes",
      monthNames: [
        "január",
        "február",
        "marec",
        "apríl",
        "máj",
        "jún",
        "júl",
        "august",
        "september",
        "október",
        "november",
        "december",
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Máj",
        "Jún",
        "Júl",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ],
      dayNames: [
        "nedeľa",
        "pondelok",
        "utorok",
        "streda",
        "štvrtok",
        "piatok",
        "sobota",
      ],
      dayNamesShort: ["Ned", "Pon", "Uto", "Str", "Štv", "Pia", "Sob"],
      dayNamesMin: ["Ne", "Po", "Ut", "St", "Št", "Pia", "So"],
      weekHeader: "Ty",
      dateFormat: "dd.mm.yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("sk", {
      buttonText: {
        month: "Mesiac",
        week: "Týždeň",
        day: "Deň",
        list: "Rozvrh",
      },
      allDayText: "Celý deň",
      eventLimitText: function (a) {
        return "+ďalšie: " + a;
      },
    });
});
