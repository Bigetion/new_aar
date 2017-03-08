(function () {
    'use strict';
    App.classy.controller({
        name: 'AppCtrl',
        inject: ['$rootScope', '$scope', 'AuthService', '$location', '$cookies'],
        data: {
            state: {

            },
            var: {

            }
        },
        init: function () {
            this._onInit();
        },
        watch: {},
        methods: {
            _onInit: function () {

            },
            onLoad: function () {
                var _this = this;
                return {
                    logout: function() {
                        _this.AuthService.logout().then(function (response) {
                            _this.$location.path('/login');
                            _this.$cookies.remove("token");
                        });
                    }
                };
            }
        }
    });
})();