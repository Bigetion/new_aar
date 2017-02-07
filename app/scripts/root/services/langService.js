(function () {
  'use strict';

  App.service('LangService', ['HttpService', '$sessionStorage', function (HttpService, $sessionStorage) {
    this.currentLanguage = function () {
      return $sessionStorage.appLang || 'en_US';
    };

    this.changeLanguage = function (langId) {
      $sessionStorage.appLang = langId;
      return this.currentLanguage();
    };

    this.loadTranslation = function () {
      var lang = $sessionStorage.appLang || 'en_US';
      var path = 'scripts/language/' + lang + '.json';

      return HttpService.retrieve(path, null, 'Get translation file "' + lang + '"');
    };

    this.loadMessageResourceTransalation = function () {
      var lang = $sessionStorage.appLang || 'en_US';
      var path = 'scripts/language/messageResource.' + lang + '.json';

      return HttpService.retrieve(path, null, 'Get message resource translation file "' + lang + '"');
    };

  }]);
})();
