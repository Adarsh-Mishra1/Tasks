define(function (require) {
    var echarts = require("../../echarts");
    var roamHelper = require("../../action/roamHelper");

    var actionInfo = {
        type: "graphRoam",
        event: "graphRoam",
        update: "none",
    };

    /**
     * @payload
     * @property {string} name Series name
     * @property {number} [dx]
     * @property {number} [dy]
     * @property {number} [zoom]
     * @property {number} [originX]
     * @property {number} [originY]
     */

    echarts.registerAction(actionInfo, function (payload, ecModel) {
        ecModel.eachComponent(
            { mainType: "series", query: payload },
            function (seriesModel) {
                var coordSys = seriesModel.coordinateSystem;

                var res = roamHelper.updateCenterAndZoom(coordSys, payload);

                seriesModel.setCenter && seriesModel.setCenter(res.center);

                seriesModel.setZoom && seriesModel.setZoom(res.zoom);
            },
        );
    });
});
