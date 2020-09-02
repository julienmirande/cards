'use strict';

const express = require('express');
const ConnectionHandler = require('../handlers/ConnectionHandler');

const connectionRouter = new express.Router();

connectionRouter.get('/healthcheck', ConnectionHandler.handleHealthcheck);
connectionRouter.get('/ping', ConnectionHandler.handlePing);
connectionRouter.get('/tables', ConnectionHandler.handleTables);
connectionRouter.post('/drop', ConnectionHandler.handleDrop);
connectionRouter.post('/reset', ConnectionHandler.handleReset);


module.exports = connectionRouter;
