!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], a)
    : "object" == typeof exports
      ? (module.exports = a(require("jquery"), require("moment")))
      : a(jQuery, moment);
})(function (a, b) {
  !(function () {
    "use strict";
    function a(a, b, c, d) {
      var e = a + " ";
      switch (c) {
        case "s":
          return b || d ? "nekaj sekund" : "nekaj sekundami";
        case "m":
          return b ? "ena minuta" : "eno minuto";
        case "mm":
          return (e +=
            1 === a
              ? b
                ? "minuta"
                : "minuto"
              : 2 === a
                ? b || d
                  ? "minuti"
                  : "minutama"
                : 5 > a
                  ? b || d
                    ? "minute"
                    : "minutami"
                  : b || d
                    ? "minut"
                    : "minutami");
        case "h":
          return b ? "ena ura" : "eno uro";
        case "hh":
          return (e +=
            1 === a
              ? b
                ? "ura"
                : "uro"
              : 2 === a
                ? b || d
                  ? "uri"
                  : "urama"
                : 5 > a
                  ? b || d
                    ? "ure"
                    : "urami"
                  : b || d
                    ? "ur"
                    : "urami");
        case "d":
          return b || d ? "en dan" : "enim dnem";
        case "dd":
          return (e +=
            1 === a
              ? b || d
                ? "dan"
                : "dnem"
              : 2 === a
                ? b || d
                  ? "dni"
                  : "dnevoma"
                : b || d
                  ? "dni"
                  : "dnevi");
        case "M":
          return b || d ? "en mesec" : "enim mesecem";
        case "MM":
          return (e +=
            1 === a
              ? b || d
                ? "mesec"
                : "mesecem"
              : 2 === a
                ? b || d
                  ? "meseca"
                  : "mesecema"
                : 5 > a
                  ? b || d
                    ? "mesece"
                    : "meseci"
                  : b || d
                    ? "mesecev"
                    : "meseci");
        case "y":
          return b || d ? "eno leto" : "enim letom";
        case "yy":
          return (e +=
            1 === a
              ? b || d
                ? "leto"
                : "letom"
              : 2 === a
                ? b || d
                  ? "leti"
                  : "letoma"
                : 5 > a
                  ? b || d
                    ? "leta"
                    : "leti"
                  : b || d
                    ? "let"
                    : "leti");
      }
    }
    var c = (b.defineLocale || b.lang).call(b, "sl", {
      months:
        "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split(
          "_",
        ),
      monthsShort:
        "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split(
          "_",
        ),
      monthsParseExact: !0,
      weekdays: "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split(
        "_",
      ),
      weekdaysShort: "ned._pon._tor._sre._čet._pet._sob.".split("_"),
      weekdaysMin: "ne_po_to_sr_če_pe_so".split("_"),
      weekdaysParseExact: !0,
      longDateFormat: {
        LT: "H:mm",
        LTS: "H:mm:ss",
        L: "DD. MM. YYYY",
        LL: "D. MMMM YYYY",
        LLL: "D. MMMM YYYY H:mm",
        LLLL: "dddd, D. MMMM YYYY H:mm",
      },
      calendar: {
        sameDay: "[danes ob] LT",
        nextDay: "[jutri ob] LT",
        nextWeek: function () {
          switch (this.day()) {
            case 0:
              return "[v] [nedeljo] [ob] LT";
            case 3:
              return "[v] [sredo] [ob] LT";
            case 6:
              return "[v] [soboto] [ob] LT";
            case 1:
            case 2:
            case 4:
            case 5:
              return "[v] dddd [ob] LT";
          }
        },
        lastDay: "[včeraj ob] LT",
        lastWeek: function () {
          switch (this.day()) {
            case 0:
              return "[prejšnjo] [nedeljo] [ob] LT";
            case 3:
              return "[prejšnjo] [sredo] [ob] LT";
            case 6:
              return "[prejšnjo] [soboto] [ob] LT";
            case 1:
            case 2:
            case 4:
            case 5:
              return "[prejšnji] dddd [ob] LT";
          }
        },
        sameElse: "L",
      },
      relativeTime: {
        future: "čez %s",
        past: "pred %s",
        s: a,
        m: a,
        mm: a,
        h: a,
        hh: a,
        d: a,
        dd: a,
        M: a,
        MM: a,
        y: a,
        yy: a,
      },
      ordinalParse: /\d{1,2}\./,
      ordinal: "%d.",
      week: { dow: 1, doy: 7 },
    });
    return c;
  })(),
    a.fullCalendar.datepickerLang("sl", "sl", {
      closeText: "Zapri",
      prevText: "&#x3C;Prejšnji",
      nextText: "Naslednji&#x3E;",
      currentText: "Trenutni",
      monthNames: [
        "Januar",
        "Februar",
        "Marec",
        "April",
        "Maj",
        "Junij",
        "Julij",
        "Avgust",
        "September",
        "Oktober",
        "November",
        "December",
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Maj",
        "Jun",
        "Jul",
        "Avg",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ],
      dayNames: [
        "Nedelja",
        "Ponedeljek",
        "Torek",
        "Sreda",
        "Četrtek",
        "Petek",
        "Sobota",
      ],
      dayNamesShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
      dayNamesMin: ["Ne", "Po", "To", "Sr", "Če", "Pe", "So"],
      weekHeader: "Teden",
      dateFormat: "dd.mm.yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("sl", {
      buttonText: {
        month: "Mesec",
        week: "Teden",
        day: "Dan",
        list: "Dnevni red",
      },
      allDayText: "Ves dan",
      eventLimitText: "več",
    });
});
