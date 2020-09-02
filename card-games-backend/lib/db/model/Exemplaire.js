'use strict';

const Model = require('./Model');
const db = require('../client');


class Exemplaire extends Model {

  static getAll() {
    return db.getClient().query('select * from EXEMPLAIRE');
  }

  static getById(id) {
    return db
      .getClient()
      .query('select * from EXEMPLAIRE where NUMERO_EXEMPLAIRE=$1', [id])
      .then(a => a[0]);
  }

  static deleteById(id) {
    return db
      .getClient()
      .query('delete from EXEMPLAIRE where NUMERO_EXEMPLAIRE=$1 RETURNING *', [id])
      .then(result => result.length === 0 ? null : result);
  }

  static insert(body) {
    return db
      .getClient()
      .query('insert into EXEMPLAIRE(VERSION, DATE_IMPRESSION, TIRAGE, COTE, RENDU, NUMERO_CARTE) values ($1, $2, $3, $4, $5, $6) returning *',
        [body.version, body.date_impression, body.tirage, body.cote, body.rendu, body.numero_carte])
      .then(a => a[0]);
  }

  static async updateById(id, newExemplaire) {

    const curExemplaire = await this.getById(id);
    const finalExemplaire = { ...curExemplaire, ...newExemplaire };

    return await db
      .getClient()
      .query('update EXEMPLAIRE set VERSION=$1, DATE_IMPRESSION=$2, TIRAGE=$3, COTE=$4, RENDU=$5, NUMERO_CARTE=$6 where NUMERO_EXEMPLAIRE=$7 returning *',
        [finalExemplaire.version, finalExemplaire.date_impression, finalExemplaire.tirage, finalExemplaire.cote, finalExemplaire.rendu, finalExemplaire.numero_carte, id])
      .then(a => a[0]);
  }

  static getExemplaireComplete() {
    return db
      .getClient()
      .query(`SELECT numero_exemplaire, titre_carte
              FROM exemplaire NATURAL JOIN carte`);
  }
}

module.exports = Exemplaire;
