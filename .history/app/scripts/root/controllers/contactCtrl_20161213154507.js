(function() {
  'use strict';
  App.controller('ContactCtrl', ['$scope', 'QueryService', '$q',
      function($scope, QueryService, $q) {
        $scope.list = {
          tAnggotaTim: {
            data: [],
            page: 1,
            totalRecord: 0
          }
        }

        $scope.get = {
          tAnggotaTimList: function() {
            QueryService.getByOptions('table=t_anggota_tim_asesmen&page=1&page_limit=10').then(function(response) {
              $scope.list.tAnggotaTim.page = 1;
              $scope.list.tAnggotaTim.data = response.data
              $scope.list.tAnggotaTim.totalRecord = '' + response.total_record
            })
          },
          tAnggotaTimListScroll: function() {
            $scope.list.tAnggotaTim.page += 1;
            
          }
        }

        $scope.infinite = function(){
          console.log('a');
        }

        $scope.onChange = {
          tAnggotaTimList: function() {
            QueryService.getByOptions('table=t_anggota_tim_asesmen&page=' + $scope.list.tAnggotaTim.page + '&page_limit=10').then(function(response) {
              $scope.list.tAnggotaTim.data = response.data
            })
          }
        }

        $scope.changeMe = function() {
          alert('aaa')
        }

        $scope.get.tAnggotaTimList();

        $scope.bbb = null;

        $scope.movieListProvider = {
          getUser: function(q, page, pageSize) {
            var deferred = $q.defer();
            var qNew = window.encodeURIComponent("username like '" + q + "%'");
            QueryService.getByOptions("table=users&where=" + qNew + "&page=" + page + "&page_limit=" + pageSize).then(function(response) {
              if (q != "") {
                deferred.resolve(response);
              }
            });
            return deferred.promise;
          },
          getDataQuery: function(q, page, pageSize) {
            var deferred = $q.defer();
            var qNew = window.encodeURIComponent("NAMA_LAB_LEMBAGA like '%" + q + "%'");
            QueryService.getByOptions("table=m_lpk_skema&where=" + qNew + "&page=" + page + "&page_limit=" + pageSize).then(function(response) {
              if (q != "") {
                deferred.resolve(response);
              }
            });
            return deferred.promise;
          }
        };

        $scope.select2Options = {
          multiple: false,
          formatResult: function(response) {
            var markup =
              "<table class='movie-result'>" +
              "<tr><td class='movie-info'><div class='movie-title'>" + response.NAMA_LAB_LEMBAGA + "</div></td></tr>" +
              "</table>";
            return markup;
          },
          formatSelection: function(response) {
            return response.NAMA_LAB_LEMBAGA;
          },
          query: function(query) {
            if (!angular.isDefined(query.page)) {
              query.page = 1;
            }
            var PAGE_SIZE = 10;
            $scope.movieListProvider.getDataQuery(query.term, query.page, PAGE_SIZE)
              .then(function(response) {
                  angular.forEach(response.data, function(item) {
                    item.id = item.ID_LPK_SKEMA
                  })
                  var more = false;
                  if ((query.page < response.total_page)) {
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
          }
        };
      }
    ])
    .directive('uiSelect2', ['$timeout', function($timeout) {
      var options = {};
      return {
        require: 'ngModel',
        priority: 1,
        compile: function(tElm, tAttrs) {
          var watch,
            repeatOption,
            repeatAttr,
            isSelect = tElm.is('select'),
            isMultiple = angular.isDefined(tAttrs.multiple);

          // Enable watching of the options dataset if in use
          if (tElm.is('select')) {
            repeatOption = tElm.find('option[ng-repeat], option[data-ng-repeat]');

            if (repeatOption.length) {
              repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
              watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
            }
          }

          return function(scope, elm, attrs, controller) {
            // instance-specific options
            var opts = angular.extend({}, options, scope.$eval(attrs.uiSelect2));

            /*
            Convert from Select2 view-model to Angular view-model.
            */
            var convertToAngularModel = function(select2_data) {
              var model;
              if (opts.simple_tags) {
                model = [];
                angular.forEach(select2_data, function(value, index) {
                  model.push(value.id);
                });
              }
              else {
                model = select2_data;
              }
              return model;
            };

            /*
            Convert from Angular view-model to Select2 view-model.
            */
            var convertToSelect2Model = function(angular_data) {
              var model = [];
              if (!angular_data) {
                return model;
              }

              if (opts.simple_tags) {
                model = [];
                angular.forEach(
                  angular_data,
                  function(value, index) {
                    model.push({
                      'id': value,
                      'text': value
                    });
                  });
              }
              else {
                model = angular_data;
              }
              return model;
            };

            if (isSelect) {
              // Use <select multiple> instead
              delete opts.multiple;
              delete opts.initSelection;
            }
            else if (isMultiple) {
              opts.multiple = true;
            }

            if (controller) {
              // Watch the model for programmatic changes
              scope.$watch(tAttrs.ngModel, function(current, old) {
                if (!current) {
                  return;
                }
                if (current === old) {
                  return;
                }
                controller.$render();
                
                console.log(controller);
              }, true);
              controller.$render = function() {
                if (isSelect) {
                  elm.select2('val', controller.$viewValue);
                }
                else {
                  if (opts.multiple) {
                    var viewValue = controller.$viewValue;
                    if (angular.isString(viewValue)) {
                      viewValue = viewValue.split(',');
                    }
                    elm.select2(
                      'data', convertToSelect2Model(viewValue));
                  }
                  else {
                    if (angular.isObject(controller.$viewValue)) {
                      elm.select2('data', controller.$viewValue);
                    }
                    else if (!controller.$viewValue) {
                      elm.select2('data', null);
                    }
                    else {
                      elm.select2('val', controller.$viewValue);
                    }
                  }
                }
              };

              // Watch the options dataset for changes
              if (watch) {
                scope.$watch(watch, function(newVal, oldVal, scope) {
                  if (angular.equals(newVal, oldVal)) {
                    return;
                  }
                  // Delayed so that the options have time to be rendered
                  $timeout(function() {
                    elm.select2('val', controller.$viewValue);
                    // Refresh angular to remove the superfluous option
                    elm.trigger('change');
                    if (newVal && !oldVal && controller.$setPristine) {
                      controller.$setPristine(true);
                    }
                  });
                });
              }

              // Update valid and dirty statuses
              controller.$parsers.push(function(value) {
                console.log(controller);
                var div = elm.prev();
                div
                  .toggleClass('ng-invalid', !controller.$valid)
                  .toggleClass('ng-valid', controller.$valid)
                  .toggleClass('ng-invalid-required', controller.$viewValue==null)
                  .toggleClass('ng-valid-required', controller.$viewValue!=null)
                  //.toggleClass('ng-dirty', controller.$dirty)
                  .toggleClass('ng-pristine', controller.$pristine);
                return value;
              });

              if (!isSelect) {
                // Set the view and model value and update the angular template manually for the ajax/multiple select2.
                elm.bind("change", function(e) {
                  e.stopImmediatePropagation();

                  if (scope.$$phase || scope.$root.$$phase) {
                    return;
                  }
                  scope.$apply(function() {
                    controller.$setViewValue(
                      convertToAngularModel(elm.select2('data')));
                  });
                });

                if (opts.initSelection) {
                  var initSelection = opts.initSelection;
                  opts.initSelection = function(element, callback) {
                    initSelection(element, function(value) {
                      controller.$setViewValue(convertToAngularModel(value));
                      callback(value);
                    });
                  };
                }
              }
            }

            elm.bind("$destroy", function() {
              elm.select2("destroy");
            });

            attrs.$observe('disabled', function(value) {
              elm.select2('enable', !value);
            });

            attrs.$observe('readonly', function(value) {
              elm.select2('readonly', !!value);
            });

            if (attrs.ngMultiple) {
              scope.$watch(attrs.ngMultiple, function(newVal) {
                attrs.$set('multiple', !!newVal);
                elm.select2(opts);
              });
            }

            // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
            $timeout(function() {
              elm.select2(opts);

              // Set initial value - I'm not sure about this but it seems to need to be there
              elm.val(controller.$viewValue);
              // important!
              controller.$render();

              // Not sure if I should just check for !isSelect OR if I should check for 'tags' key
              if (!opts.initSelection && !isSelect) {
                controller.$setViewValue(
                  convertToAngularModel(elm.select2('data'))
                );
              }
            });
          };
        }
      };
    }])
    .directive('uiSelectInfinite', function($resource, $compile, $injector) {
      return {
        restrict: 'EA',
        require: 'ngModel',
        template: '<div class="ui-select-infinite" ui-select2="select2Options" ng-model="ngModel" ng-required="isRequired" required="isRequired" on-change="onChange"><div>',
        scope: {
          factory: '@',
          idSelected: '@',
          ngModel: '=',
          multiple: '@?',
          search: '@?',
          isRequired: '=?',
          onChange: '&?'
        },
        link: function(scope, tElement, tAttrs, ngModel) {
          tElement.on('change', function() {
            alert('aaa')
          })
        },
        compile: function compile(tElement, tAttrs, transclude) {
          return {
            pre: function preLink(scope, iElement, iAttrs) {
              var split = scope.factory.split(".");
              var factory = $injector.get(split[0]);
              var factoryFunction = split[1];
              var multiple = false;
              var search = 0;

              if (scope.multiple && scope.$eval(iAttrs['multiple']) == true) multiple = true;
              if (scope.search && scope.$eval(iAttrs['search']) == false) search = -1;

              var queryHandler = function(query) {
                if (!angular.isDefined(query.page)) {
                  query.page = 1;
                }
                factory[factoryFunction](query.term, query.page)
                  .then(function(response) {
                      var more = false;
                      if ((query.page < response.total_page)) {
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
              }

              var formatSelection = function(response) {
                return response[scope.idSelected];
              }

              var formatResult = function(response) {
                var markup =
                  "<table>" +
                  "<tr><td><div>" + response[scope.idSelected] + "</div></td></tr>" +
                  "</table>";
                return markup;
              }

              scope.select2Options = {
                multiple: multiple,
                formatResult: formatResult,
                formatSelection: formatSelection,
                query: queryHandler,
                minimumResultsForSearch: search,
                placeholder: 'Select me..'
              }
            }
          }
        }
      }
    })
})()