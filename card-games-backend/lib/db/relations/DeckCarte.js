'use strict';

const db = require('../client');
const httpStatus = require('http-status-codes');

class DeckCarte {

  static getCompleteDeck(req, res) {
    db
      .getClient()
      .query('select * from DECK natural join COMPOSITION_DECK natural join CARTE where NUMERO_DECK=$1', [req.params.id])
      .then(queryRes => {

        if (queryRes.length === 0)
          return res.status(httpStatus.NOT_FOUND).send({ message: 'Not Found' });

        let output = null;
        queryRes.forEach(result => {
          if (!output) {
            output = {
              'numero_deck': result.numero_deck,
              'nom_deck': result.nom_deck,
              'cartes': [{
                'numero_carte': result.numero_carte,
                'description_carte': result.description_carte ,
                'type_carte': result.type_carte ,
                'titre_carte': result.titre_carte ,
                'famille_carte': result.famille_carte,
                'image_carte': result.image_carte
              }]
            };
          } else {
            output.cartes.push({
              'numero_carte': result.numero_carte,
              'description_carte': result.description_carte ,
              'type_carte': result.type_carte ,
              'titre_carte': result.titre_carte ,
              'famille_carte': result.famille_carte,
              'image_carte': result.image_carte
            });
          }
        });
        res.status(httpStatus.OK).send(output);
      });
  }

  static getAllLinks(req, res) {
    db
      .getClient()
      .query('select * from COMPOSITION_DECK')
      .then(queryRes => res.status(httpStatus.OK).send(queryRes))
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

  static getLink(req, res) {
    db
      .getClient()
      .query('select * from COMPOSITION_DECK where NUMERO_CARTE=$1 and NUMERO_DECK=$2', [req.params.carteId, req.params.deckId])
      .then(queryRes => {

        if (queryRes.length === 0)
          return res.status(httpStatus.NOT_FOUND).send({ message: 'not found' });
        res.status(httpStatus.OK).send(queryRes[0]);
      })
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

  static link(req, res) {
    db
      .getClient()
      .query(
        'insert into COMPOSITION_DECK(NUMERO_CARTE, NUMERO_DECK) VALUES($1, $2) returning *',
        [req.params.carteId, req.params.deckId])
      .then(queryRes => res.status(httpStatus.CREATED).send(queryRes[0]))
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

  static unlink(req, res) {
    db
      .getClient()
      .query(
        'delete from COMPOSITION_DECK where NUMERO_CARTE=$1 and NUMERO_DECK=$2',
        [req.params.carteId, req.params.deckId])
      .then(() => res.status(httpStatus.NO_CONTENT).send())
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

}

module.exports = DeckCarte;
