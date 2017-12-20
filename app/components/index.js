'use strict';

module.exports = (app) => {
  require('./landing')(app);
  require('./search')(app);
  require('./upload')(app);
};
