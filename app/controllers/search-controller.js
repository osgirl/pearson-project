'use strict';

module.exports = function(app) {
  app.controller('SearchController', ['$http', '$log', '$location', '$timeout', 'password', SearchController]);
  function SearchController($http, $log, $location, $timeout, passwordService) {
    this.return = {searchISBN: '', title: '', edition: '', author: '', returnISBN: ''};
    this.error = {searchISBN: ''};
    this.bookArray = [];
    this.showReturn = false;
    this.showPXE = false;
    this.showUPDF = false;
    this.showError = false;

    this.checkSignIn = function() {
      $log.debug('SearchController.checkSignIn()');
      if (passwordService.main === false) {
        $location.path('/landing');
      } else {
        this.getBookArray();
      }
    };

    this.getBookArray = function() {
      $log.debug('SearchController.getBookArray()');
      $http.get(this.baseUrl + '/excel', this.httpConfig).then((res) => {
        $log.log('Successfully returned bookArray');
        this.bookArray = res.data;
      }, (err) => {
        $log.log('error in SearchController.getBookArray()', err);
      });
    };

    this.clearReturn = function() {
      $log.debug('SearchController.clearReturn()');
      this.return = {searchISBN: '', title: '', edition: '', author: '', returnISBN: ''};
      this.error = {searchISBN: ''};
      this.showError = false;
      this.showReturn = false;
      this.showPXE = false;
      this.showUPDF = false;
      this.searchISBN = '';
    };

    this.search = function(id) {
      $log.debug('SearchController.search('+ id +')');
      this.clearReturn();
      let bookReturn = this.bookArray.filter((book) => {
        return book.printISBN === id || book.mainTitleISBN === id || book.allInclusiveISBN === id || book.uPDFISBN === id || book.pXEISBN === id || book.looseLeafSveISBN === id || book.llvSveISBNWithAccessCard === id || book.twoDLISBN === id || book.revel === id || book.myLab === id;
      });
      if (bookReturn.length > 0) {
        let ret = bookReturn[0];
        this.return = {searchISBN: id, title: ret.printTitle, edition: ret.edition, author: ret.lastName};
        if (ret.pXEISBN) {
          this.return.returnISBN = ret.pXEISBN;
          this.showPXE = true;
        } else if (ret.uPDFISBN) {
          this.return.returnISBN = ret.uPDFISBN;
          this.showUPDF = true;
        } else {
          this.return.returnISBN = 'No PXE or uPDF ISBN associated with this title';
        }
        this.showReturn = true;
      }

      if (bookReturn.length === 0) {
        this.error = {searchISBN: id};
        this.showError = true;
      }
    };
  }
};
