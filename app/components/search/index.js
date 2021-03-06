'use strict';

module.exports = (app) => {
  app.component('kbSearch', {
    controller: 'SearchController',
    template: require('./search-template.html'),
    bindings: {
      baseUrl: '<',
      httpConfig: '<'
    }
  });
};
