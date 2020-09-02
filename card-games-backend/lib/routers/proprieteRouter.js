'use strict';

const express = require('express');
const httpStatus = require('http-status-codes');

const ModelHandler = require('../handlers/ModelHandler');

const Propriete = require('../db/model/Propriete');

const proprieteHandler = new ModelHandler(Propriete);

const proprieteRouter = new express.Router();

proprieteRouter.get('/complete', async (req, res) => {
  try {
    const result = await Propriete.getAllComplete();
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send('FAILED');
  }
});

proprieteRouter.post('/byName', async (req, res) => {
  try {
    const result = await Propriete.insertByName(req.body);
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send('FAILED');
  }
});

proprieteRouter.get('/', proprieteHandler.getAll.bind(proprieteHandler));
proprieteRouter.get('/:id', proprieteHandler.getById.bind(proprieteHandler));
proprieteRouter.post('/', proprieteHandler.insert.bind(proprieteHandler));
proprieteRouter.put('/:id', proprieteHandler.updateById.bind(proprieteHandler));
proprieteRouter.delete('/:id', proprieteHandler.deleteById.bind(proprieteHandler));


module.exports = proprieteRouter;
