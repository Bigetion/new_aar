(function() {
    'use strict';
    App.directive('uiSelectObject', function($sce) {
        return {
            restrict: 'E',
            transclude: true,
            require: '^ngModel',
            template: '<ui-select ng-disabled="disabled" backspace-disabled="true" search-enabled="{{search}}" theme="select2" on-select="onSelect()">' +
                '<ui-select-match placeholder="{{placeholder}}">{{$select.selected[selectedText]}}</ui-select-match>' +
                '<ui-select-choices refresh="refresh" refresh-delay="300" repeat="item in data | filter: $select.search">' +
                '<span ng-bind-html="item[selectedText] | highlight: $select.search"></span>' +
                '</ui-select-choices>' +
                '</ui-select>',
            scope: {
                ngModel: '=',
                data: '=',
                selectedText: '@',
                search: '@',
                placeholder: '@',
                onChange: '&',
                disabled: '=?'
            },
            link: function(scope) {
                // if (scope.data) {
                //     angular.forEach(scope.data, function(item) {
                //         item[scope.selectedText] = $sce.trustAsHtml(item[scope.selectedText]);
                //     });
                // }
                scope.onSelect = function() {
                    scope.onChange();
                };
            }
        };
    })

    .directive('uiSelectInfinite', ['$injector', 'lodash', function($injector) {
            return {
                restrict: 'E',
                transclude: true,
                require: '^ngModel',
                replace: true,
                scope: {
                    ngModel: '=',
                    onClick: '=?',
                    loadOnClick: '=?',
                    service: '@',
                    responseArray: '@',
                    infinityValue: '=',
                    inputData: '=?',
                    ngDisabled: '=?',
                    required: '=?',
                    requiredMsg: '@?',
                    placeholder: '@',
                    selectValue: '@',
                    selectValue2: '@',
                    selectValue3: '@',
                    itemValue: '@',
                    itemValue2: '@',
                    itemValue3: '@',
                    separator: '@',
                    listValue: '=?',
                    onChange: '&',
                    initiateData: '=?',
                    noLoading: '=?',
                    isInline: '=?'
                },
                template: '<div class="ui-select-infinite">' +
                    '<ui-select on-select="onSelect" backspace-disabled="true" search-enabled="true" ng-required="required" ng-disabled="ngDisabled || loading" ' +
                    ' ng-click="click()" ng-model="$parent.ngModel">' +
                    '<ui-select-match placeholder="{{holder}}">' +
                    '<span>{{$select.selected[selectValue]}}</span>' +
                    '<span ng-if="selectValue2"> {{separator}} {{$select.selected[selectValue2]}}</span>' +
                    '<span ng-if="selectValue3"> {{separator}} {{$select.selected[selectValue3]}}</span>' +
                    '</ui-select-match>' +
                    '<ui-select-choices when-scrolled="scroll($select.search,false)"  refresh="load($select.search,true)" repeat="item in listValue | filter: (selectValue ? {varFilter: $select.search} : $select.search)">' +
                    '<span ng-bind-html="item[itemValue] | highlight: $select.search"></span>' +
                    '<span ng-if="(itemValue2)"> {{separator}} </span>' +
                    '<span ng-if="itemValue2" ng-bind-html="item[itemValue2] | highlight: $select.search"></span>' +
                    '<span ng-if="(itemValue3)"> {{separator}} </span>' +
                    '<span ng-if="itemValue3" ng-bind-html="item[itemValue3] | highlight: $select.search"></span>' +
                    '</ui-select-choices>' +
                    '</ui-select>' +
                    '<span class="error-required hidden {{isInline?\'inline-error\':\'\'}}">{{requiredMsg ? $root.lang[requiredMsg] : $root.lang.general_required}}</span></div>',
                link: function(scope) {
                    scope.$watch('ngModel', function() {
                        if (scope.onChange) {
                            scope.onChange();
                        }
                    });

                    scope.$watch(function() {
                        return scope.inputData;
                    }, function() {
                        scope.load('');
                    }, true);
                },
                controller: ['$scope', function($scope) {
                    $scope.isLastPage = false;

                    $scope.holder = $scope.$root.lang.loading;
                    if (!$scope.noLoading) {
                        $scope.loading = true;
                    }
                    var splitService = $scope.service.split('.');
                    var service = $injector.get(splitService[0]);
                    var serviceFunction = splitService[1];

                    $scope.load = function(query) {
                        service[serviceFunction]('1', query, $scope.inputData).then(function(response) {
                            $scope.listValue = [];
                            if ($scope.initiateData) {
                                $scope.listValue.push($scope.initiateData);
                            }
                            $scope.listValue = $scope.responseArray ? $scope.listValue.concat(response[$scope.responseArray]) : $scope.listValue.concat(response);
                            $scope.totalRecord = response.totalRecord;
                            $scope.totalPage = response.totalPage;
                            $scope.currentPage = 1;

                            if ($scope.selectValue) {
                                var selectValue = angular.copy($scope.selectValue);
                                var selectValue2 = angular.copy($scope.selectValue2);
                                var selectValue3 = angular.copy($scope.selectValue3);

                                angular.forEach($scope.listValue, function(val) {
                                    if (val) {
                                        val.varFilter = (selectValue ? val[selectValue] : '') + (selectValue2 ? ' ' + val[selectValue2] : '') + (selectValue3 ? ' ' + val[selectValue3] : '');
                                    }
                                });
                            }

                            if (!$scope.noLoading) {
                                $scope.loading = false;
                            }
                            $scope.holder = $scope.$root.lang[$scope.placeholder];
                        });
                        return $scope.data;
                    };

                    $scope.scroll = function(query) {
                        $scope.currentPage += 1;
                        if ($scope.currentPage <= $scope.totalPage) {
                            service[serviceFunction]($scope.currentPage, query, $scope.inputData)
                                .then(function(response) {
                                    $scope.listValue = $scope.responseArray ? $scope.listValue.concat(response[$scope.responseArray]) : $scope.listValue.concat(response);

                                    if ($scope.selectValue) {
                                        var selectValue = angular.copy($scope.selectValue);
                                        var selectValue2 = angular.copy($scope.selectValue2);
                                        var selectValue3 = angular.copy($scope.selectValue3);

                                        angular.forEach($scope.listValue, function(val) {
                                            if (val) {
                                                val.varFilter = (selectValue ? val[selectValue] : '') + (selectValue2 ? ' ' + val[selectValue2] : '') + (selectValue3 ? ' ' + val[selectValue3] : '');
                                            }
                                        });
                                    }
                                });
                        } else {
                            $scope.isLastPage = true;
                        }
                    };

                    $scope.click = function() {
                        if ($scope.onClick) $scope.onClick();
                        else if ($scope.loadOnClick) $scope.load('');
                    };
                }]
            };
        }])
        .directive('uiSelectInfinite2', function($resource, $compile, $injector) {
            return {
                restrict: 'EA',
                require: 'ngModel',
                transclude: true,
                template: '<div ui-select2=\'select2Options\' ng-model=\'ngModel\' ng-required=\'required\' ng-disabled=\'disabled\'></div>',
                scope: {
                    factory: '@',
                    idSelected: '@',
                    ngModel: '=',
                    multiple: '@?',
                    required: '=?',
                    disabled: '=?',
                    onChange: '&?',
                    extraData: '=?'
                },
                compile: function compile() {
                    return {
                        pre: function preLink(scope, iElement, iAttrs, ngModel) {
                            var split = scope.factory.split('.');
                            var factory = $injector.get(split[0]);
                            var factoryFunction = split[1];
                            var multiple = false;

                            if (scope.multiple && scope.$eval(iAttrs['multiple']) == true) multiple = true;

                            var queryHandler = function(query) {
                                if (!angular.isDefined(query.page)) {
                                    query.page = 1;
                                }
                                factory[factoryFunction](query.page, query.term, scope.extraData)
                                    .then(function(response) {
                                            var more = false;
                                            if ((query.page < response.totalPage)) {
                                                more = true;
                                            }
                                            query.callback({
                                                results: response.data,
                                                more: more
                                            });
                                        },
                                        function() {
                                            query.callback({
                                                results: [],
                                                more: false
                                            });
                                        });
                            };

                            var formatSelection = function(response) {
                                return response[scope.idSelected];
                            };

                            var formatResult = function(response) {
                                return '<table>' +
                                    '<tr><td><div>' + response[scope.idSelected] + '</div></td></tr>' +
                                    '</table>';
                            };

                            scope.$watch(function() { return ngModel.$modelValue }, function(newValue, oldValue) {
                                if (scope.onChange) scope.onChange();
                            }, true);

                            scope.select2Options = {
                                multiple: multiple,
                                formatResult: formatResult,
                                formatSelection: formatSelection,
                                query: queryHandler
                            };
                        }
                    };
                }
            };
        });
})();