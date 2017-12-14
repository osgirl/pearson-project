'use strict';

module.exports = function (app) {
  app.factory('password', [function() {
    return {
      entered: false
    };
  }]);
};
