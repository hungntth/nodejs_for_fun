const express = require('express');
const morgan = require('morgan');
const { default: helmet} = require('helmet');
const compression = require('compression')
const app = express();

app.use(morgan('dev'));

app.use(helmet());

app.use(compression());


module.exports = app