'use strict';

const httpStatus = require('http-status-codes');
const dbConnection = require('../db/connection');
const handle = require('./handle');

class ConnectionHandler {

  static handleHealthcheck(req, res) {
    res.status(httpStatus.OK).send('Application is up and running');
  }

  static handlePing(req, res) {
    handle(res, {
      fn: dbConnection.ping,
      errorStatus: httpStatus.SERVICE_UNAVAILABLE,
      errorMessage: 'Unable to reach db'
    });
  }

  static handleTables(req, res) {
    handle(res, {
      fn: dbConnection.listTables,
      errorStatus: httpStatus.SERVICE_UNAVAILABLE
    });
  }

  static handleDrop(req, res) {
    handle(res, {
      fn: dbConnection.dropDb,
      errorStatus: httpStatus.SERVICE_UNAVAILABLE
    });
  }

  static handleReset(req, res) {

    dbConnection
      .resetDB()
      .then(() => res.sendStatus(httpStatus.OK).send())
      .catch(e => {
        console.error(e);
        res.sendStatus(httpStatus.SERVICE_UNAVAILABLE).send({message: 'Could not connect to DB'});
      });
  }
}

module.exports = ConnectionHandler;
