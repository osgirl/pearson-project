'use strict';

module.exports = function(app) {
  app.controller('UploadController', ['$http', '$log', '$location', '$timeout', 'password', 'Upload', UploadController]);

  function UploadController($http, $log, $location, $timeout, passwordService, Upload) {
    this.passwordEntered = false;
    this.passwordError = false;

    this.checkSignIn = function() {
      $log.debug('UploadController.checkSignIn()');
      $log.log('passwordService', passwordService);
      if (passwordService.main === false) {
        $location.path('/landing');
      } else {
        $log.log('Signed in');
      }
      if (passwordService.upload === false) {
        $log.log('passwordService.upload === false');
        this.passwordEntered = false;
      } else  {
        $log.log('passwordService.upload !==false');
        this.passwordEntered = true;
      }
    };

    this.enterPassword = function(password) {
      $log.debug('UploadController.enterPassword(' + password + ')');
      if(password === 'DDAupdate') {
        this.passwordEntered = true;
        passwordService.upload = true;
        this.passwordError = false;
      } else  {
        this.passwordEntered = false;
        passwordService.upload = false;
        this.passwordError = true;
      }
    };

    this.uploadFile = function(file) {
      $log.debug('UploadController.uploadFile()');
      file.upload = Upload.upload({
        url: this.baseUrl + '/excel',
        method: 'POST',
        data: {file: file}
      });
      $log.log('file.upload', file.upload);
      file.upload.then((res) => {
        $log.log('res in file upload', res);
        $timeout(() => {
          $log.log('in timeout');
          file.result = res.data;
        });
      }, (err) => {
        $log.log('err', err);
        if (err.status > 0) {
          this.errorMsg = err.status + ': ' + err.data;
        }
      }, (evt) => {
        $log.log('evt', evt);
        file.progess = Math.min(100, parseInt(100.0 * evt.loaded/ evt.total));
      });
      $log.log('Past then block');
    };

  }
};
