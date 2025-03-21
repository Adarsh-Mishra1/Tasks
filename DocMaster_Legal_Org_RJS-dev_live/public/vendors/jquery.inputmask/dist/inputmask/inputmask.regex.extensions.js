/*!
 * inputmask.regex.extensions.js
 * https://github.com/RobinHerbots/jquery.inputmask
 * Copyright (c) 2010 - 2016 Robin Herbots
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Version: 3.3.1
 */
!(function (factory) {
  "function" == typeof define && define.amd
    ? define(["inputmask.dependencyLib", "inputmask"], factory)
    : "object" == typeof exports
      ? (module.exports = factory(
          require("./inputmask.dependencyLib.jquery"),
          require("./inputmask"),
        ))
      : factory(window.dependencyLib || jQuery, window.Inputmask);
})(function ($, Inputmask) {
  return (
    Inputmask.extendAliases({
      Regex: {
        mask: "r",
        greedy: !1,
        repeat: "*",
        regex: null,
        regexTokens: null,
        tokenizer:
          /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
        quantifierFilter: /[0-9]+[^,]/,
        isComplete: function (buffer, opts) {
          return new RegExp(opts.regex).test(buffer.join(""));
        },
        definitions: {
          r: {
            validator: function (chrs, maskset, pos, strict, opts) {
              function RegexToken(isGroup, isQuantifier) {
                (this.matches = []),
                  (this.isGroup = isGroup || !1),
                  (this.isQuantifier = isQuantifier || !1),
                  (this.quantifier = {
                    min: 1,
                    max: 1,
                  }),
                  (this.repeaterPart = void 0);
              }
              function analyseRegex() {
                var match,
                  m,
                  currentToken = new RegexToken(),
                  opengroups = [];
                for (
                  opts.regexTokens = [];
                  (match = opts.tokenizer.exec(opts.regex));

                )
                  switch (((m = match[0]), m.charAt(0))) {
                    case "(":
                      opengroups.push(new RegexToken(!0));
                      break;

                    case ")":
                      (groupToken = opengroups.pop()),
                        opengroups.length > 0
                          ? opengroups[opengroups.length - 1].matches.push(
                              groupToken,
                            )
                          : currentToken.matches.push(groupToken);
                      break;

                    case "{":
                    case "+":
                    case "*":
                      var quantifierToken = new RegexToken(!1, !0);
                      m = m.replace(/[{}]/g, "");
                      var mq = m.split(","),
                        mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]),
                        mq1 =
                          1 === mq.length
                            ? mq0
                            : isNaN(mq[1])
                              ? mq[1]
                              : parseInt(mq[1]);
                      if (
                        ((quantifierToken.quantifier = {
                          min: mq0,
                          max: mq1,
                        }),
                        opengroups.length > 0)
                      ) {
                        var matches = opengroups[opengroups.length - 1].matches;
                        (match = matches.pop()),
                          match.isGroup ||
                            ((groupToken = new RegexToken(!0)),
                            groupToken.matches.push(match),
                            (match = groupToken)),
                          matches.push(match),
                          matches.push(quantifierToken);
                      } else
                        (match = currentToken.matches.pop()),
                          match.isGroup ||
                            ((groupToken = new RegexToken(!0)),
                            groupToken.matches.push(match),
                            (match = groupToken)),
                          currentToken.matches.push(match),
                          currentToken.matches.push(quantifierToken);
                      break;

                    default:
                      opengroups.length > 0
                        ? opengroups[opengroups.length - 1].matches.push(m)
                        : currentToken.matches.push(m);
                  }
                currentToken.matches.length > 0 &&
                  opts.regexTokens.push(currentToken);
              }
              function validateRegexToken(token, fromGroup) {
                var isvalid = !1;
                fromGroup && ((regexPart += "("), openGroupCount++);
                for (var mndx = 0; mndx < token.matches.length; mndx++) {
                  var matchToken = token.matches[mndx];
                  if (matchToken.isGroup === !0)
                    isvalid = validateRegexToken(matchToken, !0);
                  else if (matchToken.isQuantifier === !0) {
                    var crrntndx = $.inArray(matchToken, token.matches),
                      matchGroup = token.matches[crrntndx - 1],
                      regexPartBak = regexPart;
                    if (isNaN(matchToken.quantifier.max)) {
                      for (
                        ;
                        matchToken.repeaterPart &&
                        matchToken.repeaterPart !== regexPart &&
                        matchToken.repeaterPart.length > regexPart.length &&
                        !(isvalid = validateRegexToken(matchGroup, !0));

                      );
                      (isvalid = isvalid || validateRegexToken(matchGroup, !0)),
                        isvalid && (matchToken.repeaterPart = regexPart),
                        (regexPart = regexPartBak + matchToken.quantifier.max);
                    } else {
                      for (
                        var i = 0, qm = matchToken.quantifier.max - 1;
                        qm > i &&
                        !(isvalid = validateRegexToken(matchGroup, !0));
                        i++
                      );
                      regexPart =
                        regexPartBak +
                        "{" +
                        matchToken.quantifier.min +
                        "," +
                        matchToken.quantifier.max +
                        "}";
                    }
                  } else if (void 0 !== matchToken.matches)
                    for (
                      var k = 0;
                      k < matchToken.length &&
                      !(isvalid = validateRegexToken(matchToken[k], fromGroup));
                      k++
                    );
                  else {
                    var testExp;
                    if ("[" == matchToken.charAt(0)) {
                      (testExp = regexPart), (testExp += matchToken);
                      for (var j = 0; openGroupCount > j; j++) testExp += ")";
                      var exp = new RegExp("^(" + testExp + ")$");
                      isvalid = exp.test(bufferStr);
                    } else
                      for (var l = 0, tl = matchToken.length; tl > l; l++)
                        if ("\\" !== matchToken.charAt(l)) {
                          (testExp = regexPart),
                            (testExp += matchToken.substr(0, l + 1)),
                            (testExp = testExp.replace(/\|$/, ""));
                          for (var j = 0; openGroupCount > j; j++)
                            testExp += ")";
                          var exp = new RegExp("^(" + testExp + ")$");
                          if ((isvalid = exp.test(bufferStr))) break;
                        }
                    regexPart += matchToken;
                  }
                  if (isvalid) break;
                }
                return (
                  fromGroup && ((regexPart += ")"), openGroupCount--), isvalid
                );
              }
              var bufferStr,
                groupToken,
                cbuffer = maskset.buffer.slice(),
                regexPart = "",
                isValid = !1,
                openGroupCount = 0;
              null === opts.regexTokens && analyseRegex(),
                cbuffer.splice(pos, 0, chrs),
                (bufferStr = cbuffer.join(""));
              for (var i = 0; i < opts.regexTokens.length; i++) {
                var regexToken = opts.regexTokens[i];
                if (
                  (isValid = validateRegexToken(regexToken, regexToken.isGroup))
                )
                  break;
              }
              return isValid;
            },
            cardinality: 1,
          },
        },
      },
    }),
    Inputmask
  );
});
