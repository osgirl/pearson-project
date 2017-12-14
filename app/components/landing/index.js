'use strict';

module.exports = (app) => {
  app.component('kbLanding', {
    controller: 'LandingController',
    template: require('./landing-template.html')
  });
};
