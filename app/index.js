'use strict';

require('!!file-loader?name=[name].[ext]!./html/index.html');
require('./scss/base.scss');

const angular = require('angular');
const angularRoute = require('angular-route');
const searchApp = angular.module('searchApp', [angularRoute]);

searchApp.run(['$rootScope', ($rs) => {
  $rs.higherEd = require('./assets/dads-data-higher-ed.json');
  $rs.escdda = require('./assets/dads-data-esc-dda-only.json');
  $rs.itp = require('./assets/dads-data-itp.json');
  $rs.revel = require('./assets/dads-data-revel.json');
}]);

require('./controllers')(searchApp);
require('./components')(searchApp);

searchApp.config(['$routeProvider', '$locationProvider', ($rp, $lp) => {
  $lp.hashPrefix('');
  $rp
    .when('/search', {
      template: require('./html/search.html')
    })
    .otherwise({
      redirectTo: '/search'
    });
}]);
