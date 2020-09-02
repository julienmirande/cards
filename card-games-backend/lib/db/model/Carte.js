'use strict';

const Model = require('./Model');
const db = require('../client');


class Carte extends Model {

  static getAll(query) {
    if(query.type && query.lonely && query.lonely==='true') {
      return db
        .getClient()
        .query(`
          select * from CARTE where TYPE_CARTE=$1
          except
          select CARTE.* 
          from CARTE, COMPOSITION_DECK, DECK
          where CARTE.NUMERO_CARTE = COMPOSITION_DECK.NUMERO_CARTE
          and DECK.NUMERO_DECK = COMPOSITION_DECK.NUMERO_DECK
          and TYPE_CARTE=$1`, [query.type]);
    }

    if(query.type && (!query.lonely || query.lonely!=='true')) {
      return db.getClient().query('select * from CARTE where TYPE_CARTE=$1', [query.type]);
    }

    if(!query.type && query.lonely && query.lonely==='true') {
      return db
        .getClient()
        .query(`
          select * from CARTE
          except
          select CARTE.* 
          from CARTE, COMPOSITION_DECK, DECK
          where CARTE.NUMERO_CARTE = COMPOSITION_DECK.NUMERO_CARTE
          and DECK.NUMERO_DECK = COMPOSITION_DECK.NUMERO_DECK`);
    }

    return db.getClient().query('select * from CARTE');
  }

  static getById(id) {
    return db
      .getClient()
      .query('select * from CARTE where NUMERO_CARTE=$1', [id])
      .then(a => a[0]);
  }

  static deleteById(id) {
    return db
      .getClient()
      .query('delete from CARTE where NUMERO_CARTE=$1 RETURNING *', [id])
      .then(result => result.length === 0 ? null : result);
  }

  static insert(body) {
    return db
      .getClient()
      .query('insert into CARTE(DESCRIPTION_CARTE, TYPE_CARTE, TITRE_CARTE, FAMILLE_CARTE, IMAGE_CARTE) values ($1, $2, $3, $4, $5) returning *',
        [body.description_carte, body.type_carte, body.titre_carte, body.famille_carte, body.image_carte])
      .then(a => a[0]);
  }

  static async updateById(id, newCarte) {

    const curCarte = await this.getById(id);
    const finalCarte = {...curCarte, ...newCarte};

    return await db
      .getClient()
      .query('update CARTE set DESCRIPTION_CARTE=$1, TYPE_CARTE=$2, TITRE_CARTE=$3, FAMILLE_CARTE=$4, IMAGE_CARTE=$5 where NUMERO_CARTE=$6 returning *',
        [finalCarte.description_carte, finalCarte.type_carte, finalCarte.titre_carte, finalCarte.famille_carte, finalCarte.image_carte, id  ])
      .then(a => a[0]);
  }
}

module.exports = Carte;
