'use strict';

module.exports = (app) => {
  require('./landing')(app);
  require('./search')(app);
};
