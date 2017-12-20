'use strict';

module.exports = (app) => {
  app.component('kbUpload', {
    controller: 'UploadController',
    template: require('./upload-template.html'),
    bindings: {
      baseUrl: '<',
      httpConfig: '<'
    }
  });
};
