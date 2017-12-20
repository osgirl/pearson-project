'use strict';

module.exports = (app) => {
  require('./landing-controller')(app);
  require('./search-controller')(app);
  require('./upload-controller')(app);
};
