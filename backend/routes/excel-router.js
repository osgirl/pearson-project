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
    let newBook = new Book();
    newBook.printISBN = row['Print ISBN'];
    newBook.lastName = row['Last Name'];
    newBook.edition = row['Edition'];
    newBook.year = row['Copyright Year'];
    newBook.printTitle = row['Print Title'];
    if (row['Main Title ISBN'] !== undefined) {
      newBook.mainTitleISBN = row['Main Title ISBN '];
    }
    if (row['All Inclusive ISBN'] !== undefined) {
      newBook.allInclusiveISBN = row['All Inclusive ISBN'];
    }
    if (row['uPDF ISBN'] !== undefined) {
      newBook.uPDFISBN = row['uPDF ISBN'];
    }
    if (row['PXE ISBN'] !== undefined) {
      newBook.pXEISBN = row['PXE ISBN'];
    }
    if (row['Loose Leaf / SVE ISBN'] !== undefined) {
      newBook.looseLeafISBN = row['Loose Leaf / SVE ISBN'];
    }
    if (row['LLV / SVE with Access Card ISBN'] !== undefined) {
      newBook.llvSveISBNWithAccessCard = row ['LLV / SVE with Access Card ISBN'];
    }
    if (row['2DL ISBN'] !== undefined) {
      newBook.twoDLISBN = row['2DL ISBN'];
    }
    if (row['REVEL'] !== undefined) {
      newBook.revel = row['REVEL'];
    }
    if (row['MyLab'] !== undefined) {
      newBook.myLab = row['MyLab'];
    }
    return newBook;
  });
  console.log('mongoose.connection.collections[books]', mongoose.connection.collections['books']);
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
