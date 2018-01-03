'use strict';

const promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = promise;

let bookSchema = mongoose.Schema({
  lastName: {type: String, required: true},
  edition: {type: String, required: true},
  year: String,
  printISBN: {type: String, required: true, unique: true},
  printTitle: {type: String, required: true},
  mainTitleISBN: String,
  allInclusiveISBN: {type: String, sparse: true, unique: true},
  uPDFISBN: {type: String, sparse: true, unique: true},
  pXEISBN: {type: String, sparse: true, unique: true},
  looseLeafSveISBN: String,
  llvSveISBNWithAccessCard: String,
  twoDLISBN: {type: String, unique: true, sparse: true},
  revel: {type: String, unique: true, sparse: true},
  myLab: String
});

module.exports = exports = mongoose.model('Book', bookSchema);
