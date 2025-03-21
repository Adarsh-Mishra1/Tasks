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
      return 5 > a % 10 && a % 10 > 1 && ~~(a / 10) % 10 !== 1;
    }
    function c(b, c, d) {
      var e = b + " ";
      switch (d) {
        case "m":
          return c ? "minuta" : "minutę";
        case "mm":
          return e + (a(b) ? "minuty" : "minut");
        case "h":
          return c ? "godzina" : "godzinę";
        case "hh":
          return e + (a(b) ? "godziny" : "godzin");
        case "MM":
          return e + (a(b) ? "miesiące" : "miesięcy");
        case "yy":
          return e + (a(b) ? "lata" : "lat");
      }
    }
    var d =
        "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split(
          "_",
        ),
      e =
        "stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split(
          "_",
        ),
      f = (b.defineLocale || b.lang).call(b, "pl", {
        months: function (a, b) {
          return "" === b
            ? "(" + e[a.month()] + "|" + d[a.month()] + ")"
            : /D MMMM/.test(b)
              ? e[a.month()]
              : d[a.month()];
        },
        monthsShort: "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split(
          "_",
        ),
        weekdays:
          "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split(
            "_",
          ),
        weekdaysShort: "nie_pon_wt_śr_czw_pt_sb".split("_"),
        weekdaysMin: "Nd_Pn_Wt_Śr_Cz_Pt_So".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm",
        },
        calendar: {
          sameDay: "[Dziś o] LT",
          nextDay: "[Jutro o] LT",
          nextWeek: "[W] dddd [o] LT",
          lastDay: "[Wczoraj o] LT",
          lastWeek: function () {
            switch (this.day()) {
              case 0:
                return "[W zeszłą niedzielę o] LT";
              case 3:
                return "[W zeszłą środę o] LT";
              case 6:
                return "[W zeszłą sobotę o] LT";
              default:
                return "[W zeszły] dddd [o] LT";
            }
          },
          sameElse: "L",
        },
        relativeTime: {
          future: "za %s",
          past: "%s temu",
          s: "kilka sekund",
          m: c,
          mm: c,
          h: c,
          hh: c,
          d: "1 dzień",
          dd: "%d dni",
          M: "miesiąc",
          MM: c,
          y: "rok",
          yy: c,
        },
        ordinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: { dow: 1, doy: 4 },
      });
    return f;
  })(),
    a.fullCalendar.datepickerLang("pl", "pl", {
      closeText: "Zamknij",
      prevText: "&#x3C;Poprzedni",
      nextText: "Następny&#x3E;",
      currentText: "Dziś",
      monthNames: [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień",
      ],
      monthNamesShort: [
        "Sty",
        "Lu",
        "Mar",
        "Kw",
        "Maj",
        "Cze",
        "Lip",
        "Sie",
        "Wrz",
        "Pa",
        "Lis",
        "Gru",
      ],
      dayNames: [
        "Niedziela",
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota",
      ],
      dayNamesShort: ["Nie", "Pn", "Wt", "Śr", "Czw", "Pt", "So"],
      dayNamesMin: ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
      weekHeader: "Tydz",
      dateFormat: "dd.mm.yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("pl", {
      buttonText: {
        month: "Miesiąc",
        week: "Tydzień",
        day: "Dzień",
        list: "Plan dnia",
      },
      allDayText: "Cały dzień",
      eventLimitText: "więcej",
    });
});
