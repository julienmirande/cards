<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <h2>Ajouter Deck</h2>
        </b-col>
        <b-col cols="2">
          <h2>Parties</h2>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="2">
          <b-form @submit.prevent="addNewPartie">
            <b-form-group id="numero-group" label="Le numero de la partie" label-for="numero">
              <b-form-input type="number" id="numero" v-model="form.numero_partie"></b-form-input>
            </b-form-group>

            <b-form-group id="pseudo-group" label="Le pseudo du joueur" label-for="pseudo">
              <b-form-input id="pseudo" v-model="form.pseudonyme"></b-form-input>
            </b-form-group>

            <b-form-group id="deck-joueur-group" label="Le deck du joueur" label-for="deck-joueur">
              <b-form-select
                id="deck-joueur"
                v-model="form.deck_joueur"
                :options="decks.map(d => d.nom_deck)"
              ></b-form-select>
            </b-form-group>

            <b-form-group id="advers-group" label="Le pseudo du adversaire" label-for="advers">
              <b-form-input id="advers" v-model="form.adversaire"></b-form-input>
            </b-form-group>

            <b-form-group id="deck-advs-group" label="Le deck du adversaire" label-for="deck-advs">
              <b-form-select
                id="deck-advs"
                v-model="form.deck_adversaire"
                :options="decks.map(d => d.nom_deck)"
              ></b-form-select>
            </b-form-group>

            <b-form-group id="lieu-group" label="Le lieu de la partie" label-for="lieu">
              <b-form-input id="lieu" v-model="form.lieu"></b-form-input>
            </b-form-group>

            <b-form-group id="date-group" label="La date de la partie" label-for="date">
              <b-form-input id="date" type="date" v-model="form.date"></b-form-input>
            </b-form-group>

            <b-form-group id="type-group" label="Le type de la partie" label-for="type">
              <b-form-input id="type" v-model="form.type"></b-form-input>
            </b-form-group>

            <b-form-group id="winner-group" label="Le gagnant de la partie">
              <b-form-radio-group
                buttons
                button-variant="outline-primary"
                v-model="form.gagnant"
                :options="options"
              ></b-form-radio-group>
            </b-form-group>

            <b-button type="submit" variant="primary">
              <font-awesome-icon icon="plus" />
            </b-button>
          </b-form>
        </b-col>

        <b-col>
          <b-pagination
            pills
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="parties-table"
          ></b-pagination>
          <b-table
            striped
            hover
            id="parties-table"
            :items="parties"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
          >
            <template v-slot:cell(date_partie)="data">
              <span>{{ data.value | moment("DD/MM/YYYY") }}</span>
            </template>

            <template v-slot:cell(resultat)="data">
              <span v-if="data.value">
                <font-awesome-icon icon="trophy" style="color: #FFD700;" />
              </span>
              <span v-else>
                <font-awesome-icon icon="trophy" style="color: #C0C0C0;" />
              </span>
            </template>

            <template v-slot:cell(lieu_partie)="data">
              <span>
                <a
                  :href="`http://maps.google.com/maps?q=${data.value}`"
                  target="_blank"
                >{{ data.value }}</a>
              </span>
            </template>

            <template v-slot:cell(options)="row">
              <b-button
                size="sm"
                @click="fillUpdateForm(row.item.id_partie)"
                class="mr-2"
                variant="info"
                v-b-modal.modal-1
              >
                <font-awesome-icon icon="pencil-alt" />
              </b-button>

              <b-button
                size="sm"
                @click="deletePartie(row.item.id_partie)"
                class="mr-2"
                variant="danger"
              >
                <font-awesome-icon icon="trash" />
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
    <b-modal id="modal-1" title="Mettre a jour Partie" @ok="updatePartie">
      <b-form>
        <b-form-group id="numero-group" label="Le numero de la partie" label-for="numero">
          <b-form-input type="number" id="numero" v-model="form_modal.numero_partie"></b-form-input>
        </b-form-group>

        <b-form-group id="deck-joueur-group" label="Le deck du joueur" label-for="deck-joueur">
          <b-form-select
            id="deck-joueur"
            v-model="form_modal.numero_deck"
            :options="decks.map(d => d.nom_deck)"
          ></b-form-select>
        </b-form-group>

        <b-form-group id="advers-group" label="Le pseudo du adversaire" label-for="advers">
          <b-form-input id="advers" v-model="form_modal.pseudonyme_adversaire"></b-form-input>
        </b-form-group>

        <b-form-group id="lieu-group" label="Le lieu de la partie" label-for="lieu">
          <b-form-input id="lieu" v-model="form_modal.lieu_partie"></b-form-input>
        </b-form-group>

        <b-form-group id="date-group" label="La date de la partie" label-for="date">
          <b-form-input id="date" type="date" v-model="form_modal.date_partie"></b-form-input>
        </b-form-group>

        <b-form-group id="type-group" label="Le type de la partie" label-for="type">
          <b-form-input id="type" v-model="form_modal.type_tournoi"></b-form-input>
        </b-form-group>

        <b-form-group id="winner-group" label="Le gagnant de la partie">
          <b-form-radio-group
            buttons
            button-variant="outline-primary"
            v-model="form_modal.gagnant"
            :options="options"
          ></b-form-radio-group>
        </b-form-group>

        <b-button type="submit" variant="primary">
          <font-awesome-icon icon="plus" />
        </b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable no-console */

import axios from "axios";

export default {
  data() {
    return {
      fields: [
        "partie",
        "joueur",
        "adversaire",
        "lieu_partie",
        "date_partie",
        "type_tournoi",
        "deck",
        "resultat",
        "options"
      ],
      perPage: 11,
      currentPage: 1,
      parties: [],
      selected: null,
      options: ["Joueur", "Adversaire"],
      decks: [],
      form: {
        numero_partie: null,
        pseudonyme: null,
        adversaire: null,
        deck_joueur: null,
        deck_adversaire: null,
        lieu: null,
        date: null,
        type: null,
        gagnant: "Joueur"
      },
      form_modal: {
        numero_partie: null,
        lieu_partie: null,
        date_partie: null,
        type_tournoi: null,
        pseudonyme_adversaire: null,
        resultat: null,
        numero_deck: null
      },
      toUpdate: null
    };
  },
  methods: {
    getAllParties: async function() {
      const res = await axios.get("http://localhost:3000/partie/named");

      try {
        this.parties = res.data;

        for (let partie of this.parties) {
          partie.adversaire = partie.pseudonyme_adversaire;
          partie.partie = partie.numero_partie;
        }
      } catch (err) {
        console.error(err);
      }
    },

    addNewPartie: function() {
      this.form.deck_joueur = this._getId(this.form.deck_joueur);
      this.form.deck_adversaire = this._getId(this.form.deck_adversaire);
      this.form.gagnant = this.form.gagnant === this.options[0];

      axios
        .post("http://localhost:3000/partie/double", this.form)
        .then(this.getAllParties)
        .catch(console.error);
    },

    getAllDecks: function() {
      axios
        .get("http://localhost:3000/deck")
        .then(res => (this.decks = res.data))
        .catch(console.error);
    },

    fillUpdateForm: function(id) {
      axios
        .get(`http://localhost:3000/partie/${id}`)
        .then(res => {
          this.form_modal = res.data;
          this.form_modal.numero_deck = this._getName(res.data.numero_deck);
          this.form_modal.date_partie = res.data.date_partie.split("T")[0];
          this.form_modal.gagnant = res.data.resultat ? this.options[0] : this.options[1];
          this.toUpdate = id;
        })
        .catch(console.error);
    },

    updatePartie: function() {
      const form = this.form_modal;
      form.numero_deck = this._getId(form.numero_deck);
      form.resultat = this.form_modal.gagnant === this.options[0];

      axios
        .put(`http://localhost:3000/partie/${this.toUpdate}`, form)
        .then(this.getAllParties)
        .catch(console.error);
    },

    deletePartie: function(id) {
      axios
        .delete(`http://localhost:3000/partie/${id}`)
        .then(this.getAllParties)
        .catch(console.error);
    },

    _getId: function(name) {
      return this.decks.filter(deck => deck.nom_deck === name)[0].numero_deck;
    },
    _getName: function(id) {
      return this.decks.filter(deck => deck.numero_deck === id)[0].nom_deck;
    }
  },
  computed: {
    rows() {
      return this.parties.length;
    }
  },
  created: function() {
    this.getAllParties();
    this.getAllDecks();
  }
};
</script>
