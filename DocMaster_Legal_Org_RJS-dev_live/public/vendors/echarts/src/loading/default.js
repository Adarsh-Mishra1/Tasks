define(function (require) {
    var graphic = require("../util/graphic");
    var zrUtil = require("zrender/core/util");
    var PI = Math.PI;
    /**
     * @param {module:echarts/ExtensionAPI} api
     * @param {Object} [opts]
     * @param {string} [opts.text]
     * @param {string} [opts.color]
     * @param {string} [opts.textColor]
     * @return {module:zrender/Element}
     */
    return function (api, opts) {
        opts = opts || {};
        zrUtil.defaults(opts, {
            text: "loading",
            color: "#c23531",
            textColor: "#000",
            maskColor: "rgba(255, 255, 255, 0.8)",
            zlevel: 0,
        });
        var mask = new graphic.Rect({
            style: {
                fill: opts.maskColor,
            },
            zlevel: opts.zlevel,
            z: 10000,
        });
        var arc = new graphic.Arc({
            shape: {
                startAngle: -PI / 2,
                endAngle: -PI / 2 + 0.1,
                r: 10,
            },
            style: {
                stroke: opts.color,
                lineCap: "round",
                lineWidth: 5,
            },
            zlevel: opts.zlevel,
            z: 10001,
        });
        var labelRect = new graphic.Rect({
            style: {
                fill: "none",
                text: opts.text,
                textPosition: "right",
                textDistance: 10,
                textFill: opts.textColor,
            },
            zlevel: opts.zlevel,
            z: 10001,
        });

        arc.animateShape(true)
            .when(1000, {
                endAngle: (PI * 3) / 2,
            })
            .start("circularInOut");
        arc.animateShape(true)
            .when(1000, {
                startAngle: (PI * 3) / 2,
            })
            .delay(300)
            .start("circularInOut");

        var group = new graphic.Group();
        group.add(arc);
        group.add(labelRect);
        group.add(mask);
        // Inject resize
        group.resize = function () {
            var cx = api.getWidth() / 2;
            var cy = api.getHeight() / 2;
            arc.setShape({
                cx: cx,
                cy: cy,
            });
            var r = arc.shape.r;
            labelRect.setShape({
                x: cx - r,
                y: cy - r,
                width: r * 2,
                height: r * 2,
            });

            mask.setShape({
                x: 0,
                y: 0,
                width: api.getWidth(),
                height: api.getHeight(),
            });
        };
        group.resize();
        return group;
    };
});
