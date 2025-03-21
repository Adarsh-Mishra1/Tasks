!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], a)
    : "object" == typeof exports
      ? (module.exports = a(require("jquery"), require("moment")))
      : a(jQuery, moment);
})(function (a, b) {
  !(function () {
    "use strict";
    var a = (b.defineLocale || b.lang).call(b, "ca", {
      months:
        "gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split(
          "_",
        ),
      monthsShort:
        "gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split(
          "_",
        ),
      monthsParseExact: !0,
      weekdays:
        "diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split(
          "_",
        ),
      weekdaysShort: "dg._dl._dt._dc._dj._dv._ds.".split("_"),
      weekdaysMin: "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),
      weekdaysParseExact: !0,
      longDateFormat: {
        LT: "H:mm",
        LTS: "H:mm:ss",
        L: "DD/MM/YYYY",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY H:mm",
        LLLL: "dddd D MMMM YYYY H:mm",
      },
      calendar: {
        sameDay: function () {
          return "[avui a " + (1 !== this.hours() ? "les" : "la") + "] LT";
        },
        nextDay: function () {
          return "[demà a " + (1 !== this.hours() ? "les" : "la") + "] LT";
        },
        nextWeek: function () {
          return "dddd [a " + (1 !== this.hours() ? "les" : "la") + "] LT";
        },
        lastDay: function () {
          return "[ahir a " + (1 !== this.hours() ? "les" : "la") + "] LT";
        },
        lastWeek: function () {
          return (
            "[el] dddd [passat a " +
            (1 !== this.hours() ? "les" : "la") +
            "] LT"
          );
        },
        sameElse: "L",
      },
      relativeTime: {
        future: "en %s",
        past: "fa %s",
        s: "uns segons",
        m: "un minut",
        mm: "%d minuts",
        h: "una hora",
        hh: "%d hores",
        d: "un dia",
        dd: "%d dies",
        M: "un mes",
        MM: "%d mesos",
        y: "un any",
        yy: "%d anys",
      },
      ordinalParse: /\d{1,2}(r|n|t|è|a)/,
      ordinal: function (a, b) {
        var c =
          1 === a ? "r" : 2 === a ? "n" : 3 === a ? "r" : 4 === a ? "t" : "è";
        return ("w" !== b && "W" !== b) || (c = "a"), a + c;
      },
      week: { dow: 1, doy: 4 },
    });
    return a;
  })(),
    a.fullCalendar.datepickerLang("ca", "ca", {
      closeText: "Tanca",
      prevText: "Anterior",
      nextText: "Següent",
      currentText: "Avui",
      monthNames: [
        "gener",
        "febrer",
        "març",
        "abril",
        "maig",
        "juny",
        "juliol",
        "agost",
        "setembre",
        "octubre",
        "novembre",
        "desembre",
      ],
      monthNamesShort: [
        "gen",
        "feb",
        "març",
        "abr",
        "maig",
        "juny",
        "jul",
        "ag",
        "set",
        "oct",
        "nov",
        "des",
      ],
      dayNames: [
        "diumenge",
        "dilluns",
        "dimarts",
        "dimecres",
        "dijous",
        "divendres",
        "dissabte",
      ],
      dayNamesShort: ["dg", "dl", "dt", "dc", "dj", "dv", "ds"],
      dayNamesMin: ["dg", "dl", "dt", "dc", "dj", "dv", "ds"],
      weekHeader: "Set",
      dateFormat: "dd/mm/yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("ca", {
      buttonText: { month: "Mes", week: "Setmana", day: "Dia", list: "Agenda" },
      allDayText: "Tot el dia",
      eventLimitText: "més",
    });
});
