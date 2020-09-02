'use strict';

module.exports =
`
create table if not exists CARTE (
  NUMERO_CARTE serial primary key,
  DESCRIPTION_CARTE text,
  TYPE_CARTE text,
  TITRE_CARTE text not null unique,
  FAMILLE_CARTE text,
  IMAGE_CARTE text
);

create table if not exists CARACTERISTIQUE (
  NUMERO_CARACTERISTIQUE serial primary key,
  NOM_CARACTERISTIQUE text unique
);

create table if not exists CARACTERISE_PAR (
  NUMERO_CARTE integer not null references CARTE(NUMERO_CARTE) ON DELETE CASCADE,
  NUMERO_CARACTERISTIQUE integer not null references CARACTERISTIQUE(NUMERO_CARACTERISTIQUE) ON DELETE CASCADE,
  NIVEAU integer not null CONSTRAINT CHK_Niveau CHECK(NIVEAU >= 0),
  CONSTRAINT PK_Caracterise_par primary key(NUMERO_CARTE, NUMERO_CARACTERISTIQUE)
);

CREATE OR REPLACE FUNCTION rec_insert()
  RETURNS trigger AS
$$

BEGIN 
      INSERT INTO CARACTERISE_PAR(NUMERO_CARTE, NUMERO_CARACTERISTIQUE, NIVEAU)
      VALUES(NEW.numero_carte, (select NUMERO_CARACTERISTIQUE from CARACTERISTIQUE where NOM_CARACTERISTIQUE='mana'), 1);
      RETURN NEW;

END;
$$
LANGUAGE 'plpgsql';
DROP TRIGGER IF EXISTS caracteristique_basique on carte;
CREATE TRIGGER caracteristique_basique 
AFTER INSERT ON carte FOR EACH ROW
EXECUTE PROCEDURE rec_insert();

create table if not exists JOUEUR (
  NUMERO_JOUEUR serial primary key,
  NOM_JOUEUR text,
  PRENOM_JOUEUR text,
  PSEUDONYME text not null unique
);

create table if not exists DECK (
  NUMERO_DECK serial primary key,
  NOM_DECK text not null
);

create table if not exists COMPOSITION_DECK (
  NUMERO_CARTE integer not null references CARTE(NUMERO_CARTE) ON DELETE CASCADE,
  NUMERO_DECK integer not null  references DECK(NUMERO_DECK) ON DELETE CASCADE,
  CONSTRAINT PK_Composition_deck primary key(NUMERO_CARTE, NUMERO_DECK)
);

create table if not exists POSSEDE_PAR (
  NUMERO_JOUEUR integer references JOUEUR(NUMERO_JOUEUR) ON DELETE CASCADE,
  NUMERO_DECK integer references DECK(NUMERO_DECK) ON DELETE CASCADE,
  CONSTRAINT PK_Possede_par primary key(NUMERO_JOUEUR, NUMERO_DECK)
);

create table if not exists PARTIE (
  ID_PARTIE serial primary key,
  NUMERO_PARTIE integer CONSTRAINT CHK_Numero_Partie CHECK(NUMERO_PARTIE >= 0),
  LIEU_PARTIE text,
  DATE_PARTIE timestamp,
  TYPE_TOURNOI text,
  PSEUDONYME_ADVERSAIRE text, --references JOUEUR(),
  RESULTAT boolean,
  NUMERO_JOUEUR integer CONSTRAINT FK_Partie_Joueur references JOUEUR(NUMERO_JOUEUR) ON DELETE SET NULL,
  NUMERO_DECK integer CONSTRAINT FK_Partie_Deck references DECK(NUMERO_DECK)
);

CREATE OR REPLACE VIEW collectionneurs AS 
select * from JOUEUR
except
select JOUEUR.* 
from JOUEUR, POSSEDE_PAR, DECK
where JOUEUR.NUMERO_JOUEUR = POSSEDE_PAR.NUMERO_JOUEUR
and DECK.NUMERO_DECK = POSSEDE_PAR.NUMERO_DECK;

create table if not exists EXEMPLAIRE (
  NUMERO_EXEMPLAIRE serial primary key,
  VERSION integer not null CONSTRAINT CHK_Version CHECK(VERSION >= 0),
  DATE_IMPRESSION timestamp,
  TIRAGE integer CONSTRAINT CHK_Tirage CHECK(TIRAGE > 0),
  COTE integer CONSTRAINT CHK_Cote CHECK(COTE >= 0),
  RENDU text,
  NUMERO_CARTE integer not null CONSTRAINT FK_Exemplaire_Carte references CARTE(NUMERO_CARTE)
);


create table if not exists PROPRIETE (
  NUMERO_PROPRIETE serial primary key,
  ETAT_PROPRIETE numeric not null CHECK(ETAT_PROPRIETE >= 0 and ETAT_PROPRIETE <= 100),
  DATE_ACQUISITION timestamp,
  MODE_ACQUISITION text,
  PRIX_ACQUISITION numeric,
  DATE_PERTE timestamp,
  MODE_PERTE text,
  PRIX_VENTE numeric,
  NUMERO_JOUEUR integer not null CONSTRAINT FK_Propriete_Joueur references JOUEUR(NUMERO_JOUEUR) ON DELETE CASCADE,
  NUMERO_EXEMPLAIRE integer not null CONSTRAINT FK_Partie_Exemplaire references EXEMPLAIRE(NUMERO_EXEMPLAIRE)
);


ALTER TABLE PROPRIETE DROP CONSTRAINT IF EXISTS CHK_Date;
alter table PROPRIETE
ADD CONSTRAINT CHK_Date CHECK(DATE_ACQUISITION < DATE_PERTE);

ALTER TABLE DECK DROP CONSTRAINT IF EXISTS CHK_Nom_Deck;
alter table DECK
ADD CONSTRAINT CHK_Nom_Deck CHECK(char_length(NOM_DECK) > 0);

ALTER TABLE JOUEUR DROP CONSTRAINT IF EXISTS CHK_Nom_JOUEUR;
alter table JOUEUR
ADD CONSTRAINT CHK_Nom_JOUEUR CHECK(char_length(NOM_JOUEUR) > 0);
ALTER TABLE JOUEUR DROP CONSTRAINT IF EXISTS CHK_Prenom_JOUEUR;
alter table JOUEUR
ADD CONSTRAINT CHK_Prenom_JOUEUR CHECK(char_length(PRENOM_JOUEUR) > 0);
ALTER TABLE JOUEUR DROP CONSTRAINT IF EXISTS CHK_PSEUDONYME;
alter table JOUEUR
ADD CONSTRAINT CHK_Pseudonyme CHECK(char_length(PSEUDONYME) > 0);



`;
