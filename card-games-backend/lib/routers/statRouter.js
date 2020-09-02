'use strict';

const express = require('express');
const httpStatus = require('http-status-codes');

const stat = require('../db/stat');

const statRouter = new express.Router();

statRouter.get('/joueur', async (req, res) => {
  try {
    const result = await stat.joueursCartesCount();
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send();
  }
});

statRouter.get('/valeurJoueur', async (req, res) => {
  try {
    const result = await stat.joueursValeur();
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send();
  }
});

statRouter.get('/carteJoueur', async (req, res) => {
  try {
    const result = await stat.listeCarteAvecJoueur();
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send();
  }
});

statRouter.get('/joueursCartesRares', async (req, res) => {
  try {
    const result = await stat.joueursCartesRares();
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send();
  }
});

statRouter.get('/familleCartes', async (req, res) => {
  try {
    const result = await stat.familleCartes();
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send();
  }
});

module.exports = statRouter;
