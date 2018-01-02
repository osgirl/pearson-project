'use strict';

module.exports = function (app) {
  app.factory('password', [function() {
    return {
      main: false,
      upload: false
    };
  }]);
};
