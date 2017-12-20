'use strict';

require('!!file-loader?name=[name].[ext]!./html/index.html');
require('./scss/base.scss');

const angular = require('angular');
const angularRoute = require('angular-route');
const ngFileUpload = require('ng-file-upload');
const searchApp = angular.module('searchApp', [angularRoute, ngFileUpload]);

searchApp.run(['$rootScope', ($rs) => {
  $rs.baseUrl = `${__API_URL__}/api`;
  $rs.httpConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
}]);

require('./controllers')(searchApp);
require('./components')(searchApp);
require('./services')(searchApp);

searchApp.config(['$routeProvider', '$locationProvider', ($rp, $lp) => {
  $lp.hashPrefix('');
  $rp
    .when('/landing', {
      template: require('./html/landing.html')
    })
    .when('/search', {
      template: require('./html/search.html')
    })
    .when('/upload', {
      template: require('./html/upload.html')
    })
    .otherwise({
      redirectTo: '/landing'
    });
}]);
