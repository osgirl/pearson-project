'use strict';

module.exports = function(app) {
  app.controller('LandingController', ['$location', 'password', LandingController]);
  function LandingController($location, passwordService) {
    this.password = '';
    this.passwordError = false;

    this.enterPassword = function(password) {
      if (password === 'PearsonDDA') {
        passwordService.main = true;
        $location.path('/search');
      } else {
        this.password = '';
        this.passwordError = true;
      }
    };

  }
};
