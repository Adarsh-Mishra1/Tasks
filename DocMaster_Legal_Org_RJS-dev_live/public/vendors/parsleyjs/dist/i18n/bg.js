// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages("bg", {
  defaultMessage: "Невалидна стойност.",
  type: {
    email: "Невалиден имейл адрес.",
    url: "Невалиден URL адрес.",
    number: "Невалиден номер.",
    integer: "Невалиден номер.",
    digits: "Невалидни цифри.",
    alphanum: "Стойността трябва да садържа само букви или цифри.",
  },
  notblank: "Полето е задължително.",
  required: "Полето е задължително.",
  pattern: "Невалидна стойност.",
  min: "Стойността трябва да бъде по-голяма или равна на %s.",
  max: "Стойността трябва да бъде по-малка или равна на %s.",
  range: "Стойността трябва да бъде между %s и %s.",
  minlength: "Стойността е прекалено кратка. Мин. дължина: %s символа.",
  maxlength: "Стойността е прекалено дълга. Макс. дължина: %s символа.",
  length: "Дължината на стойността трябва да бъде между %s и %s символа.",
  mincheck: "Трябва да изберете поне %s стойности.",
  maxcheck: "Трябва да изберете най-много %s стойности.",
  check: "Трябва да изберете между %s и %s стойности.",
  equalto: "Стойността трябва да съвпада.",
});

Parsley.setLocale("bg");
