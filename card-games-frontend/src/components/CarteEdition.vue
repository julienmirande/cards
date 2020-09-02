<template>
  <b-container fluid>
    <b-row>
      <b-col cols="5">
        <h2>Carte Info</h2>
        <img v-bind:src="card.image_carte" width="120rem;" height="120rem;">
        <b-form @submit.prevent="updateCarte($route.params.id)">
          <b-form-group id="titre-group" label="Le titre de la carte" label-for="titre">
            <b-form-input id="titre" v-model="card.titre_carte" :disabled="isFormUpdating"></b-form-input>
          </b-form-group>
          <b-form-group id="type-group" label="Le type de la carte" label-for="type">
            <b-form-input id="type" v-model="card.type_carte" :disabled="isFormUpdating"></b-form-input>
          </b-form-group>
          <b-form-group id="desc-group" label="La description de la carte" label-for="desc">
            <b-form-input id="desc" v-model="card.description_carte" :disabled="isFormUpdating"></b-form-input>
          </b-form-group>
          <b-form-group id="famille-group" label="La famille de la carte" label-for="famille">
            <b-form-input id="famille" v-model="card.famille_carte" :disabled="isFormUpdating"></b-form-input>
          </b-form-group>
          <b-form-group id="image-group" label="La URL de l'image de la carte" label-for="image">
            <b-form-input id="image" v-model="card.image_carte" :disabled="isFormUpdating"></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">
            <b-spinner small v-if="isFormUpdating"></b-spinner>
            <font-awesome-icon v-if="!isFormUpdating" icon="check" />
          </b-button>
        </b-form>
      </b-col>
      <b-col cols="1"></b-col>
      <b-col cols="4">
        <h2>Caracteristiques de la Carte</h2>
        <transition-group name="list" v-if="rerenderList">
          <b-list-group-item
            v-for="carac in card.caracteristiques"
            v-bind:key="carac.numero_caracteristique"
          >
            <b-container fluid>
              <b-row>
                <b-col cols="4">
                  <b-badge variant="info">{{carac.nom_caracteristique}}</b-badge>
                </b-col>niveau
                <b-col cols="4">
                  <b-form-input
                    type="number"
                    min="1"
                    v-model.number="carac.niveau"
                    v-on:change="updateCarteCaracteristique($route.params.id, carac.numero_caracteristique, carac.niveau)"
                  />
                </b-col>

                <b-button
                  @click="deleteCarteCaracteristique($route.params.id, carac.numero_caracteristique)"
                  pill
                  variant="outline-danger"
                  class="float-right"
                >
                  <font-awesome-icon icon="trash" />
                </b-button>
              </b-row>
            </b-container>
          </b-list-group-item>
        </transition-group>
        <br />
        <b-container fluid>
          <b-row>
            <b-col cols="4">
              <b-form-select
                v-model="newCarac.caracName"
                :options="possibleCaracteristique.map(d => d.nom_caracteristique)"
              ></b-form-select>
            </b-col>niveau
            <b-col cols="4">
              <b-form-input type="number" v-model.number="newCarac.niveau" />
            </b-col>
            <b-button @click="addNewCarac" variant="outline-primary" class="float-right">
              <font-awesome-icon icon="plus" />
            </b-button>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

 
<script>
/* eslint-disable no-console */

import axios from "axios";

export default {
  data: function() {
    return {
      card: {
        numero_carte: null,
        description_carte: null,
        type_carte: null,
        titre_carte: null,
        famille_carte: null,
        image_carte: null,
        caracteristiques: []
      },
      isFormUpdating: false,
      possibleCaracteristique: [],
      newCarac: {
        caracName: null,
        niveau: null
      },
      rerenderList: true
    };
  },
  methods: {
    /** Methods related to carte entity management */
    loadCarte: function(id) {
      axios
        .get(`http://localhost:3000/carte/${id}/caracteristique`)
        .then(res => (this.card = res.data))
        .catch(() => {
          axios
            .get(`http://localhost:3000/carte/${id}`)
            .then(res => {
              this.card = res.data;
              this.card.caracteristiques = [];
            })
            .catch(console.error);
        });
    },

    updateCarte: function(id) {
      this.isFormUpdating = true;
      axios
        .put(`http://localhost:3000/carte/${id}`, this.card)
        .then(() => new Promise(r => setTimeout(r, 200)))
        .then(() => {
          this.isFormUpdating = false;
          this.loadCarte();
        })
        .catch(console.error);
    },

    /** Methods related to carte-caracteristique management*/
    updateCarteCaracteristique: function(id, idCarac, niveau) {
      axios
        .put(`http://localhost:3000/carte/link/${id}/${idCarac}`, { niveau })
        .catch(console.error);
    },

    deleteCarteCaracteristique: function(id, idCarac) {
      axios
        .delete(`http://localhost:3000/carte/link/${id}/${idCarac}`)
        .then(() => {
          this.card.caracteristiques = this.card.caracteristiques.filter(c => {
            return c.numero_caracteristique !== idCarac;
          });
        })
        .catch(console.error);
    },

    addNewCarac: function() {
      const carac = this.possibleCaracteristique.filter(c => {
        return c.nom_caracteristique === this.newCarac.caracName;
      });
      const caracId = carac[0].numero_caracteristique;
      const id = this.$route.params.id;
      const niveau = this.newCarac.niveau;

      axios
        .post(`http://localhost:3000/carte/link/${id}/${caracId}`, { niveau })
        .then(() => {
          this.rerenderList = false;
          this.card.caracteristiques.push({
            numero_caracteristique: caracId,
            nom_caracteristique: this.newCarac.caracName,
            niveau
          });
          this.rerenderList = true;
        })
        .catch(console.error);
    },

    /** Methods related to caracteristique management*/
    loadPossibleCaracteristique: function() {
      axios
        .get("http://localhost:3000/carte/caracteristique")
        .then(res => (this.possibleCaracteristique = res.data))
        .catch(console.error);
    }
  },
  created: function() {
    this.loadCarte(this.$route.params.id);
    this.loadPossibleCaracteristique();
  }
};
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter.right,
.list-leave-to.right {
  opacity: 0;
  transform: translateX(30px);
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
