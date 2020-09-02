'use strict';

const db = require('../client');
const httpStatus = require('http-status-codes');

class JoueurDeck {

  static getAllLinks(req, res) {
    db
      .getClient()
      .query('select * from POSSEDE_PAR')
      .then(queryRes => res.status(httpStatus.OK).send(queryRes))
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

  static getLink(req, res) {
    db
      .getClient()
      .query('select * from POSSEDE_PAR where NUMERO_JOUEUR=$1 and NUMERO_DECK=$2', [req.params.joueurId, req.params.deckId])
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

  static getPlayerDecks(req, res) {
    db
      .getClient()
      .query('select DECK.* from DECK inner join POSSEDE_PAR on DECK.NUMERO_DECK = POSSEDE_PAR.NUMERO_DECK where POSSEDE_PAR.NUMERO_JOUEUR=$1', [req.params.joueurId])
      .then(queryRes => {

        if (queryRes.length === 0)
          return res.status(httpStatus.NOT_FOUND).send({ message: 'not found' });
        res.status(httpStatus.OK).send(queryRes);
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
        'insert into POSSEDE_PAR(NUMERO_JOUEUR, NUMERO_DECK) VALUES($1, $2) returning *',
        [req.params.joueurId, req.params.deckId])
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
        'delete from POSSEDE_PAR where NUMERO_JOUEUR=$1 and NUMERO_DECK=$2',
        [req.params.joueurId, req.params.deckId])
      .then(() => res.status(httpStatus.NO_CONTENT).send())
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

}

module.exports = JoueurDeck;
