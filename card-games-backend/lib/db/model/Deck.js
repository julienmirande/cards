'use strict';

const Model = require('./Model');
const db = require('../client');


class Deck extends Model {

  static getAll() {
    return db.getClient().query('select * from DECK');
  }

  static getById(id) {
    return db
      .getClient()
      .query('select * from DECK where NUMERO_DECK=$1', [id])
      .then(a => a[0]);
  }

  static deleteById(id) {
    return db
      .getClient()
      .query('delete from DECK where NUMERO_DECK=$1 RETURNING *', [id])
      .then(result => result.length === 0 ? null : result);
  }

  static insert(body) {
    return db
      .getClient()
      .query('insert into DECK(NOM_DECK) values ($1) returning *',
        [body.nom_deck])
      .then(a => a[0]);
  }

  static async updateById(id, newDeck) {

    const curDeck = await this.getById(id);
    const finalDeck = {...curDeck, ...newDeck};

    return await db
      .getClient()
      .query('update DECK set NOM_DECK=$1 where NUMERO_DECK=$2 returning *', [finalDeck.nom_deck, id])
      .then(a => a[0]);
  }

}

module.exports = Deck;
