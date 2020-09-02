'use strict';

const db = require('./client');

function joueursCartesCount() {
  return db
    .getClient()
    .query(`
            SELECT joueur.*, COUNT(exemplaire.numero_carte) as nombre_de_cartes
            FROM   joueur
                LEFT JOIN propriete
                      ON joueur.numero_joueur = propriete.numero_joueur
                LEFT JOIN exemplaire
                      ON exemplaire.numero_exemplaire = propriete.numero_exemplaire
            WHERE propriete.date_perte is null
            GROUP  BY joueur.numero_joueur
          `)
    .then(res => {
      return res.map(item => {
        item.count = parseInt(item.count, 10);
        return item;
      });
    });
}

function joueursValeur() {
  return db
    .getClient()
    .query(`
            SELECT joueur.*, SUM(exemplaire.cote * propriete.etat_propriete) AS valeur
            FROM  joueur
                LEFT JOIN propriete
                        ON joueur.numero_joueur = propriete.numero_joueur
                LEFT JOIN exemplaire
                        ON exemplaire.numero_exemplaire = propriete.numero_exemplaire
            WHERE propriete.date_perte is null
            GROUP  BY joueur.numero_joueur
            ORDER  BY valeur DESC
          `);
}


function listeCarteAvecJoueur() {
  return db
    .getClient()
    .query(`
            SELECT carte.*, COUNT(joueur.numero_joueur) AS nombre_de_joueurs
            FROM joueur
                LEFT JOIN possede_par
                        ON joueur.numero_joueur = possede_par.numero_joueur
                LEFT JOIN deck
                        ON deck.numero_deck = possede_par.numero_deck
                LEFT JOIN composition_deck
                        ON composition_deck.numero_deck = deck.numero_deck
                INNER JOIN carte
                        ON carte.numero_carte = composition_deck.numero_carte
            GROUP BY carte.numero_carte
            ORDER BY carte.numero_carte
          `);
}

function joueursCartesRares() {
  return db
    .getClient()
    .query(`
            SELECT joueur.*, COUNT(exemplaire.numero_carte) as nombre_de_cartes_rares
            FROM  joueur
                INNER JOIN propriete
                        ON joueur.numero_joueur = propriete.numero_joueur
                INNER JOIN exemplaire
                        ON exemplaire.numero_exemplaire = propriete.numero_exemplaire
            WHERE (exemplaire.tirage < 100 or exemplaire.date_impression < '2000-01-01')
                  and propriete.date_perte is null
            GROUP  BY joueur.numero_joueur
            ORDER  BY nombre_de_cartes_rares DESC
            LIMIT 3
          `);
}

function familleCartes() {
  return db
    .getClient()
    .query(`
            SELECT DISTINCT ON(carte.famille_carte) carte.famille_carte, MAX(caracterise_par.niveau) as valeur_maximale, caracteristique.nom_caracteristique
            FROM  carte
                INNER JOIN caracterise_par
                        ON caracterise_par.numero_carte = carte.numero_carte
                INNER JOIN caracteristique
                        ON caracteristique.numero_caracteristique = caracterise_par.numero_caracteristique
            GROUP  BY carte.famille_carte, caracteristique.nom_caracteristique
            ORDER  BY carte.famille_carte ASC, valeur_maximale DESC, caracteristique.nom_caracteristique ASC
          `);
}

module.exports = {
  joueursCartesCount,
  joueursValeur,
  listeCarteAvecJoueur,
  joueursCartesRares,
  familleCartes
};
