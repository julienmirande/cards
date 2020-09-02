'use strict';

const express = require('express');
const httpStatus = require('http-status-codes');

const ModelHandler = require('../handlers/ModelHandler');

const Exemplaire = require('../db/model/Exemplaire');

const exemplaireHandler = new ModelHandler(Exemplaire);

const exemplaireRouter = new express.Router();

exemplaireRouter.get('/complete', async (req, res) => {
  try {
    const result = await Exemplaire.getExemplaireComplete();
    res.status(httpStatus.OK).send(result);
  } catch (err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send('FAILED');
  }
});


exemplaireRouter.get('/', exemplaireHandler.getAll.bind(exemplaireHandler));
exemplaireRouter.get('/:id', exemplaireHandler.getById.bind(exemplaireHandler));
exemplaireRouter.post('/', exemplaireHandler.insert.bind(exemplaireHandler));
exemplaireRouter.put('/:id', exemplaireHandler.updateById.bind(exemplaireHandler));
exemplaireRouter.delete('/:id', exemplaireHandler.deleteById.bind(exemplaireHandler));

module.exports = exemplaireRouter;
