'use strict';

const Model = require('./Model');
const db = require('../client');

class Partie extends Model {

  static getAll() {
    return db.getClient().query('select * from PARTIE');
  }

  static getById(id) {
    return db
      .getClient()
      .query('select * from PARTIE where ID_PARTIE=$1', [id])
      .then(a => a[0]);
  }

  static deleteById(id) {
    return db
      .getClient()
      .query('delete from PARTIE where ID_PARTIE=$1 RETURNING *', [id])
      .then(result => result.length === 0 ? null : result);
  }

  static async updateById(id, newPartie) {
    const curPartie = await this.getById(id);
    const finalPartie = { ...curPartie, ...newPartie };

    return await db
      .getClient()
      .query('update PARTIE set NUMERO_PARTIE=$1, LIEU_PARTIE=$2, DATE_PARTIE=$3, TYPE_TOURNOI=$4,'
        + 'PSEUDONYME_ADVERSAIRE=$5, RESULTAT=$6, NUMERO_JOUEUR=$7, NUMERO_DECK=$8'
        + ' where ID_PARTIE=$9 returning *',
      [finalPartie.numero_partie, finalPartie.lieu_partie, finalPartie.date_partie, finalPartie.type_tournoi,
        finalPartie.pseudonyme_adversaire, finalPartie.resultat, finalPartie.numero_joueur, finalPartie.numero_deck, id])
      .then(a => a[0]);
  }

  static insert(body) {
    return db
      .getClient()
      .query('insert into PARTIE(NUMERO_PARTIE, LIEU_PARTIE, DATE_PARTIE, TYPE_TOURNOI, PSEUDONYME_ADVERSAIRE, RESULTAT,'
        + ' NUMERO_JOUEUR, NUMERO_DECK) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *',
      [body.numero_partie, body.lieu_partie, body.date_partie, body.type_tournoi, body.pseudonyme_adversaire, body.resultat,
        body.numero_joueur, body.numero_deck])
      .then(a => a[0]);
  }

  static getAllWithNames() {
    return db
      .getClient()
      .query(`select PARTIE.*, PSEUDONYME as JOUEUR, NOM_DECK as deck
              from PARTIE inner join JOUEUR on PARTIE.NUMERO_JOUEUR = JOUEUR.NUMERO_JOUEUR
              inner join DECK on PARTIE.NUMERO_DECK = DECK.NUMERO_DECK
              order by PARTIE.NUMERO_PARTIE asc, resultat desc`);
  }
  static insertDouble(body) {

    const query1 = `
    insert into PARTIE(NUMERO_PARTIE, LIEU_PARTIE, DATE_PARTIE, TYPE_TOURNOI, PSEUDONYME_ADVERSAIRE, RESULTAT, NUMERO_JOUEUR, NUMERO_DECK)
    values ($1, $2, $3, $4, $5, $6, (select NUMERO_JOUEUR from JOUEUR where PSEUDONYME=$7), $8)`;

    const params1 = [body.numero_partie, body.lieu, body.date, body.type, body.adversaire, body.gagnant, body.pseudonyme, body.deck_joueur];

    const query2 = `
    insert into PARTIE(NUMERO_PARTIE, LIEU_PARTIE, DATE_PARTIE, TYPE_TOURNOI, PSEUDONYME_ADVERSAIRE, RESULTAT, NUMERO_JOUEUR, NUMERO_DECK)
    select $1, $2, $3, $4, $5, $6, (select NUMERO_JOUEUR from JOUEUR where PSEUDONYME=$7), $8
    where exists (select 1 from JOUEUR where PSEUDONYME=$7)`;

    const params2 = [body.numero_partie, body.lieu, body.date, body.type, body.pseudonyme, !body.gagnant, body.adversaire, body.deck_adversaire];

    return db
      .getClient()
      .tx('partie-transaction', t => {
        return t.batch([t.none(query1, params1), t.none(query2, params2)]);
      });
  }

}

module.exports = Partie;
