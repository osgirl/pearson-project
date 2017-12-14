'use strict';

module.exports = function(app) {
  app.controller('SearchController', ['$log', '$location', 'password', SearchController]);
  function SearchController($log, $location, passwordService) {
    this.return = {searchISBN: '', title: '', edition: '', author: '', returnISBN: ''};
    this.error = {searchISBN: ''};
    this.showReturn = false;
    this.showError = false;

    this.checkSignIn = function() {
      $log.debug('SearchController.checkSignIn()');
      if (passwordService.entered === false) {
        $location.path('/landing');
      } else {
        $log.log('Password Entered');
      }
    };

    this.clearReturn = function() {
      $log.debug('SearchController.clearReturn()');
      this.return = {searchISBN: '', title: '', edition: '', author: '', returnISBN: ''};
      this.error = {searchISBN: ''};
      this.showError = false;
      this.showReturn = false;
      this.searchISBN = '';
    };

    this.search = function(id) {
      $log.debug('SearchController.search('+ id +')');
      this.clearReturn();
      let escDda = this.escDda.filter((book) => {
        return book.A === id || book.B === id || book.C === id;
      });
      if (escDda.length > 0) {
        $log.log('escDda.length', escDda.length);
        let ret = escDda[0];
        this.return = {searchISBN: id, title: ret.D, edition: ret.E, author: ret.F, returnISBN: ret.B};
        this.showReturn = true;
        return;
      }
      let itp = this.itp.filter((book) => {
        return book.A === id || book.B === id || book.C === id || book.D === id;
      });
      if (itp.length > 0) {
        $log.log('itp.length', itp.length);
        let ret = itp[0];
        this.return = {searchISBN: id, title: ret.E, edition: ret.F, author: ret.H, returnISBN: ret.B};
        this.showReturn = true;
        return;
      }
      let revel = this.revel.filter((book) => {
        return book.A === id || book.B === id;
      });
      if (revel.length > 0) {
        $log.log('revel.length', revel.length);
        let ret = revel[0];
        this.return = {searchISBN: id, title: ret.C, edition: ret.D, author: ret.H, returnISBN: ret.B};
        this.showReturn = true;
        return;
      }

      let higherEd = this.higherEd.filter((book) => {
        return book.A === id || book.B === id || book.C === id || book.D === id || book.O === id || book.P === id || book.Q === id || book.R === id;
      });
      if (higherEd.length > 0) {
        $log.log('higherEd.length', higherEd.length);
        let ret = higherEd[0];
        this.return = {searchISBN: id, title: ret.E, edition: ret.F, author: ret.H, returnISBN: ret.B};
        this.showReturn = true;
        return;
      }

      if (higherEd.length === 0 && revel.length === 0 && escDda.length === 0 && itp.length === 0) {
        this.error = {searchISBN: id};
        this.showError = true;
      }
    };
  }
};
