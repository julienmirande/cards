'use strict';

const Model = require('./Model');
const db = require('../client');

class Joueur extends Model {

  static getAll() {
    return db.getClient().query('select * from JOUEUR order by NOM_JOUEUR, PRENOM_JOUEUR');
  }

  static getById(id) {
    return db
      .getClient()
      .query('select * from JOUEUR where NUMERO_JOUEUR=$1', [id])
      .then(a => a[0]);
  }

  static deleteById(id) {
    return db
      .getClient()
      .query('delete from JOUEUR where NUMERO_JOUEUR=$1 RETURNING *', [id])
      .then(result => result.length === 0 ? null : result);
  }

  static async updateById(id, newJoueur) {
    const curJoueur = await this.getById(id);
    const finalJoueur = {...curJoueur, ...newJoueur};

    return await db
      .getClient()
      .query('update JOUEUR set NOM_JOUEUR=$1, PRENOM_JOUEUR=$2, PSEUDONYME=$3 where NUMERO_JOUEUR=$4 returning *',
        [finalJoueur.nom_joueur, finalJoueur.prenom_joueur, finalJoueur.pseudonyme, id ])
      .then(a => a[0]);
  }

  static insert(body) {
    return db
      .getClient()
      .query('insert into JOUEUR(NOM_JOUEUR, PRENOM_JOUEUR, PSEUDONYME) values($1, $2, $3) returning *', [body.nom_joueur, body.prenom_joueur, body.pseudonyme])
      .then(a => a[0]);
  }

  static getCollectionneurs(filtre) {
    let query = 'select * from collectionneurs';
    if(filtre) {
      query += ` where pseudonyme like '%${filtre}%'`;
    }
    return db
      .getClient()
      .query(query);
  }
}

module.exports = Joueur;
