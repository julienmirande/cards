'use strict';

const httpStatus = require('http-status-codes');
const handle = require('./handle');

class ModelHandler {

  constructor(modelClass) {
    this.modelClass = modelClass;
  }

  getAll(req, res) {
    handle(res, {
      fn: this.modelClass.getAll,
      args: [req.query],
      errorStatus: httpStatus.SERVICE_UNAVAILABLE
    });
  }

  getById(req, res) {
    handle(res, {
      fn:this.modelClass.getById,
      args: [req.params.id],
      errorStatus: httpStatus.SERVICE_UNAVAILABLE
    });
  }

  insert(req, res) {
    handle(res, {
      fn:this.modelClass.insert,
      args: [req.body],
      successStatus: httpStatus.CREATED,
      errorStatus: httpStatus.SERVICE_UNAVAILABLE
    });
  }

  updateById(req, res) {
    handle(res, {
      fn:this.modelClass.updateById.bind(this.modelClass),
      args: [req.params.id, req.body],
      errorStatus: httpStatus.SERVICE_UNAVAILABLE
    });
  }

  deleteById(req, res) {
    handle(res, {
      fn:this.modelClass.deleteById,
      args: [req.params.id],
      successStatus: httpStatus.NO_CONTENT,
      errorStatus: httpStatus.SERVICE_UNAVAILABLE
    });
  }

}


module.exports = ModelHandler;
