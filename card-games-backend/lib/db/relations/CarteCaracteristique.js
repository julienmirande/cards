'use strict';

const db = require('../client');
const httpStatus = require('http-status-codes');

class CarteCaracteristique {

  static getCompleteCard(req, res) {
    db
      .getClient()
      .query('select * from CARTE natural join CARACTERISE_PAR natural join CARACTERISTIQUE where NUMERO_CARTE=$1', [req.params.id])
      .then(queryRes => {

        if(queryRes.length === 0)
          return res.status(httpStatus.NOT_FOUND).send({message: 'Not Found'});

        let output = null;
        queryRes.forEach(result => {
          if(!output) {
            output = {
              'numero_carte': result.numero_carte,
              'description_carte': result.description_carte,
              'type_carte': result.type_carte,
              'titre_carte': result.titre_carte,
              'famille_carte': result.famille_carte,
              'image_carte': result.image_carte,
              'caracteristiques': [{
                'numero_caracteristique': result.numero_caracteristique,
                'nom_caracteristique': result.nom_caracteristique,
                'niveau': result.niveau
              }]
            };
          } else {
            output.caracteristiques.push({
              'numero_caracteristique': result.numero_caracteristique,
              'nom_caracteristique': result.nom_caracteristique,
              'niveau': result.niveau
            });
          }
        });
        res.status(httpStatus.OK).send(output);
      });
  }

  static getAllLinks(req, res) {
    db
      .getClient()
      .query('select * from CARACTERISE_PAR')
      .then(queryRes => res.status(httpStatus.OK).send(queryRes))
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

  static getLink(req, res) {
    db
      .getClient()
      .query('select * from CARACTERISE_PAR where NUMERO_CARTE=$1 and NUMERO_CARACTERISTIQUE=$2', [req.params.carteId, req.params.caracteristiqueId])
      .then(queryRes => {

        if(queryRes.length === 0)
          return res.status(httpStatus.NOT_FOUND).send({message: 'not found'});
        res.status(httpStatus.OK).send(queryRes[0]);
      })
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

  static link(req, res) {

    const level = req.body.niveau || 1;
    const carteId = req.params.carteId;
    const caracteristiqueId = req.params.caracteristiqueId;

    db
      .getClient()
      .query(
        'insert into CARACTERISE_PAR(NUMERO_CARTE, NUMERO_CARACTERISTIQUE, NIVEAU) VALUES($1, $2, $3) returning *',
        [carteId, caracteristiqueId, level])
      .then(queryRes => res.status(httpStatus.CREATED).send(queryRes[0]))
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

  static updateLink(req, res) {

    const level = req.body.niveau || 1;
    const carteId = req.params.carteId;
    const caracteristiqueId = req.params.caracteristiqueId;

    db
      .getClient()
      .query(
        'update CARACTERISE_PAR set NIVEAU=$1 where NUMERO_CARTE=$2 and NUMERO_CARACTERISTIQUE=$3 returning *',
        [level, carteId, caracteristiqueId])
      .then(queryRes => res.status(httpStatus.OK).send(queryRes[0]))
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

  static unlink(req, res) {

    const carteId = req.params.carteId;
    const caracteristiqueId = req.params.caracteristiqueId;

    db
      .getClient()
      .query(
        'delete from CARACTERISE_PAR where NUMERO_CARTE=$1 and NUMERO_CARACTERISTIQUE=$2',
        [carteId, caracteristiqueId])
      .then(() => res.status(httpStatus.NO_CONTENT).send())
      .catch(err => {
        console.error(err);
        res.status(httpStatus.BAD_REQUEST).send();
      });
  }

}

module.exports = CarteCaracteristique;
