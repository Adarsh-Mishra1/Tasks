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
      return (
        a instanceof Function ||
        "[object Function]" === Object.prototype.toString.call(a)
      );
    }
    var c = (b.defineLocale || b.lang).call(b, "el", {
      monthsNominativeEl:
        "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split(
          "_",
        ),
      monthsGenitiveEl:
        "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split(
          "_",
        ),
      months: function (a, b) {
        return /D/.test(b.substring(0, b.indexOf("MMMM")))
          ? this._monthsGenitiveEl[a.month()]
          : this._monthsNominativeEl[a.month()];
      },
      monthsShort: "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split(
        "_",
      ),
      weekdays: "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split(
        "_",
      ),
      weekdaysShort: "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),
      weekdaysMin: "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),
      meridiem: function (a, b, c) {
        return a > 11 ? (c ? "μμ" : "ΜΜ") : c ? "πμ" : "ΠΜ";
      },
      isPM: function (a) {
        return "μ" === (a + "").toLowerCase()[0];
      },
      meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
      longDateFormat: {
        LT: "h:mm A",
        LTS: "h:mm:ss A",
        L: "DD/MM/YYYY",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY h:mm A",
        LLLL: "dddd, D MMMM YYYY h:mm A",
      },
      calendarEl: {
        sameDay: "[Σήμερα {}] LT",
        nextDay: "[Αύριο {}] LT",
        nextWeek: "dddd [{}] LT",
        lastDay: "[Χθες {}] LT",
        lastWeek: function () {
          switch (this.day()) {
            case 6:
              return "[το προηγούμενο] dddd [{}] LT";
            default:
              return "[την προηγούμενη] dddd [{}] LT";
          }
        },
        sameElse: "L",
      },
      calendar: function (b, c) {
        var d = this._calendarEl[b],
          e = c && c.hours();
        return (
          a(d) && (d = d.apply(c)),
          d.replace("{}", e % 12 === 1 ? "στη" : "στις")
        );
      },
      relativeTime: {
        future: "σε %s",
        past: "%s πριν",
        s: "λίγα δευτερόλεπτα",
        m: "ένα λεπτό",
        mm: "%d λεπτά",
        h: "μία ώρα",
        hh: "%d ώρες",
        d: "μία μέρα",
        dd: "%d μέρες",
        M: "ένας μήνας",
        MM: "%d μήνες",
        y: "ένας χρόνος",
        yy: "%d χρόνια",
      },
      ordinalParse: /\d{1,2}η/,
      ordinal: "%dη",
      week: { dow: 1, doy: 4 },
    });
    return c;
  })(),
    a.fullCalendar.datepickerLang("el", "el", {
      closeText: "Κλείσιμο",
      prevText: "Προηγούμενος",
      nextText: "Επόμενος",
      currentText: "Σήμερα",
      monthNames: [
        "Ιανουάριος",
        "Φεβρουάριος",
        "Μάρτιος",
        "Απρίλιος",
        "Μάιος",
        "Ιούνιος",
        "Ιούλιος",
        "Αύγουστος",
        "Σεπτέμβριος",
        "Οκτώβριος",
        "Νοέμβριος",
        "Δεκέμβριος",
      ],
      monthNamesShort: [
        "Ιαν",
        "Φεβ",
        "Μαρ",
        "Απρ",
        "Μαι",
        "Ιουν",
        "Ιουλ",
        "Αυγ",
        "Σεπ",
        "Οκτ",
        "Νοε",
        "Δεκ",
      ],
      dayNames: [
        "Κυριακή",
        "Δευτέρα",
        "Τρίτη",
        "Τετάρτη",
        "Πέμπτη",
        "Παρασκευή",
        "Σάββατο",
      ],
      dayNamesShort: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"],
      dayNamesMin: ["Κυ", "Δε", "Τρ", "Τε", "Πε", "Πα", "Σα"],
      weekHeader: "Εβδ",
      dateFormat: "dd/mm/yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("el", {
      buttonText: {
        month: "Μήνας",
        week: "Εβδομάδα",
        day: "Ημέρα",
        list: "Ατζέντα",
      },
      allDayText: "Ολοήμερο",
      eventLimitText: "περισσότερα",
    });
});
