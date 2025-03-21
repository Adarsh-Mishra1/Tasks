!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], a)
    : "object" == typeof exports
      ? (module.exports = a(require("jquery"), require("moment")))
      : a(jQuery, moment);
})(function (a, b) {
  !(function () {
    "use strict";
    var a = (b.defineLocale || b.lang).call(b, "en-ca", {
      months:
        "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_",
        ),
      monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
      weekdays:
        "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
      weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
      longDateFormat: {
        LT: "h:mm A",
        LTS: "h:mm:ss A",
        L: "YYYY-MM-DD",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A",
      },
      calendar: {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L",
      },
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years",
      },
      ordinalParse: /\d{1,2}(st|nd|rd|th)/,
      ordinal: function (a) {
        var b = a % 10,
          c =
            1 === ~~((a % 100) / 10)
              ? "th"
              : 1 === b
                ? "st"
                : 2 === b
                  ? "nd"
                  : 3 === b
                    ? "rd"
                    : "th";
        return a + c;
      },
    });
    return a;
  })(),
    a.fullCalendar.lang("en-ca");
});
