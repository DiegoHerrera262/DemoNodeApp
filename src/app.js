//server
const express = require('express');
const cors = require('cors');
const pkg = require('../package.json');
const morgan = require('morgan');
const { resolveMx } = require('node:dns');
const app = express();

// Seller routes
const sellerRouter = require('./routes/sellers.router');

// Middlewares
app.use(cors());
app.set('pkg', pkg);
app.use(express());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(morgan("dev"));

// Router
app.use(sellerRouter);

module.exports = app;