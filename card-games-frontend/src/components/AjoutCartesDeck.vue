<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <h2>{{deckName}}</h2>
        </b-col>
        <b-col cols="2">
          <h2>Ajouter cartes</h2>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col cols="2">
          <b-list-group>
            <b-list-group-item v-for="card in deckCards" v-bind:key="card.numero_carte">{{card.titre_carte}}</b-list-group-item>
          </b-list-group>
          <br />
          <b-alert
            :variant="alertVariant"
            :show="alertShow"
            @dismissed="alertShow=false"
            dismissible
          >{{ alertMsg }}</b-alert>
        </b-col>
        <b-col cols="8">
          <b-card-group columns>
            <b-card
              img-width="20rem;"
              img-height="360rem;"
              v-bind:img-src="card.image_carte"
              v-for="card in cards"
              v-bind:key="card.numero_carte"
              v-bind:title="card.titre_carte"
              v-bind:sub-title="card.type_carte"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-card-text>{{card.description_carte}}</b-card-text>
              <template v-slot:footer>
                <em>{{card.famille_carte}}</em>
                <b-button
                  @click="addCard(card.numero_carte)"
                  pill
                  variant="outline-success"
                  class="float-right"
                >
                  <font-awesome-icon icon="plus" />
                </b-button>
              </template>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
/* eslint-disable no-console */

import axios from "axios";

export default {
  data() {
    return {
      deckName: '',
      deckCards: [],
      cards: [],
      alertVariant: null,
      alertMsg: null,
      alertShow: false
    };
  },
  methods: {
    addCard: function(id) {
      axios
        .post(`http://localhost:3000/deck/link/${this.$route.params.id}/${id}`)
        .then(() => {
          this.loadDeckCards()
          this.alertMsg = "Card added !";
          this.alertShow = true;
          this.alertVariant = "success";
          })
        .catch(err => {
          console.error(err);
          this.alertMsg = "Failed adding card. Card already in the deck.";
          this.alertShow = true;
          this.alertVariant = "danger";
          });
    },
    loadDeck: function() {
      axios
        .get(`http://localhost:3000/deck/${this.$route.params.id}`)
        .then(res => (this.deckName = res.data.nom_deck))
        .catch(console.error);
    },
    loadDeckCards: function() {
      axios
        .get(`http://localhost:3000/deck/${this.$route.params.id}/carte`)
        .then(res => (this.deckCards = res.data.cartes))
        .catch(console.error);
    },
    loadCards: function() {
        axios
          .get("http://localhost:3000/carte")
          .then(res => this.cards = res.data)
          .catch(console.error);
    }
  },

  created: function() {
    this.loadDeck();
    this.loadDeckCards();
    this.loadCards();
  }
};
</script>