<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <h2>Ajouter Carte</h2>
        </b-col>
        <b-col cols="2">
          <h2>Cartes</h2>
        </b-col>
        <b-col cols="5" />
        <b-col cols="1">
          <b-form-checkbox @change="loadCards">Exclusives</b-form-checkbox>
        </b-col>
        <b-col cols="2">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">
                <font-awesome-icon icon="search" />
              </span>
            </b-input-group-prepend>
            <b-form-input
              placeholder="Filter by carte type"
              v-model="searchByType"
              @input="loadCards"
            ></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col cols="2">
          <b-form @submit.prevent="addCard">
            <b-form-group id="titre-group" label="Le titre de la carte" label-for="titre">
              <b-form-input id="titre" v-model="form.titre_carte"></b-form-input>
            </b-form-group>
            <b-form-group id="type-group" label="Le type de la carte" label-for="type">
              <b-form-input id="type" v-model="form.type_carte"></b-form-input>
            </b-form-group>
            <b-form-group id="desc-group" label="La description de la carte" label-for="desc">
              <b-form-input id="desc" v-model="form.description_carte"></b-form-input>
            </b-form-group>
            <b-form-group id="famille-group" label="La famille de la carte" label-for="famille">
              <b-form-input id="famille" v-model="form.famille_carte"></b-form-input>
            </b-form-group>
            <b-form-group id="image-group" label="La URL de l'image de la carte" label-for="image">
              <b-form-input id="image" v-model="form.image_carte"></b-form-input>
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
        <b-col b-cols="8">
          <b-card-group columns>
            <transition-group name="list">
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
                    @click="deleteCard(card.numero_carte)"
                    pill
                    variant="outline-danger"
                    class="float-right"
                  >
                    <font-awesome-icon icon="trash" />
                  </b-button>
                  <b-button
                    @click="updateCard(card.numero_carte)"
                    pill
                    variant="outline-info"
                    class="float-right"
                  >
                    <font-awesome-icon icon="pencil-alt" />
                  </b-button>
                </template>
              </b-card>
            </transition-group>
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
  data: function() {
    return {
      cards: [],
      form: {
        description_carte: null,
        type_carte: null,
        titre_carte: null,
        famille_carte: null,
        image_carte: null
      },
      searchByType: null,
      filterByExclusive: false,
      alertVariant: null,
      alertMsg: null,
      alertShow: false
    };
  },

  methods: {
    loadCards: function(checked) {
      if (checked === true || checked === false) {
        this.filterByExclusive = checked;
      }

      let req = `http://localhost:3000/carte?lonely=${this.filterByExclusive}`;
      if (this.searchByType) {
        req += `&type=${this.searchByType}`;
      }

      axios
        .get(req)
        .then(res => (this.cards = res.data))
        .catch(console.error);
    },

    addCard: function() {
      axios
        .post("http://localhost:3000/carte", this.form)
        .then(() => {
          this.loadCards();
          this.alertMsg = "Card created !";
          this.alertShow = true;
          this.alertVariant = "success";
        })
        .catch(err => {
          console.error(err);
          this.alertMsg = "Failed creating card title is mandatory and unique";
          this.alertShow = true;
          this.alertVariant = "danger";
        });
    },
    deleteCard: function(id) {
      axios
        .delete(`http://localhost:3000/carte/${id}`)
        .then(this.loadCards)
        .catch(console.error);
    },
    updateCard: function(id) {
      this.$router.push(`/carteEdition/${id}`);
    }
  },
  created: function() {
    this.loadCards();
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
