!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], a)
    : "object" == typeof exports
      ? (module.exports = a(require("jquery"), require("moment")))
      : a(jQuery, moment);
})(function (a, b) {
  !(function () {
    "use strict";
    var a = {
        1: "۱",
        2: "۲",
        3: "۳",
        4: "۴",
        5: "۵",
        6: "۶",
        7: "۷",
        8: "۸",
        9: "۹",
        0: "۰",
      },
      c = {
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
        "۰": "0",
      },
      d = (b.defineLocale || b.lang).call(b, "fa", {
        months:
          "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split(
            "_",
          ),
        monthsShort:
          "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split(
            "_",
          ),
        weekdays: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split(
          "_",
        ),
        weekdaysShort:
          "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
        weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_"),
        weekdaysParseExact: !0,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm",
        },
        meridiemParse: /قبل از ظهر|بعد از ظهر/,
        isPM: function (a) {
          return /بعد از ظهر/.test(a);
        },
        meridiem: function (a, b, c) {
          return 12 > a ? "قبل از ظهر" : "بعد از ظهر";
        },
        calendar: {
          sameDay: "[امروز ساعت] LT",
          nextDay: "[فردا ساعت] LT",
          nextWeek: "dddd [ساعت] LT",
          lastDay: "[دیروز ساعت] LT",
          lastWeek: "dddd [پیش] [ساعت] LT",
          sameElse: "L",
        },
        relativeTime: {
          future: "در %s",
          past: "%s پیش",
          s: "چندین ثانیه",
          m: "یک دقیقه",
          mm: "%d دقیقه",
          h: "یک ساعت",
          hh: "%d ساعت",
          d: "یک روز",
          dd: "%d روز",
          M: "یک ماه",
          MM: "%d ماه",
          y: "یک سال",
          yy: "%d سال",
        },
        preparse: function (a) {
          return a
            .replace(/[۰-۹]/g, function (a) {
              return c[a];
            })
            .replace(/،/g, ",");
        },
        postformat: function (b) {
          return b
            .replace(/\d/g, function (b) {
              return a[b];
            })
            .replace(/,/g, "،");
        },
        ordinalParse: /\d{1,2}م/,
        ordinal: "%dم",
        week: { dow: 6, doy: 12 },
      });
    return d;
  })(),
    a.fullCalendar.datepickerLang("fa", "fa", {
      closeText: "بستن",
      prevText: "&#x3C;قبلی",
      nextText: "بعدی&#x3E;",
      currentText: "امروز",
      monthNames: [
        "ژانویه",
        "فوریه",
        "مارس",
        "آوریل",
        "مه",
        "ژوئن",
        "ژوئیه",
        "اوت",
        "سپتامبر",
        "اکتبر",
        "نوامبر",
        "دسامبر",
      ],
      monthNamesShort: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ],
      dayNames: [
        "يکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
        "شنبه",
      ],
      dayNamesShort: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
      dayNamesMin: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
      weekHeader: "هف",
      dateFormat: "yy/mm/dd",
      firstDay: 6,
      isRTL: !0,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("fa", {
      buttonText: { month: "ماه", week: "هفته", day: "روز", list: "برنامه" },
      allDayText: "تمام روز",
      eventLimitText: function (a) {
        return "بیش از " + a;
      },
    });
});
