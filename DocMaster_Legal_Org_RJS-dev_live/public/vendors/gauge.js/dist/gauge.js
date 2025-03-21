// Generated by CoffeeScript 1.6.3
(function () {
  var AnimatedText,
    AnimatedTextFactory,
    Bar,
    BaseDonut,
    BaseGauge,
    Donut,
    Gauge,
    GaugePointer,
    TextRenderer,
    ValueUpdater,
    addCommas,
    cutHex,
    formatNumber,
    mergeObjects,
    secondsToString,
    updateObjectValues,
    _ref,
    _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function (child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  (function () {
    var browserRequestAnimationFrame,
      isCancelled,
      lastId,
      vendor,
      vendors,
      _i,
      _len;
    vendors = ["ms", "moz", "webkit", "o"];
    for (_i = 0, _len = vendors.length; _i < _len; _i++) {
      vendor = vendors[_i];
      if (window.requestAnimationFrame) {
        break;
      }
      window.requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
      window.cancelAnimationFrame =
        window[vendor + "CancelAnimationFrame"] ||
        window[vendor + "CancelRequestAnimationFrame"];
    }
    browserRequestAnimationFrame = null;
    lastId = 0;
    isCancelled = {};
    if (!requestAnimationFrame) {
      window.requestAnimationFrame = function (callback, element) {
        var currTime, id, lastTime, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout(function () {
          return callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
      return (window.cancelAnimationFrame = function (id) {
        return clearTimeout(id);
      });
    } else if (!window.cancelAnimationFrame) {
      browserRequestAnimationFrame = window.requestAnimationFrame;
      window.requestAnimationFrame = function (callback, element) {
        var myId;
        myId = ++lastId;
        browserRequestAnimationFrame(function () {
          if (!isCancelled[myId]) {
            return callback();
          }
        }, element);
        return myId;
      };
      return (window.cancelAnimationFrame = function (id) {
        return (isCancelled[id] = true);
      });
    }
  })();

  String.prototype.hashCode = function () {
    var char, hash, i, _i, _ref;
    hash = 0;
    if (this.length === 0) {
      return hash;
    }
    for (
      i = _i = 0, _ref = this.length;
      0 <= _ref ? _i < _ref : _i > _ref;
      i = 0 <= _ref ? ++_i : --_i
    ) {
      char = this.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  };

  secondsToString = function (sec) {
    var hr, min;
    hr = Math.floor(sec / 3600);
    min = Math.floor((sec - hr * 3600) / 60);
    sec -= hr * 3600 + min * 60;
    sec += "";
    min += "";
    while (min.length < 2) {
      min = "0" + min;
    }
    while (sec.length < 2) {
      sec = "0" + sec;
    }
    hr = hr ? hr + ":" : "";
    return hr + min + ":" + sec;
  };

  formatNumber = function (num) {
    return addCommas(num.toFixed(0));
  };

  updateObjectValues = function (obj1, obj2) {
    var key, val;
    for (key in obj2) {
      if (!__hasProp.call(obj2, key)) continue;
      val = obj2[key];
      obj1[key] = val;
    }
    return obj1;
  };

  mergeObjects = function (obj1, obj2) {
    var key, out, val;
    out = {};
    for (key in obj1) {
      if (!__hasProp.call(obj1, key)) continue;
      val = obj1[key];
      out[key] = val;
    }
    for (key in obj2) {
      if (!__hasProp.call(obj2, key)) continue;
      val = obj2[key];
      out[key] = val;
    }
    return out;
  };

  addCommas = function (nStr) {
    var rgx, x, x1, x2;
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = "";
    if (x.length > 1) {
      x2 = "." + x[1];
    }
    rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  };

  cutHex = function (nStr) {
    if (nStr.charAt(0) === "#") {
      return nStr.substring(1, 7);
    }
    return nStr;
  };

  ValueUpdater = (function () {
    ValueUpdater.prototype.animationSpeed = 32;

    function ValueUpdater(addToAnimationQueue, clear) {
      if (addToAnimationQueue == null) {
        addToAnimationQueue = true;
      }
      this.clear = clear != null ? clear : true;
      if (addToAnimationQueue) {
        AnimationUpdater.add(this);
      }
    }

    ValueUpdater.prototype.update = function (force) {
      var diff;
      if (force == null) {
        force = false;
      }
      if (force || this.displayedValue !== this.value) {
        if (this.ctx && this.clear) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        diff = this.value - this.displayedValue;
        if (Math.abs(diff / this.animationSpeed) <= 0.001) {
          this.displayedValue = this.value;
        } else {
          this.displayedValue =
            this.displayedValue + diff / this.animationSpeed;
        }
        this.render();
        return true;
      }
      return false;
    };

    return ValueUpdater;
  })();

  BaseGauge = (function (_super) {
    __extends(BaseGauge, _super);

    function BaseGauge() {
      _ref = BaseGauge.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseGauge.prototype.displayScale = 1;

    BaseGauge.prototype.setTextField = function (textField) {
      return (this.textField =
        textField instanceof TextRenderer
          ? textField
          : new TextRenderer(textField));
    };

    BaseGauge.prototype.setMinValue = function (minValue, updateStartValue) {
      var gauge, _i, _len, _ref1, _results;
      this.minValue = minValue;
      if (updateStartValue == null) {
        updateStartValue = true;
      }
      if (updateStartValue) {
        this.displayedValue = this.minValue;
        _ref1 = this.gp || [];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          gauge = _ref1[_i];
          _results.push((gauge.displayedValue = this.minValue));
        }
        return _results;
      }
    };

    BaseGauge.prototype.setOptions = function (options) {
      if (options == null) {
        options = null;
      }
      this.options = mergeObjects(this.options, options);
      if (this.textField) {
        this.textField.el.style.fontSize = options.fontSize + "px";
      }
      if (this.options.angle > 0.5) {
        this.gauge.options.angle = 0.5;
      }
      this.configDisplayScale();
      return this;
    };

    BaseGauge.prototype.configDisplayScale = function () {
      var backingStorePixelRatio,
        devicePixelRatio,
        height,
        prevDisplayScale,
        width;
      prevDisplayScale = this.displayScale;
      if (this.options.highDpiSupport === false) {
        delete this.displayScale;
      } else {
        devicePixelRatio = window.devicePixelRatio || 1;
        backingStorePixelRatio =
          this.ctx.webkitBackingStorePixelRatio ||
          this.ctx.mozBackingStorePixelRatio ||
          this.ctx.msBackingStorePixelRatio ||
          this.ctx.oBackingStorePixelRatio ||
          this.ctx.backingStorePixelRatio ||
          1;
        this.displayScale = devicePixelRatio / backingStorePixelRatio;
      }
      if (this.displayScale !== prevDisplayScale) {
        width = this.canvas.G__width || this.canvas.width;
        height = this.canvas.G__height || this.canvas.height;
        this.canvas.width = width * this.displayScale;
        this.canvas.height = height * this.displayScale;
        this.canvas.style.width = "" + width + "px";
        this.canvas.style.height = "" + height + "px";
        this.canvas.G__width = width;
        this.canvas.G__height = height;
      }
      return this;
    };

    return BaseGauge;
  })(ValueUpdater);

  TextRenderer = (function () {
    function TextRenderer(el) {
      this.el = el;
    }

    TextRenderer.prototype.render = function (gauge) {
      return (this.el.innerHTML = formatNumber(gauge.displayedValue));
    };

    return TextRenderer;
  })();

  AnimatedText = (function (_super) {
    __extends(AnimatedText, _super);

    AnimatedText.prototype.displayedValue = 0;

    AnimatedText.prototype.value = 0;

    AnimatedText.prototype.setVal = function (value) {
      return (this.value = 1 * value);
    };

    function AnimatedText(elem, text) {
      this.elem = elem;
      this.text = text != null ? text : false;
      this.value = 1 * this.elem.innerHTML;
      if (this.text) {
        this.value = 0;
      }
    }

    AnimatedText.prototype.render = function () {
      var textVal;
      if (this.text) {
        textVal = secondsToString(this.displayedValue.toFixed(0));
      } else {
        textVal = addCommas(formatNumber(this.displayedValue));
      }
      return (this.elem.innerHTML = textVal);
    };

    return AnimatedText;
  })(ValueUpdater);

  AnimatedTextFactory = {
    create: function (objList) {
      var elem, out, _i, _len;
      out = [];
      for (_i = 0, _len = objList.length; _i < _len; _i++) {
        elem = objList[_i];
        out.push(new AnimatedText(elem));
      }
      return out;
    },
  };

  GaugePointer = (function (_super) {
    __extends(GaugePointer, _super);

    GaugePointer.prototype.displayedValue = 0;

    GaugePointer.prototype.value = 0;

    GaugePointer.prototype.options = {
      strokeWidth: 0.035,
      length: 0.1,
      color: "#000000",
    };

    function GaugePointer(gauge) {
      this.gauge = gauge;
      this.ctx = this.gauge.ctx;
      this.canvas = this.gauge.canvas;
      GaugePointer.__super__.constructor.call(this, false, false);
      this.setOptions();
    }

    GaugePointer.prototype.setOptions = function (options) {
      if (options == null) {
        options = null;
      }
      updateObjectValues(this.options, options);
      this.length = this.canvas.height * this.options.length;
      this.strokeWidth = this.canvas.height * this.options.strokeWidth;
      this.maxValue = this.gauge.maxValue;
      this.minValue = this.gauge.minValue;
      this.animationSpeed = this.gauge.animationSpeed;
      return (this.options.angle = this.gauge.options.angle);
    };

    GaugePointer.prototype.render = function () {
      var angle, centerX, centerY, endX, endY, startX, startY, x, y;
      angle = this.gauge.getAngle.call(this, this.displayedValue);
      centerX = this.canvas.width / 2;
      centerY = this.canvas.height * 0.9;
      x = Math.round(centerX + this.length * Math.cos(angle));
      y = Math.round(centerY + this.length * Math.sin(angle));
      startX = Math.round(
        centerX + this.strokeWidth * Math.cos(angle - Math.PI / 2),
      );
      startY = Math.round(
        centerY + this.strokeWidth * Math.sin(angle - Math.PI / 2),
      );
      endX = Math.round(
        centerX + this.strokeWidth * Math.cos(angle + Math.PI / 2),
      );
      endY = Math.round(
        centerY + this.strokeWidth * Math.sin(angle + Math.PI / 2),
      );
      this.ctx.fillStyle = this.options.color;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, this.strokeWidth, 0, Math.PI * 2, true);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(x, y);
      this.ctx.lineTo(endX, endY);
      return this.ctx.fill();
    };

    return GaugePointer;
  })(ValueUpdater);

  Bar = (function () {
    function Bar(elem) {
      this.elem = elem;
    }

    Bar.prototype.updateValues = function (arrValues) {
      this.value = arrValues[0];
      this.maxValue = arrValues[1];
      this.avgValue = arrValues[2];
      return this.render();
    };

    Bar.prototype.render = function () {
      var avgPercent, valPercent;
      if (this.textField) {
        this.textField.text(formatNumber(this.value));
      }
      if (this.maxValue === 0) {
        this.maxValue = this.avgValue * 2;
      }
      valPercent = (this.value / this.maxValue) * 100;
      avgPercent = (this.avgValue / this.maxValue) * 100;
      $(".bar-value", this.elem).css({
        width: valPercent + "%",
      });
      return $(".typical-value", this.elem).css({
        width: avgPercent + "%",
      });
    };

    return Bar;
  })();

  Gauge = (function (_super) {
    __extends(Gauge, _super);

    Gauge.prototype.elem = null;

    Gauge.prototype.value = [20];

    Gauge.prototype.maxValue = 80;

    Gauge.prototype.minValue = 0;

    Gauge.prototype.displayedAngle = 0;

    Gauge.prototype.displayedValue = 0;

    Gauge.prototype.lineWidth = 40;

    Gauge.prototype.paddingBottom = 0.1;

    Gauge.prototype.percentColors = null;

    Gauge.prototype.options = {
      colorStart: "#6fadcf",
      colorStop: void 0,
      gradientType: 0,
      strokeColor: "#e0e0e0",
      pointer: {
        length: 0.8,
        strokeWidth: 0.035,
      },
      angle: 0.15,
      lineWidth: 0.44,
      fontSize: 40,
      limitMax: false,
    };

    function Gauge(canvas) {
      this.canvas = canvas;
      Gauge.__super__.constructor.call(this);
      this.percentColors = null;
      if (typeof G_vmlCanvasManager !== "undefined") {
        this.canvas = window.G_vmlCanvasManager.initElement(this.canvas);
      }
      this.ctx = this.canvas.getContext("2d");
      this.gp = [new GaugePointer(this)];
      this.setOptions();
      this.render();
    }

    Gauge.prototype.setOptions = function (options) {
      var gauge, _i, _len, _ref1;
      if (options == null) {
        options = null;
      }
      Gauge.__super__.setOptions.call(this, options);
      this.configPercentColors();
      this.lineWidth =
        this.canvas.height * (1 - this.paddingBottom) * this.options.lineWidth;
      this.radius =
        this.canvas.height * (1 - this.paddingBottom) - this.lineWidth;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.render();
      _ref1 = this.gp;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        gauge = _ref1[_i];
        gauge.setOptions(this.options.pointer);
        gauge.render();
      }
      return this;
    };

    Gauge.prototype.configPercentColors = function () {
      var bval, gval, i, rval, _i, _ref1, _results;
      this.percentColors = null;
      if (this.options.percentColors !== void 0) {
        this.percentColors = new Array();
        _results = [];
        for (
          i = _i = 0, _ref1 = this.options.percentColors.length - 1;
          0 <= _ref1 ? _i <= _ref1 : _i >= _ref1;
          i = 0 <= _ref1 ? ++_i : --_i
        ) {
          rval = parseInt(
            cutHex(this.options.percentColors[i][1]).substring(0, 2),
            16,
          );
          gval = parseInt(
            cutHex(this.options.percentColors[i][1]).substring(2, 4),
            16,
          );
          bval = parseInt(
            cutHex(this.options.percentColors[i][1]).substring(4, 6),
            16,
          );
          _results.push(
            (this.percentColors[i] = {
              pct: this.options.percentColors[i][0],
              color: {
                r: rval,
                g: gval,
                b: bval,
              },
            }),
          );
        }
        return _results;
      }
    };

    Gauge.prototype.set = function (value) {
      var i, max_hit, val, _i, _j, _len, _ref1;
      if (!(value instanceof Array)) {
        value = [value];
      }
      if (value.length > this.gp.length) {
        for (
          i = _i = 0, _ref1 = value.length - this.gp.length;
          0 <= _ref1 ? _i < _ref1 : _i > _ref1;
          i = 0 <= _ref1 ? ++_i : --_i
        ) {
          this.gp.push(new GaugePointer(this));
        }
      }
      i = 0;
      max_hit = false;
      for (_j = 0, _len = value.length; _j < _len; _j++) {
        val = value[_j];
        if (val > this.maxValue) {
          this.maxValue = this.value * 1.1;
          max_hit = true;
        }
        this.gp[i].value = val;
        this.gp[i++].setOptions({
          maxValue: this.maxValue,
          angle: this.options.angle,
        });
      }
      this.value = value[value.length - 1];
      if (max_hit) {
        if (!this.options.limitMax) {
          return AnimationUpdater.run();
        }
      } else {
        return AnimationUpdater.run();
      }
    };

    Gauge.prototype.getAngle = function (value) {
      return (
        (1 + this.options.angle) * Math.PI +
        ((value - this.minValue) / (this.maxValue - this.minValue)) *
          (1 - this.options.angle * 2) *
          Math.PI
      );
    };

    Gauge.prototype.getColorForPercentage = function (pct, grad) {
      var color, endColor, i, rangePct, startColor, _i, _ref1;
      if (pct === 0) {
        color = this.percentColors[0].color;
      } else {
        color = this.percentColors[this.percentColors.length - 1].color;
        for (
          i = _i = 0, _ref1 = this.percentColors.length - 1;
          0 <= _ref1 ? _i <= _ref1 : _i >= _ref1;
          i = 0 <= _ref1 ? ++_i : --_i
        ) {
          if (pct <= this.percentColors[i].pct) {
            if (grad === true) {
              startColor = this.percentColors[i - 1];
              endColor = this.percentColors[i];
              rangePct =
                (pct - startColor.pct) / (endColor.pct - startColor.pct);
              color = {
                r: Math.floor(
                  startColor.color.r * (1 - rangePct) +
                    endColor.color.r * rangePct,
                ),
                g: Math.floor(
                  startColor.color.g * (1 - rangePct) +
                    endColor.color.g * rangePct,
                ),
                b: Math.floor(
                  startColor.color.b * (1 - rangePct) +
                    endColor.color.b * rangePct,
                ),
              };
            } else {
              color = this.percentColors[i].color;
            }
            break;
          }
        }
      }
      return "rgb(" + [color.r, color.g, color.b].join(",") + ")";
    };

    Gauge.prototype.getColorForValue = function (val, grad) {
      var pct;
      pct = (val - this.minValue) / (this.maxValue - this.minValue);
      return this.getColorForPercentage(pct, grad);
    };

    Gauge.prototype.render = function () {
      var displayedAngle, fillStyle, gauge, h, w, _i, _len, _ref1, _results;
      w = this.canvas.width / 2;
      h = this.canvas.height * (1 - this.paddingBottom);
      displayedAngle = this.getAngle(this.displayedValue);
      if (this.textField) {
        this.textField.render(this);
      }
      this.ctx.lineCap = "butt";
      if (this.options.customFillStyle !== void 0) {
        fillStyle = this.options.customFillStyle(this);
      } else if (this.percentColors !== null) {
        fillStyle = this.getColorForValue(this.displayedValue, true);
      } else if (this.options.colorStop !== void 0) {
        if (this.options.gradientType === 0) {
          fillStyle = this.ctx.createRadialGradient(w, h, 9, w, h, 70);
        } else {
          fillStyle = this.ctx.createLinearGradient(0, 0, w, 0);
        }
        fillStyle.addColorStop(0, this.options.colorStart);
        fillStyle.addColorStop(1, this.options.colorStop);
      } else {
        fillStyle = this.options.colorStart;
      }
      this.ctx.strokeStyle = fillStyle;
      this.ctx.beginPath();
      this.ctx.arc(
        w,
        h,
        this.radius,
        (1 + this.options.angle) * Math.PI,
        displayedAngle,
        false,
      );
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.stroke();
      this.ctx.strokeStyle = this.options.strokeColor;
      this.ctx.beginPath();
      this.ctx.arc(
        w,
        h,
        this.radius,
        displayedAngle,
        (2 - this.options.angle) * Math.PI,
        false,
      );
      this.ctx.stroke();
      _ref1 = this.gp;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        gauge = _ref1[_i];
        _results.push(gauge.update(true));
      }
      return _results;
    };

    return Gauge;
  })(BaseGauge);

  BaseDonut = (function (_super) {
    __extends(BaseDonut, _super);

    BaseDonut.prototype.lineWidth = 15;

    BaseDonut.prototype.displayedValue = 0;

    BaseDonut.prototype.value = 33;

    BaseDonut.prototype.maxValue = 80;

    BaseDonut.prototype.minValue = 0;

    BaseDonut.prototype.options = {
      lineWidth: 0.1,
      colorStart: "#6f6ea0",
      colorStop: "#c0c0db",
      strokeColor: "#eeeeee",
      shadowColor: "#d5d5d5",
      angle: 0.35,
    };

    function BaseDonut(canvas) {
      this.canvas = canvas;
      BaseDonut.__super__.constructor.call(this);
      if (typeof G_vmlCanvasManager !== "undefined") {
        this.canvas = window.G_vmlCanvasManager.initElement(this.canvas);
      }
      this.ctx = this.canvas.getContext("2d");
      this.setOptions();
      this.render();
    }

    BaseDonut.prototype.getAngle = function (value) {
      return (
        (1 - this.options.angle) * Math.PI +
        ((value - this.minValue) / (this.maxValue - this.minValue)) *
          (2 + this.options.angle - (1 - this.options.angle)) *
          Math.PI
      );
    };

    BaseDonut.prototype.setOptions = function (options) {
      if (options == null) {
        options = null;
      }
      BaseDonut.__super__.setOptions.call(this, options);
      this.lineWidth = this.canvas.height * this.options.lineWidth;
      this.radius = this.canvas.height / 2 - this.lineWidth / 2;
      return this;
    };

    BaseDonut.prototype.set = function (value) {
      this.value = value;
      if (this.value > this.maxValue) {
        this.maxValue = this.value * 1.1;
      }
      return AnimationUpdater.run();
    };

    BaseDonut.prototype.render = function () {
      var displayedAngle, grdFill, h, start, stop, w;
      displayedAngle = this.getAngle(this.displayedValue);
      w = this.canvas.width / 2;
      h = this.canvas.height / 2;
      if (this.textField) {
        this.textField.render(this);
      }
      grdFill = this.ctx.createRadialGradient(w, h, 39, w, h, 70);
      grdFill.addColorStop(0, this.options.colorStart);
      grdFill.addColorStop(1, this.options.colorStop);
      start = this.radius - this.lineWidth / 2;
      stop = this.radius + this.lineWidth / 2;
      this.ctx.strokeStyle = this.options.strokeColor;
      this.ctx.beginPath();
      this.ctx.arc(
        w,
        h,
        this.radius,
        (1 - this.options.angle) * Math.PI,
        (2 + this.options.angle) * Math.PI,
        false,
      );
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.lineCap = "round";
      this.ctx.stroke();
      this.ctx.strokeStyle = grdFill;
      this.ctx.beginPath();
      this.ctx.arc(
        w,
        h,
        this.radius,
        (1 - this.options.angle) * Math.PI,
        displayedAngle,
        false,
      );
      return this.ctx.stroke();
    };

    return BaseDonut;
  })(BaseGauge);

  Donut = (function (_super) {
    __extends(Donut, _super);

    function Donut() {
      _ref1 = Donut.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Donut.prototype.strokeGradient = function (w, h, start, stop) {
      var grd;
      grd = this.ctx.createRadialGradient(w, h, start, w, h, stop);
      grd.addColorStop(0, this.options.shadowColor);
      grd.addColorStop(0.12, this.options._orgStrokeColor);
      grd.addColorStop(0.88, this.options._orgStrokeColor);
      grd.addColorStop(1, this.options.shadowColor);
      return grd;
    };

    Donut.prototype.setOptions = function (options) {
      var h, start, stop, w;
      if (options == null) {
        options = null;
      }
      Donut.__super__.setOptions.call(this, options);
      w = this.canvas.width / 2;
      h = this.canvas.height / 2;
      start = this.radius - this.lineWidth / 2;
      stop = this.radius + this.lineWidth / 2;
      this.options._orgStrokeColor = this.options.strokeColor;
      this.options.strokeColor = this.strokeGradient(w, h, start, stop);
      return this;
    };

    return Donut;
  })(BaseDonut);

  window.AnimationUpdater = {
    elements: [],
    animId: null,
    addAll: function (list) {
      var elem, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        elem = list[_i];
        _results.push(AnimationUpdater.elements.push(elem));
      }
      return _results;
    },
    add: function (object) {
      return AnimationUpdater.elements.push(object);
    },
    run: function () {
      var animationFinished, elem, _i, _len, _ref2;
      animationFinished = true;
      _ref2 = AnimationUpdater.elements;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        elem = _ref2[_i];
        if (elem.update()) {
          animationFinished = false;
        }
      }
      if (!animationFinished) {
        return (AnimationUpdater.animId = requestAnimationFrame(
          AnimationUpdater.run,
        ));
      } else {
        return cancelAnimationFrame(AnimationUpdater.animId);
      }
    },
  };

  window.Gauge = Gauge;

  window.Donut = Donut;

  window.BaseDonut = BaseDonut;

  window.TextRenderer = TextRenderer;
}).call(this);
