'use strict';

const express = require('express');
const ModelHandler = require('../handlers/ModelHandler');

const Deck = require('../db/model/Deck');

const deckHandler = new ModelHandler(Deck);
const DeckCarte = require('../db/relations/DeckCarte');

const deckRouter = new express.Router();

deckRouter.get('/:id/carte', DeckCarte.getCompleteDeck);

deckRouter.get('/link', DeckCarte.getAllLinks);
deckRouter.get('/link/:deckId/:carteId', DeckCarte.getLink);
deckRouter.post('/link/:deckId/:carteId', DeckCarte.link);
deckRouter.delete('/link/:deckId/:carteId', DeckCarte.unlink);

deckRouter.get('/', deckHandler.getAll.bind(deckHandler));
deckRouter.get('/:id', deckHandler.getById.bind(deckHandler));
deckRouter.post('/', deckHandler.insert.bind(deckHandler));
deckRouter.put('/:id', deckHandler.updateById.bind(deckHandler));
deckRouter.delete('/:id', deckHandler.deleteById.bind(deckHandler));

module.exports = deckRouter;
