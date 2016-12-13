(function() {
  'use strict';
  App.controller('ContactCtrl', ['$scope', 'QueryService', '$q', 'rtService',
      function($scope, QueryService, $q, rtService) {
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
          }
        }

        $scope.onChange = {
          tAnggotaTimList: function() {
            QueryService.getByOptions('table=t_anggota_tim_asesmen&page=' + $scope.list.tAnggotaTim.page + '&page_limit=10').then(function(response) {
              $scope.list.tAnggotaTim.data = response.data
            })
          }
        }

        $scope.get.tAnggotaTimList();

        $scope.movieListProvider = {
          readData: function(term, page, pageSize) {
            var deferred = $q.defer();
            rtService.get({
                q: term,
                page_limit: pageSize,
                page: page + 1
              })
              .$promise.then(function(data) {
                deferred.resolve(data);
              }, function(reason) {
                deferred.reject(reason);
              });
            return deferred.promise;
          },
          getUser: function(q, page, pageSize) {
            var deferred = $q.defer();
            var qNew = window.encodeURIComponent("username like '" + q + "%'");
            QueryService.getByOptions("table=users&where=" + qNew + "&page=" + page + "&page_limit=" + pageSize).then(function(response) {
              if (q != "") {
                deferred.resolve(response);
              }
            });

            return deferred.promise;
          }
        };

      }
    ])
    .factory('rtService', ['$resource',
      function($resource) {
        return $resource('http://api.rottentomatoes.com/api/public/v1.0/movies.json', {}, {
          get: {
            method: 'JSONP',
            params: {
              callback: 'JSON_CALLBACK',
              apikey: '2evps5bjgnwus5deeanv8gk2' //please do not use this key, you can get your own
            }
          }
        });
      }
    ])
    .directive('rtSelect2', function($resource, $compile) {
      return {
        template: "<div ui-select2='select2Options' ng-model='ngModel' style='width:300px'></div>",
        scope: {
          provider: '=',
          ngModel: '='
        },
        compile: function compile(tElement, tAttrs, transclude) {
          return {
            /**
             * this is one of the rare cases where I had to use preLink,
             * this is due to a select2 issue
             */
            pre: function preLink(scope, iElement, iAttrs) {
              var PAGE_SIZE = 20;
              var queryHandler = function(query) {

                if (!angular.isDefined(query.page)) {
                  query.page = 1;
                }
                //server start paging from 0 while client starts with 1
                scope.provider.readData(query.term, query.page, PAGE_SIZE)
                  .then(function(response) {
                      if (angular.isDefined(response.movies) && angular.isDefined(response.total)) {
                        var more = false;
                        //see if there are more results to page...
                        if (response.total > ((query.page) * response.movies.length)) {
                          more = true;
                        }
                        query.callback({
                          results: response.movies,
                          more: more
                        });
                      }
                    },
                    //terminate the query in case if error
                    function() {
                      query.callback({
                        results: [],
                        more: false
                      });
                    });
              };
              /**
               * formatters where copied from the original code example
               */
              var formatResult = function(response) {
                var markup = "<table class='movie-result'><tr>";
                // if (response.posters !== undefined && response.posters.thumbnail !== undefined) {
                //   markup += "<td class='movie-image'><img src='" + response.posters.thumbnail + "'/></td>";
                // }
                markup += "<td class='movie-info'><div class=''>" + response.title + "</div>";
                // if (response.critics_consensus !== undefined) {
                //   markup += "<div class='movie-synopsis'>" + response.critics_consensus + "</div>";
                // }
                // else if (response.synopsis !== undefined) {
                //   markup += "<div class='movie-synopsis'>" + response.synopsis + "</div>";
                // }
                markup += "</td></tr></table>";
                return markup;
              }

              var formatSelection = function(response) {
                return response.title;
              }

              scope.select2Options = {
                data: [{
                  "id": "771310953",
                  "title": "Ah haru (Wait and See)",
                  "year": 2012,
                  "mpaa_rating": "Unrated",
                  "runtime": 100,
                  "release_dates": {},
                  "ratings": {
                    "critics_score": -1,
                    "audience_score": 50
                  },
                  "synopsis": "A salaryman faces a major life change as his firm undergoes financial difficulties. To add to his troubles, a man claiming to be his long-estranged father shows up at his house requesting shelter.",
                  "posters": {
                    "thumbnail": "https://d2a5cgar23scu2.cloudfront.net/static/images/redesign/poster_default_thumb.gif",
                    "profile": "https://d2a5cgar23scu2.cloudfront.net/static/images/redesign/poster_default_thumb.gif",
                    "detailed": "https://d2a5cgar23scu2.cloudfront.net/static/images/redesign/poster_default_thumb.gif",
                    "original": "https://d2a5cgar23scu2.cloudfront.net/static/images/redesign/poster_default_thumb.gif"
                  },
                  "abridged_cast": [{
                    "name": "Koichi Sato",
                    "id": "364658857"
                  }, {
                    "name": "Yuki Saito",
                    "id": "770797812"
                  }, {
                    "name": "Tsutomu Yamazaki",
                    "id": "162665764"
                  }, {
                    "name": "Shiho Fujimura",
                    "id": "258248536"
                  }, {
                    "name": "Sumiko Fuji",
                    "id": "770810836"
                  }],
                  "links": {
                    "self": "http://api.rottentomatoes.com/api/public/v1.0/movies/771310953.json",
                    "alternate": "http://www.rottentomatoes.com/m/ah_haru_2012/",
                    "cast": "http://api.rottentomatoes.com/api/public/v1.0/movies/771310953/cast.json",
                    "reviews": "http://api.rottentomatoes.com/api/public/v1.0/movies/771310953/reviews.json",
                    "similar": "http://api.rottentomatoes.com/api/public/v1.0/movies/771310953/similar.json"
                  }
                }],
                formatResult: formatResult,
                formatSelection: formatSelection,
                multiple: true,
                query: queryHandler
              };
            }
          }
        }
      }
    })
    .directive('rtSelect3', function($resource, $compile) {
      return {
        template: "<div ui-select2='select2Options' ng-model='ngModel' style='width:300px'></div>",
        scope: {
          provider: '=',
          ngModel: '='
        },
        compile: function compile(tElement, tAttrs, transclude) {
          return {
            /**
             * this is one of the rare cases where I had to use preLink,
             * this is due to a select2 issue
             */
            pre: function preLink(scope, iElement, iAttrs) {
              var PAGE_SIZE = 10;
              var queryHandler = function(query) {

                if (!angular.isDefined(query.page)) {
                  query.page = 1;
                }

                scope.provider.getUser(query.term, query.page, PAGE_SIZE)
                  .then(function(response) {
                      angular.forEach(response.data, function(item) {
                        item.id = item.id_user
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
              };

              var formatResult = function(response) {
                var markup =
                  "<table class='movie-result'>" +
                  "<tr><td class='movie-info'><div class='movie-title'>" + response.username + "</div></td></tr>" +
                  "</table>";
                return markup;
              }

              var formatSelection = function(response) {
                return response.id + " - " + response.username;
              }

              scope.select2Options = {
                data: [],
                formatResult: formatResult,
                formatSelection: formatSelection,
                multiple: false,
                query: queryHandler
              };
            }
          }
        }
      }
    })
})()