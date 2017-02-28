(function() {
    'use strict';
    App.classy.controller({
        name: 'UserCtrl',
        inject: ['$rootScope', '$scope', 'UserService', 'RoleService'],
        data: {
            state: {

            },
            collection: {
                userList: {
                    data: []
                }
            },
            var: {
                idRole: 2
            }
        },
        init: function() {
            this._onInit();
        },
        watch: {},
        methods: {
            _onInit: function() {
                var _this = this;
                _this.onLoad().getUserList();
                _this.onLoad().getIdRole();
            },
            onLoad: function() {
                var _this = this;
                return {
                    getUserList: function() {
                        _this.UserService.getData().then(function(response) {
                            _this.collection.userList.data = response.data;
                        });
                    },
                    getIdRole: function(){
                        _this.UserService.getIdRole().then(function(response) {
                            _this.var.idRole = response.idRole;
                        });
                    }
                };
            },
            onClick: function() {
                var _this = this;
                return {

                };
            },
            onSubmit: function() {
                var _this = this;
                return {

                }
            },
            onChange: function() {
                var _this = this;
                return {};
            }
        }
    });
})();