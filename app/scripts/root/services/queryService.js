(function() {
    'use strict';

    App.service('QueryService', ['$http', 'HttpService', function($http, HttpService) {
            return {
                getByQuery: function(queryString) {
                    var data = {
                        query: queryString
                    }
                    return HttpService.get('http://localhost:8888/tes_api/?query=' + queryString, {}, "Get Data");
                },
                getByOptions: function(optionString) {
                    return HttpService.get('http://localhost:8888/tes_api/?' + optionString, {}, "Get Data");
                }
            }
        }])
        .factory('LPK', ['QueryService', '$q', function(QueryService, $q) {
            return {
                getData: function(q, page) {
                    var deferred = $q.defer();
                    var qNew = window.encodeURIComponent("NAMA_LAB_LEMBAGA like '%" + q + "%'");
                    QueryService.getByOptions("table=m_lpk_skema&where=" + qNew + "&page=" + page + "&page_limit=10").then(function(response) {
                        //if (q != "") {
                        angular.forEach(response.data, function(item) {
                            item.id = item.ID_LPK_SKEMA
                        })
                        deferred.resolve(response);
                        // }
                    });
                    return deferred.promise;
                }
            }
        }])

})()