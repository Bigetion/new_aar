(function() {
    'use strict';
    App.service('UserService', ['$http', 'HttpService', 'API_BASE_URL', function($http, HttpService, API_BASE_URL) {
        return {
            getIdRole: function(){
                return HttpService.get(API_BASE_URL + 'app/getIdRole', {}, "Get Id Role");
            },
            getData: function() {
                return HttpService.get(API_BASE_URL + 'app/getUserList', {}, "Get Data");
            },
            submitAdd: function(inputData) {
                var data = {
                    username: inputData.username,
                    idRole: inputData.role.id_role
                }
                return HttpService.execute(API_BASE_URL + 'app/submitAddUser', data, "Add Data");
            },
            submitEdit: function(idUser, inputData) {
                var data = {
                    idUser: idUser,
                    username: inputData.username,
                    idRole: inputData.role.id_role
                }
                return HttpService.execute(API_BASE_URL + 'app/submitEditUser', data, "Update Data");
            },
            submitDelete: function(idUser) {
                var data = {
                    idUser: idUser,
                }
                return HttpService.execute(API_BASE_URL + 'app/submitDeleteUser', data, "Delete Data");
            }
        }
    }])

})()