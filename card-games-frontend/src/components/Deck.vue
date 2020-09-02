<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <h2>Ajouter Deck</h2>
        </b-col>
        <b-col cols="1">
          <h2>Deck</h2>
        </b-col>
        <b-col cols="2">
          <b-row>
            <b-col cols="8">
              <b-form-select
                v-model="currentDeckId"
                v-on:change="loadDeckCards"
                :options="deckOptions"
              ></b-form-select>
            </b-col>
            <b-col cols="2">
              <b-button v-b-modal.modal-update pill variant="outline-info" class="float-right">
                <font-awesome-icon icon="pencil-alt" />
              </b-button>
              <b-modal id="modal-update" title="Éditer ce deck" @show="fillUpdateForm" @ok="updateDeck">
                <b-form>
                  <b-form-group id="nom-group" label="Le nom du deck" label-for="nom">
                    <b-form-input id="nom" v-model="updateForm.nom_deck"></b-form-input>
                  </b-form-group>
                </b-form>
              </b-modal>
            </b-col>
            <b-col cols="2">
              <b-button
                @click="deleteDeck(currentDeckId)"
                pill
                variant="outline-danger"
                class="float-right"
              >
                <font-awesome-icon icon="trash" />
              </b-button>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="4">
          <b-button class="mr-1" v-b-modal.modal-obtain variant="primary">Obtenir ce deck</b-button>
          <b-modal
            id="modal-obtain"
            title="Obtenir ce deck"
            @show="loadModalPlayers"
            @ok="addDeckToPlayer"
          >
            <p>Quel joueur souhaite obtenir ce deck ?</p>
            <b-form-select v-model="modalSelectedPlayer" :options="playerOptions"></b-form-select>
          </b-modal>
          <b-button v-b-modal.modal-remove variant="danger">Se défaire de ce deck</b-button>
          <b-modal
            id="modal-remove"
            title="Se défaire de ce deck"
            @show="loadModalPlayers"
            @ok="removeDeckFromPlayer"
          >
            <p>Quel joueur souhaite se défaire de ce deck ?</p>
            <b-form-select v-model="modalSelectedPlayer" :options="playerOptions"></b-form-select>
          </b-modal>
        </b-col>
        <b-col cols="1"></b-col>
        <b-col cols="2">
          <b-button @click="addCards(currentDeckId)" variant="success">Ajouter cartes</b-button>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col cols="2">
          <b-form @submit.prevent="addDeck">
            <b-form-group id="nom-group" label="Le nom du deck" label-for="nom">
              <b-form-input id="nom" v-model="form.nom_deck"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">
              <font-awesome-icon icon="plus" />
            </b-button>
          </b-form>
          <br />
          <b-alert
            :variant="alertVariant"
            :show="alertShow"
            @dismissed="alertShow=false"
            dismissible
          >{{ alertMsg }}</b-alert>
          <br />
          <p>Decks possédés par chaque joueur :</p>
          <b-form-select v-model="selectedPlayer" :options="playerOptions" @change="loadPlayerDecks"></b-form-select>
          <br />
          <br />
          <b-list-group>
            <b-list-group-item variant="dark" v-for="deck in playerDecks" v-bind:key="deck.numero_deck">{{deck.nom_deck}}</b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col cols="8">
          <b-card-group columns>
            <b-card
              img-width="20rem;"
              img-height="360rem;"
              v-bind:img-src="card.image_carte"
              v-for="card in deckCards"
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
                  @click="deleteCard(card.numero_carte)"
                  pill
                  variant="outline-danger"
                  class="float-right"
                >
                  <font-awesome-icon icon="trash" />
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
      form: {
        nom_deck: null
      },
      updateForm: {
        nom_deck: null
      },
      decks: [],
      deckOptions: [],
      currentDeckId: null,
      deckCards: [],
      playerOptions: [],
      selectedPlayer: null,
      playerDecks: [],
      modalSelectedPlayer: null,
      alertVariant: null,
      alertMsg: null,
      alertShow: false
    };
  },
  methods: {
    addDeck: function() {
      axios
        .post("http://localhost:3000/deck", this.form)
        .then(() => {
          this.loadDecks();
          this.alertMsg = "Deck created !";
          this.alertShow = true;
          this.alertVariant = "success";
        })
        .catch(err => {
          console.error(err);
          this.alertMsg = "Failed creating deck title is mandatory and unique";
          this.alertShow = true;
          this.alertVariant = "danger";
        });
    },
    loadDecks: function() {
      axios
        .get("http://localhost:3000/deck")
        .then(res => {
          this.decks = res.data;
          this.deckOptions = this.decks.map(d => {
            return { value: d.numero_deck, text: d.nom_deck };
          });
          if (this.currentDeckId === null) {
            this.currentDeckId = this.decks[0].numero_deck;
            this.loadDeckCards();
          }
        })
        .catch(console.error);
    },
    loadDeckCards: function() {
      axios
        .get(`http://localhost:3000/deck/${this.currentDeckId}/carte`)
        .then(res => (this.deckCards = res.data.cartes))
        .catch(err => {
          if (err.response && err.response.status === 404) {
            this.deckCards = [];
          }
        });
    },
    deleteDeck: function(id) {
      axios
        .delete(`http://localhost:3000/deck/${id}`)
        .then(() => {
          this.currentDeckId = null;
          this.loadDecks();
        })
        .catch(err => {
          console.error(err);
          this.alertMsg = "Failed deleting deck. Cards still in the deck";
          this.alertShow = true;
          this.alertVariant = "danger";
        });
    },
    updateDeck: function() {
      axios
        .put(`http://localhost:3000/deck/${this.currentDeckId}`, this.updateForm)
        .then(() => {
          this.loadDecks();
        })
        .catch(console.error);
    },
    fillUpdateForm: function() {
      let deck = this.decks.find(d => d.numero_deck === this.currentDeckId);
      this.updateForm.nom_deck = deck.nom_deck;
    },
    addCards: function(id) {
      this.$router.push(`/ajoutCartesDeck/${id}`);
    },
    deleteCard: function(id) {
      axios
        .delete(`http://localhost:3000/deck/link/${this.currentDeckId}/${id}`)
        .then(() => this.loadDeckCards())
        .catch(console.error);
    },
    loadModalPlayers: function() {
      axios
        .get("http://localhost:3000/joueur")
        .then(res => {
          this.playerOptions = res.data.map(p => {
            return { value: p.numero_joueur, text: p.pseudonyme };
          });
          this.modalSelectedPlayer = res.data[0].numero_joueur;
        })
        .catch(console.error);
    },
    loadPlayers: function() {
      axios
        .get("http://localhost:3000/joueur")
        .then(res => {
          this.playerOptions = res.data.map(p => {
            return { value: p.numero_joueur, text: p.pseudonyme };
          });
          this.selectedPlayer = res.data[0].numero_joueur;
          this.loadPlayerDecks();
        })
        .catch(console.error);
    },
    loadPlayerDecks: function() {
      axios
        .get(`http://localhost:3000/joueur/link/${this.selectedPlayer}`)
        .then(res => this.playerDecks = res.data)
        .catch(console.error);
    },
    addDeckToPlayer: function() {
      axios
        .post(
          `http://localhost:3000/joueur/link/${this.modalSelectedPlayer}/${this.currentDeckId}`
        )
        .then(() => {
          let player = this.playerOptions.find(
            p => p.value === this.modalSelectedPlayer
          );
          this.alertMsg = `Deck obtained by ${player.text} !`;
          this.alertShow = true;
          this.alertVariant = "success";
        })
        .catch(err => {
          console.error(err);
          this.alertMsg =
            "Failed obtaining deck. The selected player already has it.";
          this.alertShow = true;
          this.alertVariant = "danger";
        });
    },
    removeDeckFromPlayer: function() {
      axios
        .delete(
          `http://localhost:3000/joueur/link/${this.modalSelectedPlayer}/${this.currentDeckId}`
        )
        .then(() => {
          let player = this.playerOptions.find(
            p => p.value === this.modalSelectedPlayer
          );
          this.alertMsg = `Deck is no longer property of ${player.text} !`;
          this.alertShow = true;
          this.alertVariant = "success";
        })
        .catch(err => {
          console.error(err);
          this.alertMsg =
            "Failed removing deck. The selected player does not have it.";
          this.alertShow = true;
          this.alertVariant = "danger";
        });
    }
  },

  created: function() {
    this.loadDecks();
    this.loadPlayers();
  }
};
</script>