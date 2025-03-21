define(function (require) {
    var zrUtil = require("zrender/core/util");
    var clazz = require("./clazz");

    var parseClassType = clazz.parseClassType;

    var base = 0;

    var componentUtil = {};

    var DELIMITER = "_";

    /**
     * @public
     * @param {string} type
     * @return {string}
     */
    componentUtil.getUID = function (type) {
        // Considering the case of crossing js context,
        // use Math.random to make id as unique as possible.
        return [type || "", base++, Math.random()].join(DELIMITER);
    };

    /**
     * @inner
     */
    componentUtil.enableSubTypeDefaulter = function (entity) {
        var subTypeDefaulters = {};

        entity.registerSubTypeDefaulter = function (componentType, defaulter) {
            componentType = parseClassType(componentType);
            subTypeDefaulters[componentType.main] = defaulter;
        };

        entity.determineSubType = function (componentType, option) {
            var type = option.type;
            if (!type) {
                var componentTypeMain = parseClassType(componentType).main;
                if (
                    entity.hasSubTypes(componentType) &&
                    subTypeDefaulters[componentTypeMain]
                ) {
                    type = subTypeDefaulters[componentTypeMain](option);
                }
            }
            return type;
        };

        return entity;
    };

    /**
     * Topological travel on Activity Network (Activity On Vertices).
     * Dependencies is defined in Model.prototype.dependencies, like ['xAxis', 'yAxis'].
     *
     * If 'xAxis' or 'yAxis' is absent in componentTypeList, just ignore it in topology.
     *
     * If there is circle dependencey, Error will be thrown.
     *
     */
    componentUtil.enableTopologicalTravel = function (
        entity,
        dependencyGetter,
    ) {
        /**
         * @public
         * @param {Array.<string>} targetNameList Target Component type list.
         *                                           Can be ['aa', 'bb', 'aa.xx']
         * @param {Array.<string>} fullNameList By which we can build dependency graph.
         * @param {Function} callback Params: componentType, dependencies.
         * @param {Object} context Scope of callback.
         */
        entity.topologicalTravel = function (
            targetNameList,
            fullNameList,
            callback,
            context,
        ) {
            if (!targetNameList.length) {
                return;
            }

            var result = makeDepndencyGraph(fullNameList);
            var graph = result.graph;
            var stack = result.noEntryList;

            var targetNameSet = {};
            zrUtil.each(targetNameList, function (name) {
                targetNameSet[name] = true;
            });

            while (stack.length) {
                var currComponentType = stack.pop();
                var currVertex = graph[currComponentType];
                var isInTargetNameSet = !!targetNameSet[currComponentType];
                if (isInTargetNameSet) {
                    callback.call(
                        context,
                        currComponentType,
                        currVertex.originalDeps.slice(),
                    );
                    delete targetNameSet[currComponentType];
                }
                zrUtil.each(
                    currVertex.successor,
                    isInTargetNameSet ? removeEdgeAndAdd : removeEdge,
                );
            }

            zrUtil.each(targetNameSet, function () {
                throw new Error("Circle dependency may exists");
            });

            function removeEdge(succComponentType) {
                graph[succComponentType].entryCount--;
                if (graph[succComponentType].entryCount === 0) {
                    stack.push(succComponentType);
                }
            }

            // Consider this case: legend depends on series, and we call
            // chart.setOption({series: [...]}), where only series is in option.
            // If we do not have 'removeEdgeAndAdd', legendModel.mergeOption will
            // not be called, but only sereis.mergeOption is called. Thus legend
            // have no chance to update its local record about series (like which
            // name of series is available in legend).
            function removeEdgeAndAdd(succComponentType) {
                targetNameSet[succComponentType] = true;
                removeEdge(succComponentType);
            }
        };

        /**
         * DepndencyGraph: {Object}
         * key: conponentType,
         * value: {
         *     successor: [conponentTypes...],
         *     originalDeps: [conponentTypes...],
         *     entryCount: {number}
         * }
         */
        function makeDepndencyGraph(fullNameList) {
            var graph = {};
            var noEntryList = [];

            zrUtil.each(fullNameList, function (name) {
                var thisItem = createDependencyGraphItem(graph, name);
                var originalDeps = (thisItem.originalDeps =
                    dependencyGetter(name));

                var availableDeps = getAvailableDependencies(
                    originalDeps,
                    fullNameList,
                );
                thisItem.entryCount = availableDeps.length;
                if (thisItem.entryCount === 0) {
                    noEntryList.push(name);
                }

                zrUtil.each(availableDeps, function (dependentName) {
                    if (
                        zrUtil.indexOf(thisItem.predecessor, dependentName) < 0
                    ) {
                        thisItem.predecessor.push(dependentName);
                    }
                    var thatItem = createDependencyGraphItem(
                        graph,
                        dependentName,
                    );
                    if (zrUtil.indexOf(thatItem.successor, dependentName) < 0) {
                        thatItem.successor.push(name);
                    }
                });
            });

            return { graph: graph, noEntryList: noEntryList };
        }

        function createDependencyGraphItem(graph, name) {
            if (!graph[name]) {
                graph[name] = { predecessor: [], successor: [] };
            }
            return graph[name];
        }

        function getAvailableDependencies(originalDeps, fullNameList) {
            var availableDeps = [];
            zrUtil.each(originalDeps, function (dep) {
                zrUtil.indexOf(fullNameList, dep) >= 0 &&
                    availableDeps.push(dep);
            });
            return availableDeps;
        }
    };

    return componentUtil;
});
