!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], a)
    : "object" == typeof exports
      ? (module.exports = a(require("jquery"), require("moment")))
      : a(jQuery, moment);
})(function (a, b) {
  !(function () {
    "use strict";
    function a(a, b) {
      var c = a.split("_");
      return b % 10 === 1 && b % 100 !== 11
        ? c[0]
        : b % 10 >= 2 && 4 >= b % 10 && (10 > b % 100 || b % 100 >= 20)
          ? c[1]
          : c[2];
    }
    function c(b, c, d) {
      var e = {
        mm: c ? "минута_минуты_минут" : "минуту_минуты_минут",
        hh: "час_часа_часов",
        dd: "день_дня_дней",
        MM: "месяц_месяца_месяцев",
        yy: "год_года_лет",
      };
      return "m" === d ? (c ? "минута" : "минуту") : b + " " + a(e[d], +b);
    }
    var d = [
        /^янв/i,
        /^фев/i,
        /^мар/i,
        /^апр/i,
        /^ма[йя]/i,
        /^июн/i,
        /^июл/i,
        /^авг/i,
        /^сен/i,
        /^окт/i,
        /^ноя/i,
        /^дек/i,
      ],
      e = (b.defineLocale || b.lang).call(b, "ru", {
        months: {
          format:
            "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split(
              "_",
            ),
          standalone:
            "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split(
              "_",
            ),
        },
        monthsShort: {
          format:
            "янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split(
              "_",
            ),
          standalone:
            "янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split(
              "_",
            ),
        },
        weekdays: {
          standalone:
            "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split(
              "_",
            ),
          format:
            "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split(
              "_",
            ),
          isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/,
        },
        weekdaysShort: "вс_пн_вт_ср_чт_пт_сб".split("_"),
        weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split("_"),
        monthsParse: d,
        longMonthsParse: d,
        shortMonthsParse: d,
        monthsRegex:
          /^(сентябр[яь]|октябр[яь]|декабр[яь]|феврал[яь]|январ[яь]|апрел[яь]|августа?|ноябр[яь]|сент\.|февр\.|нояб\.|июнь|янв.|июль|дек.|авг.|апр.|марта|мар[.т]|окт.|июн[яь]|июл[яь]|ма[яй])/i,
        monthsShortRegex:
          /^(сентябр[яь]|октябр[яь]|декабр[яь]|феврал[яь]|январ[яь]|апрел[яь]|августа?|ноябр[яь]|сент\.|февр\.|нояб\.|июнь|янв.|июль|дек.|авг.|апр.|марта|мар[.т]|окт.|июн[яь]|июл[яь]|ма[яй])/i,
        monthsStrictRegex:
          /^(сентябр[яь]|октябр[яь]|декабр[яь]|феврал[яь]|январ[яь]|апрел[яь]|августа?|ноябр[яь]|марта?|июн[яь]|июл[яь]|ма[яй])/i,
        monthsShortStrictRegex:
          /^(нояб\.|февр\.|сент\.|июль|янв\.|июн[яь]|мар[.т]|авг\.|апр\.|окт\.|дек\.|ма[яй])/i,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY г.",
          LLL: "D MMMM YYYY г., HH:mm",
          LLLL: "dddd, D MMMM YYYY г., HH:mm",
        },
        calendar: {
          sameDay: "[Сегодня в] LT",
          nextDay: "[Завтра в] LT",
          lastDay: "[Вчера в] LT",
          nextWeek: function (a) {
            if (a.week() === this.week())
              return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT";
            switch (this.day()) {
              case 0:
                return "[В следующее] dddd [в] LT";
              case 1:
              case 2:
              case 4:
                return "[В следующий] dddd [в] LT";
              case 3:
              case 5:
              case 6:
                return "[В следующую] dddd [в] LT";
            }
          },
          lastWeek: function (a) {
            if (a.week() === this.week())
              return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT";
            switch (this.day()) {
              case 0:
                return "[В прошлое] dddd [в] LT";
              case 1:
              case 2:
              case 4:
                return "[В прошлый] dddd [в] LT";
              case 3:
              case 5:
              case 6:
                return "[В прошлую] dddd [в] LT";
            }
          },
          sameElse: "L",
        },
        relativeTime: {
          future: "через %s",
          past: "%s назад",
          s: "несколько секунд",
          m: c,
          mm: c,
          h: "час",
          hh: c,
          d: "день",
          dd: c,
          M: "месяц",
          MM: c,
          y: "год",
          yy: c,
        },
        meridiemParse: /ночи|утра|дня|вечера/i,
        isPM: function (a) {
          return /^(дня|вечера)$/.test(a);
        },
        meridiem: function (a, b, c) {
          return 4 > a ? "ночи" : 12 > a ? "утра" : 17 > a ? "дня" : "вечера";
        },
        ordinalParse: /\d{1,2}-(й|го|я)/,
        ordinal: function (a, b) {
          switch (b) {
            case "M":
            case "d":
            case "DDD":
              return a + "-й";
            case "D":
              return a + "-го";
            case "w":
            case "W":
              return a + "-я";
            default:
              return a;
          }
        },
        week: { dow: 1, doy: 7 },
      });
    return e;
  })(),
    a.fullCalendar.datepickerLang("ru", "ru", {
      closeText: "Закрыть",
      prevText: "&#x3C;Пред",
      nextText: "След&#x3E;",
      currentText: "Сегодня",
      monthNames: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ],
      monthNamesShort: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
      ],
      dayNames: [
        "воскресенье",
        "понедельник",
        "вторник",
        "среда",
        "четверг",
        "пятница",
        "суббота",
      ],
      dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"],
      dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      weekHeader: "Нед",
      dateFormat: "dd.mm.yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: "",
    }),
    a.fullCalendar.lang("ru", {
      buttonText: {
        month: "Месяц",
        week: "Неделя",
        day: "День",
        list: "Повестка дня",
      },
      allDayText: "Весь день",
      eventLimitText: function (a) {
        return "+ ещё " + a;
      },
    });
});
