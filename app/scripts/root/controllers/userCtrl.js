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
            options: {
                roleOptions: [{
                    id_role: '1',
                    role_name: 'Administrator'
                }, {
                    id_role: '2',
                    role_name: 'Guest'
                }]
            },
            var: {
                username: '',
                input: {
                    username: '',
                    role: {
                        id_role: '2',
                        role_name: 'Guest'
                    }
                }
            }
        },
        init: function() {
            this._onInit();
        },
        watch: {},
        methods: {
            _onInit: function() {
                this.onLoad().getUserList();
                this.onLoad().getRoleOptions();
            },
            onLoad: function() {
                var _this = this;
                return {
                    getUserList: function() {
                        _this.UserService.getData().then(function(response) {
                            _this.collection.userList.data = response.data;
                        });
                    },
                    getRoleOptions: function() {
                        _this.RoleService.getData().then(function(response) {
                            _this.options.roleOptions = response.data;
                        });
                    }
                };
            },
            onClick: function() {
                var _this = this;
                return {
                    add: function(condition) {
                        _this.state.isAdd = condition;
                        if (condition) {
                            _this.var.input = {
                                username: '',
                                role: {
                                    id_role: '2',
                                    role_name: 'Guest'
                                }
                            }
                        }
                    },
                    edit: function(condition, row) {
                        _this.state.isEdit = condition;
                        if (condition) {
                            _this.var.rowEdit = row;
                            _this.var.username = row.username;
                            _this.var.input = {
                                username: row.username,
                                role: {
                                    id_role: row.id_role,
                                    role_name: 'Guest'
                                }
                            }
                        }
                    },
                    delete: function(row, index) {
                        var deleteRow = function() {
                            _this.RoleService.submitDelete(row.username).then(function(response) {
                                if (response.success_message) {
                                    _this.collection.userList.data.splice(index, 1);
                                }
                            });
                        }
                        _this.Notif.confirmation({
                            headerTitle: 'Delete Confirmation',
                            message: 'Do you want delete this row ?',
                            okFunction: deleteRow
                        });
                    }
                };
            },
            onSubmit: function() {
                var _this = this;
                return {
                    add: function(myForm) {
                        if (myForm.$valid) {
                            _this.UserService.submitAdd(_this.var.input).then(function(response) {
                                if (response.success_message) {
                                    _this.collection.userList.data.push({
                                        username: _this.var.input.username,
                                        role_name: _this.var.input.role.role_name
                                    });
                                    _this.state.isAdd = false;
                                }
                            });
                        }
                    },
                    edit: function(myForm) {
                        if (myForm.$valid) {
                            _this.UserService.submitEdit(_this.var.username, _this.var.input).then(function(response) {
                                if (response.success_message) {
                                    _this.var.rowEdit.username = _this.var.input.username;
                                    _this.var.rowEdit.role_name = _this.var.input.role.role_name;
                                    _this.state.isEdit = false;
                                }
                            });
                        }
                    }
                }
            },
            onChange: function() {
                var _this = this;
                return {};
            },
            _get: function() {
                var _this = this;
                return {};
            }
        }
    });
})();