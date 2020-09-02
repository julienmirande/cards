create table if not exists CARTE (
  NUMERO_CARTE serial primary key,
  DESCRIPTION_CARTE text,
  TYPE_CARTE text,
  TITRE_CARTE text,
  FAMILLE_CARTE text
);

create table if not exists CARACTERISTIQUE (
  NUMERO_CARACTERISTIQUE serial primary key,
  NOM_CARACTERISTIQUE text
);

create table if not exists CARACTERISE_PAR (
  NUMERO_CARTE serial references CARTE(NUMERO_CARTE) not null,
  NUMERO_CARACTERISTIQUE serial references CARACTERISTIQUE(NUMERO_CARACTERISTIQUE) not null,
  NIVEAU integer not null CHECK(NIVEAU >= 0),
  primary key(NUMERO_CARTE, NUMERO_CARACTERISTIQUE)
);

create table if not exists JOUEUR (
  NUMERO_JOUEUR serial primary key,
  NOM_JOUEUR text,
  PRENOM_JOUEUR text,
  PSEUDONYME text unique not null 
);

create table if not exists DECK (
  NUMERO_DECK serial primary key,
  NOM_DECK text not null
);

create table if not exists COMPOSITION_DECK (
  NUMERO_CARTE serial references CARTE(NUMERO_CARTE),
  NUMERO_DECK serial references DECK(NUMERO_DECK),
  primary key(NUMERO_CARTE, NUMERO_DECK)
);

create table if not exists POSSEDE_PAR (
  NUMERO_JOUEUR serial references JOUEUR(NUMERO_JOUEUR),
  NUMERO_DECK serial references DECK(NUMERO_DECK),
  primary key(NUMERO_JOUEUR, NUMERO_DECK)
);

create table if not exists PARTIE (
  ID_PARTIE serial primary key,
  NUMERO_PARTIE integer,
  LIEU_PARTIE text,
  DATE_PARTIE timestamp,
  TYPE_TOURNOI text,
  PSEUDONYME_ADVERSAIRE text, --references JOUEUR(),
  RESULTAT boolean,
  NUMERO_JOUEUR serial references JOUEUR(NUMERO_JOUEUR) not null,
  NUMERO_DECK serial references DECK(NUMERO_DECK) not null
);

create table if not exists EXEMPLAIRE (
  NUMERO_EXEMPLAIRE serial primary key,
  VERSION integer not null,
  DATE_IMPRESSION timestamp,
  TIRAGE integer CHECK(TIRAGE > 0)
);

create table if not exists CARTE_EXISTE_EN_EXEMPLAIRE (
  COTE numeric,
  RENDU text,
  NUMERO_EXEMPLAIRE serial references EXEMPLAIRE(NUMERO_EXEMPLAIRE) not null,
  NUMERO_CARTE serial references CARTE(NUMERO_CARTE) not null,
  primary key(NUMERO_EXEMPLAIRE, NUMERO_CARTE)
);


DROP TYPE IF EXISTS MODE_PROPRIETE CASCADE;
create type MODE_PROPRIETE as enum ('ACHAT_NEUF', 'OCCASION', 'TOURNOI');
create table if not exists PROPRIETE (
  NUMERO_PROPRIETE serial primary key,
  ETAT_PROPRIETE numeric CHECK(ETAT_PROPRIETE >= 0 and ETAT_PROPRIETE <= 100),
  DATE_ACQUISITION timestamp,
  MODE_ACQUISITION MODE_PROPRIETE, -- peut-être on peut utiliser un ENUM
  PRIX_ACQUISITION numeric,
  DATE_PERTE timestamp,
  MODE_PERTE MODE_PROPRIETE, -- peut-être on peut utiliser un ENUM
  PRIX_VENTE numeric,
  NUMERO_JOUEUR serial references JOUEUR(NUMERO_JOUEUR) not null,
  NUMERO_EXEMPLAIRE serial references EXEMPLAIRE(NUMERO_EXEMPLAIRE) not null,
  NUMERO_CARTE serial references CARTE(NUMERO_CARTE) not null
);
