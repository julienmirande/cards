'use strict';

const Model = require('./Model');
const db = require('../client');


class Caracteristique extends Model {

  static getAll() {
    return db.getClient().query('select * from CARACTERISTIQUE');
  }

  static getById(id) {
    return db
      .getClient()
      .query('select * from CARACTERISTIQUE where NUMERO_CARACTERISTIQUE=$1', [id])
      .then(a => a[0]);
  }

  static deleteById(id) {
    return db
      .getClient()
      .query('delete from CARACTERISTIQUE where NUMERO_CARACTERISTIQUE=$1 RETURNING *', [id])
      .then(result => result.length === 0 ? null : result);
  }

  static insert({nom_caracteristique} = {}) {
    return db
      .getClient()
      .query('insert into CARACTERISTIQUE(NOM_CARACTERISTIQUE) values ($1) returning *',[nom_caracteristique])
      .then(a => a[0]);
  }

  static updateById(id, {nom_caracteristique} = {}) {
    if(!nom_caracteristique) return Promise.resolve([]);
    return db
      .getClient()
      .query(
        'update CARACTERISTIQUE set NOM_CARACTERISTIQUE=$1 where NUMERO_CARACTERISTIQUE=$2 returning *',
        [nom_caracteristique, id])
      .then(a => a[0]);
  }
}

module.exports = Caracteristique;
