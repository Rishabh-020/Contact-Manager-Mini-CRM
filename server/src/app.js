const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const requestLogger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(requestLogger);
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '5mb' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
