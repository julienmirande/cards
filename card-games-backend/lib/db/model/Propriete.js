'use strict';

const Model = require('./Model');
const db = require('../client');

class Propriete extends Model {

  static getAll() {
    return db.getClient().query('select * from PROPRIETE');
  }

  static getById(id) {
    return db
      .getClient()
      .query('select * from PROPRIETE where NUMERO_PROPRIETE=$1', [id])
      .then(a => a[0]);
  }

  static deleteById(id) {
    return db
      .getClient()
      .query('delete from PROPRIETE where NUMERO_PROPRIETE=$1 RETURNING *', [id])
      .then(result => result.length === 0 ? null : result);
  }

  static async updateById(id, newPropriete) {
    const curPropriete = await this.getById(id);
    const finalPropriete = { ...curPropriete, ...newPropriete };

    return await db
      .getClient()
      .query(
        'update PROPRIETE set ETAT_PROPRIETE=$1, DATE_ACQUISITION=$2, MODE_ACQUISITION=$3, PRIX_ACQUISITION=$4, DATE_PERTE=$5,' +
        'MODE_PERTE=$6, PRIX_VENTE=$7, NUMERO_JOUEUR=$8, NUMERO_EXEMPLAIRE=$9' +
        ' where NUMERO_PROPRIETE=$10 returning *',
        [finalPropriete.etat_propriete, finalPropriete.date_acquisition, finalPropriete.mode_acquisition,
          finalPropriete.prix_acquisition, finalPropriete.date_perte, finalPropriete.mode_perte, finalPropriete.prix_vente,
          finalPropriete.numero_joueur, finalPropriete.numero_exemplaire, id])
      .then(a => a[0]);
  }

  static insert(body) {
    return db
      .getClient()
      .query(
        'insert into PROPRIETE(ETAT_PROPRIETE, DATE_ACQUISITION, MODE_ACQUISITION, PRIX_ACQUISITION, DATE_PERTE, ' +
        'MODE_PERTE, PRIX_VENTE, NUMERO_JOUEUR, NUMERO_EXEMPLAIRE) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *',
        [body.etat_propriete, body.date_acquisition, body.mode_acquisition, body.prix_acquisition, body.date_perte, body.mode_perte,
          body.prix_vente, body.numero_joueur, body.numero_exemplaire])
      .then(a => a[0]);
  }

  static getAllComplete() {
    return db
      .getClient()
      .query(`SELECT propriete.*, joueur.pseudonyme as joueur, carte.titre_carte as carte
              FROM propriete
                  INNER JOIN exemplaire
                          ON propriete.numero_exemplaire = exemplaire.numero_exemplaire
                  INNER JOIN joueur
                          on propriete.numero_joueur = joueur.numero_joueur
                  INNER JOIN carte
                          on exemplaire.numero_carte = carte.numero_carte
                  ORDER BY joueur.pseudonyme, propriete.etat_propriete DESC`);
  }

  static insertByName(body) {
    return db
      .getClient()
      .query(`
        insert into PROPRIETE(ETAT_PROPRIETE, DATE_ACQUISITION, MODE_ACQUISITION, PRIX_ACQUISITION, DATE_PERTE, 
        MODE_PERTE, PRIX_VENTE, NUMERO_JOUEUR, NUMERO_EXEMPLAIRE) 
        values ($1, $2, $3, $4, $5, $6, $7, (select NUMERO_JOUEUR from JOUEUR where pseudonyme=$8), $9) returning *`,
      [body.etat, body.date_acquisition, body.mode_acquisition, body.prix_acquisition, body.date_perte,
        body.mode_perte, body.prix_vente, body.pseudonyme, body.numero_exemplaire]);

  }

}


module.exports = Propriete;
