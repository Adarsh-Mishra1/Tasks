!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], a)
    : "object" == typeof exports
      ? (module.exports = a(require("jquery"), require("moment")))
      : a(jQuery, moment);
})(function (a, b) {
  !(function () {
    "use strict";
    var a = (b.defineLocale || b.lang).call(b, "sv", {
      months:
        "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split(
          "_",
        ),
      monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
      weekdays: "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
      weekdaysShort: "sön_mån_tis_ons_tor_fre_lör".split("_"),
      weekdaysMin: "sö_må_ti_on_to_fr_lö".split("_"),
      longDateFormat: {
        LT: "HH:mm",
        LTS: "HH:mm:ss",
        L: "YYYY-MM-DD",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY [kl.] HH:mm",
        LLLL: "dddd D MMMM YYYY [kl.] HH:mm",
        lll: "D MMM YYYY HH:mm",
        llll: "ddd D MMM YYYY HH:mm",
      },
      calendar: {
        sameDay: "[Idag] LT",
        nextDay: "[Imorgon] LT",
        lastDay: "[Igår] LT",
        nextWeek: "[På] dddd LT",
        lastWeek: "[I] dddd[s] LT",
        sameElse: "L",
      },
      relativeTime: {
        future: "om %s",
        past: "för %s sedan",
        s: "några sekunder",
        m: "en minut",
        mm: "%d minuter",
        h: "en timme",
        hh: "%d timmar",
        d: "en dag",
        dd: "%d dagar",
        M: "en månad",
        MM: "%d månader",
        y: "ett år",
        yy: "%d år",
      },
      ordinalParse: /\d{1,2}(e|a)/,
      ordinal: function (a) {
        var b = a % 10,
          c =
            1 === ~~((a % 100) / 10)
              ? "e"
              : 1 === b
                ? "a"
                : 2 === b
                  ? "a"
                  : "e";
        return a + c;
      },
      week: { dow: 1, doy: 4 },
    });
    return a;
  })(),
    a.fullCalendar.datepickerLang("sv", "sv", {
      closeText: "Stäng",
      prevText: "&#xAB;Förra",
      nextText: "Nästa&#xBB;",
      currentText: "Idag",
      monthNames: [
        "Januari",
        "Februari",
        "Mars",
        "April",
        "Maj",
        "Juni",
        "Juli",
        "Augusti",
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
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ],
      dayNamesShort: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
      dayNames: [
        "Söndag",
        "Måndag",
        "Tisdag",
        "Onsdag",
        "Torsdag",
        "Fredag",
        "Lördag",
      ],
      dayNamesMin: ["Sö", "Må", "Ti", "On", "To", "Fr", "Lö"],
      weekHeader: "Ve",
      dateFormat: "yy-mm-dd",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("sv", {
      buttonText: {
        month: "Månad",
        week: "Vecka",
        day: "Dag",
        list: "Program",
      },
      allDayText: "Heldag",
      eventLimitText: "till",
    });
});
