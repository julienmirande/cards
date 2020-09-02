<template>
  <div>
    <b-container>
      <h2>Jouers avec nombre de cartes</h2>
      <b-pagination
        pills
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="joueurs-avec-cartes-table"
      ></b-pagination>
      <b-table
        striped
        hover
        id="joueurs-avec-cartes-table"
        :items="joueursAvecCartes"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
      ></b-table>

      <h2>Jouers avec valeur de cartes</h2>
      <b-pagination
        pills
        v-model="currentPageValeur"
        :total-rows="rowsValeur"
        :per-page="perPage"
        aria-controls="joueurs-avec-cartes-table"
      ></b-pagination>
      <b-table
        striped
        hover
        id="joueurs-avec-cartes-table"
        :items="joueursAvecValeur"
        :fields="fieldsValeur"
        :per-page="perPage"
        :current-page="currentPageValeur"
      ></b-table>

      <h2>Cartes utilisées par les joueurs</h2>
      <b-pagination
        pills
        v-model="currentPageCards"
        :total-rows="rowsCards"
        :per-page="perPage"
        aria-controls="joueurs-avec-cartes-table"
      ></b-pagination>
      <b-table
        striped
        hover
        id="joueurs-avec-cartes-table"
        :items="cartesAvecJoueurs"
        :fields="fieldsCards"
        :per-page="perPage"
        :current-page="currentPageCards"
      ></b-table>
      <h2>Top 3 des joueurs avec les cartes rares</h2>
      <b-pagination
        pills
        v-model="currentPageRare"
        :total-rows="rowsRare"
        :per-page="perPage"
        aria-controls="joueurs-avec-cartes-table"
      ></b-pagination>
      <b-table
        striped
        hover
        id="joueurs-avec-cartes-table"
        :items="joueursAvecCartesRares"
        :fields="fieldsRare"
        :per-page="perPage"
        :current-page="currentPageRare"
      ></b-table>
      <h2>Familles de cartes avec niveau max</h2>
      <b-pagination
        pills
        v-model="currentPageFamily"
        :total-rows="rowsFamily"
        :per-page="perPage"
        aria-controls="joueurs-avec-cartes-table"
      ></b-pagination>
      <b-table
        striped
        hover
        id="joueurs-avec-cartes-table"
        :items="familleCartes"
        :fields="fieldsFamily"
        :per-page="perPage"
        :current-page="currentPageFamily"
      ></b-table>
    </b-container>
  </div>
</template>

<script>
/* eslint-disable no-console */
import axios from "axios";

export default {
  data() {
    return {
      fields: ["nom_joueur", "prenom_joueur", "pseudonyme", "nombre_de_cartes"],
      fieldsValeur: ["nom_joueur", "prenom_joueur", "pseudonyme", "valeur"],
      fieldsCards: ["titre_carte", "type_carte", "famille_carte", "nombre_de_joueurs"],
      fieldsRare: ["nom_joueur", "prenom_joueur", "pseudonyme", "nombre_de_cartes_rares"],
      fieldsFamily: ["famille_carte", "nom_caracteristique", "valeur_maximale"],
      perPage: 5,
      currentPage: 1,
      currentPageValeur: 1,
      currentPageCards: 1,
      currentPageRare: 1,
      currentPageFamily: 1,
      joueursAvecCartes: [],
      joueursAvecValeur: [],
      cartesAvecJoueurs: [],
      joueursAvecCartesRares: [],
      familleCartes: []
    };
  },
  methods: {
    getAllJoueursWithCarteCount: function() {
      axios
        .get("http://localhost:3000/stat/joueur")
        .then(res => (this.joueursAvecCartes = res.data))
        .catch(console.error);
    },

    getAllJoueursWithValeurs: function() {
      axios
        .get("http://localhost:3000/stat/valeurJoueur")
        .then(res => (this.joueursAvecValeur = res.data))
        .catch(console.error);
    },
    getAllCardsWithPlayers: function() {
      axios
        .get("http://localhost:3000/stat/carteJoueur")
        .then(res => (this.cartesAvecJoueurs = res.data))
        .catch(console.error);
    },
    getAllPlayersWithRareCards: function() {
      axios
        .get("http://localhost:3000/stat/joueursCartesRares")
        .then(res => (this.joueursAvecCartesRares = res.data))
        .catch(console.error);
    },
    getFamilyCards: function() {
      axios
        .get("http://localhost:3000/stat/familleCartes")
        .then(res => (this.familleCartes = res.data))
        .catch(console.error);
    }
  },

  computed: {
    rows() {
      return this.joueursAvecCartes.length;
    },
    rowsValeur() {
      return this.joueursAvecValeur.length;
    },
    rowsCards() {
      return this.cartesAvecJoueurs.length;
    },
    rowsRare() {
      return this.joueursAvecCartesRares.length;
    },
    rowsFamily() {
      return this.familleCartes.length;
    }
  },

  created: function() {
    this.getAllJoueursWithCarteCount();
    this.getAllJoueursWithValeurs();
    this.getAllCardsWithPlayers();
    this.getAllPlayersWithRareCards();
    this.getFamilyCards();
  }
};
</script>
