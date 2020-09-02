'use strict';

const express = require('express');
const httpStatus = require('http-status-codes');

const ModelHandler = require('../handlers/ModelHandler');

const Partie = require('../db/model/Partie');

const partieHandler = new ModelHandler(Partie);

const partieRouter = new express.Router();

partieRouter.get('/named', async (req, res) => {
  try {
    const result = await Partie.getAllWithNames();
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send('FAILED');
  }
});

partieRouter.post('/double', async (req, res) => {
  try {
    const result = await Partie.insertDouble(req.body);
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send('FAILED');
  }
});

partieRouter.get('/', partieHandler.getAll.bind(partieHandler));
partieRouter.get('/:id', partieHandler.getById.bind(partieHandler));
partieRouter.post('/', partieHandler.insert.bind(partieHandler));
partieRouter.put('/:id', partieHandler.updateById.bind(partieHandler));
partieRouter.delete('/:id', partieHandler.deleteById.bind(partieHandler));



module.exports = partieRouter;
