!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], a)
    : "object" == typeof exports
      ? (module.exports = a(require("jquery"), require("moment")))
      : a(jQuery, moment);
})(function (a, b) {
  !(function () {
    "use strict";
    function a(a, b, c) {
      return c
        ? b % 10 === 1 && 11 !== b
          ? a[2]
          : a[3]
        : b % 10 === 1 && 11 !== b
          ? a[0]
          : a[1];
    }
    function c(b, c, d) {
      return b + " " + a(f[d], b, c);
    }
    function d(b, c, d) {
      return a(f[d], b, c);
    }
    function e(a, b) {
      return b ? "dažas sekundes" : "dažām sekundēm";
    }
    var f = {
        m: "minūtes_minūtēm_minūte_minūtes".split("_"),
        mm: "minūtes_minūtēm_minūte_minūtes".split("_"),
        h: "stundas_stundām_stunda_stundas".split("_"),
        hh: "stundas_stundām_stunda_stundas".split("_"),
        d: "dienas_dienām_diena_dienas".split("_"),
        dd: "dienas_dienām_diena_dienas".split("_"),
        M: "mēneša_mēnešiem_mēnesis_mēneši".split("_"),
        MM: "mēneša_mēnešiem_mēnesis_mēneši".split("_"),
        y: "gada_gadiem_gads_gadi".split("_"),
        yy: "gada_gadiem_gads_gadi".split("_"),
      },
      g = (b.defineLocale || b.lang).call(b, "lv", {
        months:
          "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split(
            "_",
          ),
        monthsShort: "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split(
          "_",
        ),
        weekdays:
          "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split(
            "_",
          ),
        weekdaysShort: "Sv_P_O_T_C_Pk_S".split("_"),
        weekdaysMin: "Sv_P_O_T_C_Pk_S".split("_"),
        weekdaysParseExact: !0,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY.",
          LL: "YYYY. [gada] D. MMMM",
          LLL: "YYYY. [gada] D. MMMM, HH:mm",
          LLLL: "YYYY. [gada] D. MMMM, dddd, HH:mm",
        },
        calendar: {
          sameDay: "[Šodien pulksten] LT",
          nextDay: "[Rīt pulksten] LT",
          nextWeek: "dddd [pulksten] LT",
          lastDay: "[Vakar pulksten] LT",
          lastWeek: "[Pagājušā] dddd [pulksten] LT",
          sameElse: "L",
        },
        relativeTime: {
          future: "pēc %s",
          past: "pirms %s",
          s: e,
          m: d,
          mm: c,
          h: d,
          hh: c,
          d: d,
          dd: c,
          M: d,
          MM: c,
          y: d,
          yy: c,
        },
        ordinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: { dow: 1, doy: 4 },
      });
    return g;
  })(),
    a.fullCalendar.datepickerLang("lv", "lv", {
      closeText: "Aizvērt",
      prevText: "Iepr.",
      nextText: "Nāk.",
      currentText: "Šodien",
      monthNames: [
        "Janvāris",
        "Februāris",
        "Marts",
        "Aprīlis",
        "Maijs",
        "Jūnijs",
        "Jūlijs",
        "Augusts",
        "Septembris",
        "Oktobris",
        "Novembris",
        "Decembris",
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mai",
        "Jūn",
        "Jūl",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ],
      dayNames: [
        "svētdiena",
        "pirmdiena",
        "otrdiena",
        "trešdiena",
        "ceturtdiena",
        "piektdiena",
        "sestdiena",
      ],
      dayNamesShort: ["svt", "prm", "otr", "tre", "ctr", "pkt", "sst"],
      dayNamesMin: ["Sv", "Pr", "Ot", "Tr", "Ct", "Pk", "Ss"],
      weekHeader: "Ned.",
      dateFormat: "dd.mm.yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("lv", {
      buttonText: {
        month: "Mēnesis",
        week: "Nedēļa",
        day: "Diena",
        list: "Dienas kārtība",
      },
      allDayText: "Visu dienu",
      eventLimitText: function (a) {
        return "+vēl " + a;
      },
    });
});
