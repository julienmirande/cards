'use strict';

const express = require('express');
const httpStatus = require('http-status-codes');

const ModelHandler = require('../handlers/ModelHandler');

const Joueur = require('../db/model/Joueur');

const joueurHandler = new ModelHandler(Joueur);
const JoueurDeck = require('../db/relations/JoueurDeck');


const joueurRouter = new express.Router();

joueurRouter.get('/collectionneurs', async (req, res) => {
  try {
    const result = await Joueur.getCollectionneurs(req.query.filter);
    res.status(httpStatus.OK).send(result);
  } catch(err) {
    console.error(err);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send('FAILED');
  }
});

joueurRouter.get('/link', JoueurDeck.getAllLinks);
joueurRouter.get('/link/:joueurId/:deckId', JoueurDeck.getLink);
joueurRouter.get('/link/:joueurId', JoueurDeck.getPlayerDecks);
joueurRouter.post('/link/:joueurId/:deckId', JoueurDeck.link);
joueurRouter.delete('/link/:joueurId/:deckId', JoueurDeck.unlink);

joueurRouter.get('/', joueurHandler.getAll.bind(joueurHandler));
joueurRouter.get('/:id', joueurHandler.getById.bind(joueurHandler));
joueurRouter.post('/', joueurHandler.insert.bind(joueurHandler));
joueurRouter.put('/:id', joueurHandler.updateById.bind(joueurHandler));
joueurRouter.delete('/:id', joueurHandler.deleteById.bind(joueurHandler));





module.exports = joueurRouter;
