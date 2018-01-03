'use strict';

const Router = require('express').Router;
const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();
const createError = require('http-errors');
const debug = require('debug')('excelRouter');
const xlsx = require('xlsx');
const Book = require('../models/book');
const mongoose = require('mongoose');
const promise = require('bluebird');
mongoose.Promise = promise;

let excelRouter = module.exports = exports = Router();

excelRouter.post('/', multipartyMiddleware, (req, res, next) => {
  debug('POST /api/excel');
  let workbook = xlsx.readFile(req.files.file.path);
  let bookJson = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  let bookArray = bookJson.map(function(row) {
    let rowKeys = Object.keys(row);
    let newBook = new Book();
    rowKeys.forEach((key) => {
      if(key.replace(/\s/g, '').toLowerCase() === 'printisbn') {
        newBook.printISBN = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'lastname') {
        newBook.lastName = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'edition') {
        newBook.edition = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'copyrightyear') {
        newBook.year = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'printtitle') {
        newBook.printTitle = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'maintitleisbn') {
        newBook.mainTitleISBN = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'allinclusiveisbn') {
        newBook.allInclusiveISBN = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'updfisbn') {
        newBook.uPDFISBN = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'pxeisbn') {
        newBook.pXEISBN = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'looseleaf/sveisbn') {
        newBook.looseLeafSveISBN = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'llv/svewithaccesscardisbn') {
        newBook.llvSveISBNWithAccessCard = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === '2dlisbn') {
        newBook.twoDLISBN = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'revel') {
        newBook.revel = row[key];
      } else if(key.replace(/\s/g, '').toLowerCase() === 'mylab') {
        newBook.myLab = row[key];
      } else {
        console.log('error, did not match', key);
      }
    });
    return newBook;
  });
  if( mongoose.connection.collections['books']) {
    console.log('collection found');
    mongoose.connection.collections['books'].drop(function(err) {
      console.log('collection dropped');
    });
  }

  bookArray.forEach(function(book) {
    book.save().then(() => {}, (err) => {
      next(createError(400, err.message));
    });
  });

  res.send(bookArray);
});

excelRouter.get('/', (req, res, next) => {
  debug('GET /api/excel');
  Book.find().then((books) => {
    res.send(books);
  }).catch(next);
});
