'use strict';

module.exports = function(app) {
  app.controller('SearchController', ['$http', '$log', '$location', '$timeout', 'password', SearchController]);
  function SearchController($http, $log, $location, $timeout, passwordService) {
    this.return = [{searchISBN: '', title: '', edition: '', author: '', returnISBN: '', showUPDF: false, showPXE: false}];
    this.error = {searchISBN: ''};
    this.bookArray = [];
    this.showReturn = false;
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
        $log.log('this.bookArray', this.bookArray);
      }, (err) => {
        $log.log('error in SearchController.getBookArray()', err);
      });
    };

    this.clearReturn = function() {
      $log.debug('SearchController.clearReturn()');
      this.return = [{searchISBN: '', title: '', edition: '', author: '', returnISBN: '', showUPDF: false, showPXE: false}];
      this.error = {searchISBN: ''};
      this.showError = false;
      this.showReturn = false;
      this.searchISBN = '';
    };

    this.search = function(id) {
      $log.debug('SearchController.search('+ id +')');
      this.clearReturn();
      let bookReturn = this.bookArray.filter((book) => {
        return book.printISBN === id || book.mainTitleISBN === id || book.allInclusiveISBN === id || book.uPDFISBN === id || book.pXEISBN === id || book.looseLeafSveISBN === id || book.llvSveISBNWithAccessCard === id || book.twoDLISBN === id || book.revel === id || book.myLab === id;
      });
      if (bookReturn.length > 0) {
        this.return = [];
        for (var i = 0; i < bookReturn.length; i++) {
          this.return[i] = {searchISBN: id, title: bookReturn[i].printTitle, edition: bookReturn[i].edition, author: bookReturn[i].lastName};
          if (bookReturn[i].pXEISBN) {
            this.return[i].returnISBN = bookReturn[i].pXEISBN;
            this.return[i].showPXE = true;
            this.return[i].showUPDF = false;
          } else if (bookReturn[i].uPDFISBN) {
            this.return[i].returnISBN = bookReturn[i].uPDFISBN;
            this.return[i].showUPDF = true;
            this.return[i].showPXE = false;
          } else {
            this.return[i].returnISBN = 'No PXE or uPDF ISBN associated with this title';
          }
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
