'use strict';

const express = require('express');
const ModelHandler = require('../handlers/ModelHandler');

const Carte = require('../db/model/Carte');
const Caracteristique = require('../db/model/Caracteristique');

const carteHandler = new ModelHandler(Carte);
const caracteristiqueHandler = new ModelHandler(Caracteristique);
const CarteCaracteristique = require('../db/relations/CarteCaracteristique');

const carteRouter = new express.Router();

carteRouter.get('/:id/caracteristique', CarteCaracteristique.getCompleteCard);

carteRouter.get('/link', CarteCaracteristique.getAllLinks);
carteRouter.get('/link/:carteId/:caracteristiqueId', CarteCaracteristique.getLink);
carteRouter.post('/link/:carteId/:caracteristiqueId', CarteCaracteristique.link);
carteRouter.put('/link/:carteId/:caracteristiqueId', CarteCaracteristique.updateLink);
carteRouter.delete('/link/:carteId/:caracteristiqueId', CarteCaracteristique.unlink);

carteRouter.get('/caracteristique', caracteristiqueHandler.getAll.bind(caracteristiqueHandler));
carteRouter.get('/caracteristique/:id', caracteristiqueHandler.getById.bind(caracteristiqueHandler));
carteRouter.post('/caracteristique', caracteristiqueHandler.insert.bind(caracteristiqueHandler));
carteRouter.put('/caracteristique/:id', caracteristiqueHandler.updateById.bind(caracteristiqueHandler));
carteRouter.delete('/caracteristique/:id', caracteristiqueHandler.deleteById.bind(caracteristiqueHandler));

carteRouter.get('/', carteHandler.getAll.bind(carteHandler));
carteRouter.get('/:id', carteHandler.getById.bind(carteHandler));
carteRouter.post('/', carteHandler.insert.bind(carteHandler));
carteRouter.put('/:id', carteHandler.updateById.bind(carteHandler));
carteRouter.delete('/:id', carteHandler.deleteById.bind(carteHandler));

module.exports = carteRouter;
