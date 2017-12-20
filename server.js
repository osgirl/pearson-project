'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Promise = require('bluebird');
const createError = require('http-errors');
const debug = require('debug')('server');
const cors = require('cors');

const excelRouter = require('./backend/routes/excel-router');

const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost/isbnsearchdev';

mongoose.Promise = Promise;
mongoose.connect(mongoDbUri);

app.use(express.static(`${__dirname}/build`));
app.use(cors());

app.use('/api/excel', excelRouter);

app.all('*', function(req, res, next) {
  debug('Hit app.all 404 route');
  next(createError(404, `Error: ${req.method} :: ${req.url} is not a route`));
});

app.listen(port, function() {
  debug(`Server Up :: ${port}`);
});
