<template>
  <div class="overflow-auto">
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <h2>Ajouter Joueur</h2>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="2">
          <br />
          <br />
          <b-form @submit.prevent="addJoueur">
            <b-form-group id="nom-group-1" label="Le nom du joueur" label-for="nom-1">
              <b-form-input id="nom-1" v-model="form.nom_joueur"></b-form-input>
            </b-form-group>
            <b-form-group id="prenom-group-1" label="Le prenom du joueur" label-for="prenom-1">
              <b-form-input id="prenom-1" v-model="form.prenom_joueur"></b-form-input>
            </b-form-group>
            <b-form-group id="pseu-gp-1" label="Le pseudonyme du joueur" label-for="pseudonyme-1">
              <b-form-input id="pseudonyme-1" v-model="form.pseudonyme"></b-form-input>
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
        </b-col>
        <b-col cols="8">
          <b-tabs content-class="mt-3">
            <b-tab title="Tous Joueurs" active>
              <b-pagination
                pills
                v-model="currentPage"
                :total-rows="rowsAll"
                :per-page="perPage"
                aria-controls="my-table"
              ></b-pagination>
              <b-table
                striped
                hover
                responsive="sm"
                id="my-table"
                :items="allJoueurs"
                :fields="fields"
                :per-page="perPage"
                :current-page="currentPage"
              >
                <template v-slot:cell(options)="row">
                  <b-button
                    size="sm"
                    @click="fillUpdateForm(row.item.numero_joueur)"
                    class="mr-2"
                    variant="info"
                    v-b-modal.modal-1
                  >
                    <font-awesome-icon icon="pencil-alt" />
                  </b-button>

                  <b-button
                    size="sm"
                    @click="deleteJoueur(row.item.numero_joueur)"
                    class="mr-2"
                    variant="danger"
                  >
                    <font-awesome-icon icon="trash" />
                  </b-button>
                </template>
              </b-table>
            </b-tab>
            <b-tab title="Collectionneurs" @click="getAllCollectionneurs">
              <b-row>
                <b-col>
                  <b-pagination
                    pills
                    v-model="currentPageCol"
                    :total-rows="rowsCollectionneurs"
                    :per-page="perPage"
                    aria-controls="my-table2"
                  ></b-pagination>
                </b-col>
                <b-col cols="4">
                  <b-form-input
                    placeholder="Filter by pseudonyme"
                    v-model="filtrePseudonyme"
                    @input="getAllCollectionneurs"
                  ></b-form-input>
                </b-col>
              </b-row>

              <b-table
                striped
                hover
                id="my-table2"
                :items="allCollectionneurs"
                :fields="fields.slice(0,-1)"
                :per-page="perPage"
                :current-page="currentPageCol"
              ></b-table>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
    <b-modal id="modal-1" title="Mettre a jour Joueur" @ok="updateJoueur">
      <b-form>
        <b-form-group id="nom-group" label="Le nom de Joueur" label-for="nom">
          <b-form-input id="nom" v-model="form_modal.nom_joueur"></b-form-input>
        </b-form-group>
        <b-form-group id="prenom-group" label="Le prenom de Joueur" label-for="prenom">
          <b-form-input id="prenom" v-model="form_modal.prenom_joueur"></b-form-input>
        </b-form-group>
        <b-form-group
          id="pseudonyme-group"
          label="La description de la carte"
          label-for="pseudonyme"
        >
          <b-form-input id="pseudonyme" v-model="form_modal.pseudonyme"></b-form-input>
        </b-form-group>
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
      fields: ["nom_joueur", "prenom_joueur", "pseudonyme", "options"],
      form: {
        nom_joueur: null,
        prenom_joueur: null,
        pseudonyme: null
      },
      form_modal: {
        nom_joueur: null,
        prenom_joueur: null,
        pseudonyme: null
      },
      toUpdate: null,
      perPage: 10,
      currentPage: 1,
      currentPageCol: 1,
      allJoueurs: [],
      allCollectionneurs: [],
      alertVariant: null,
      alertMsg: null,
      alertShow: false,
      filtrePseudonyme: null
    };
  },
  methods: {
    getAllJoueurs: function() {
      axios
        .get("http://localhost:3000/joueur")
        .then(res => (this.allJoueurs = res.data))
        .catch(console.error);
    },

    getAllCollectionneurs: function() {
      let url = "http://localhost:3000/joueur/collectionneurs";
      if (this.filtrePseudonyme) {
        url += `?filter=${this.filtrePseudonyme}`;
      }

      axios
        .get(url)
        .then(res => (this.allCollectionneurs = res.data))
        .catch(console.error);
    },

    fillUpdateForm: function(numJoueur) {
      axios
        .get(`http://localhost:3000/joueur/${numJoueur}`)
        .then(res => {
          this.form_modal = res.data;
          this.toUpdate = numJoueur;
        })
        .catch(console.error);
    },

    updateJoueur: function() {
      axios
        .put(`http://localhost:3000/joueur/${this.toUpdate}`, this.form_modal)
        .then(this.getAllJoueurs)
        .catch(console.error);
    },

    deleteJoueur: function(numJoueur) {
      axios
        .delete(`http://localhost:3000/joueur/${numJoueur}`)
        .then(this.getAllJoueurs)
        .catch(console.error);
    },

    addJoueur: function() {
      axios
        .post(`http://localhost:3000/joueur`, this.form)
        .then(() => {
          this.alertMsg = "Joueur createded";
          this.alertShow = true;
          this.alertVariant = "success";
          this.getAllJoueurs();
          this.getAllCollectionneurs();
        })
        .catch(err => {
          this.alertMsg = "Failed to create Joueur";
          this.alertShow = true;
          this.alertVariant = "danger";
          console.error(err);
        });
    }
  },

  computed: {
    rowsAll() {
      return this.allJoueurs.length;
    },
    rowsCollectionneurs() {
      return this.allCollectionneurs.length;
    }
  },

  created: function() {
    this.getAllJoueurs();
    this.getAllCollectionneurs();
  }
};
</script>