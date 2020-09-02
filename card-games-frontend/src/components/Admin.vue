<template>
  <div>
    <b-container fluid>
      <b-tabs content-class="mt-3">
        <b-tab title="Caractéristiques" active>
          <b-row>
            <b-col cols="2">
              <h3>Ajouter Caractéristique</h3>
            </b-col>
            <b-col>
              <h3>Caractéristiques</h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="2">
              <br />
              <b-form @submit.prevent="addCharacteristic">
                <b-form-group
                  id="nom-group-1"
                  label="Le nom de la caractéristique"
                  label-for="nom-1"
                >
                  <b-form-input id="nom-1" v-model="characteristicForm.nom_caracteristique"></b-form-input>
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
            <b-col cols="9">
              <b-pagination
                pills
                v-model="characteristicsCurrentPage"
                :total-rows="characteristicsRowsAll"
                :per-page="perPage"
                aria-controls="my-table-1"
              ></b-pagination>
              <b-table
                striped
                hover
                responsive="sm"
                id="my-table-1"
                :items="characteristics"
                :fields="characteristicsFields"
                :per-page="perPage"
                :current-page="characteristicsCurrentPage"
              >
                <template v-slot:cell(options)="row">
                  <b-button size="sm" @click="fillCharacteristicForm(row.item)" class="mr-2" variant="info">
                    <font-awesome-icon icon="pencil-alt" />
                  </b-button>
                  <b-button
                    size="sm"
                    @click="deleteCharacteristic(row.item.numero_caracteristique)"
                    class="mr-2"
                    variant="danger"
                  >
                    <font-awesome-icon icon="trash" />
                  </b-button>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Exemplaires">
          <p>I'm the second tab</p>
        </b-tab>
      </b-tabs>
    </b-container>
    <b-modal
      id="modal-characteristic"
      title="Éditer caractéristique"
      @ok="updateCharacteristic(characteristicToUpdate)"
    >
      <b-form-input v-model="characteristicModalForm.nom_caracteristique"></b-form-input>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable no-console */

import axios from "axios";

export default {
  data() {
    return {
      characteristicsFields: ["nom_caracteristique", "options"],
      characteristicForm: {
        nom_caracteristique: null
      },
      characteristicModalForm: {
        nom_caracteristique: null
      },
      characteristicToUpdate: null,
      characteristics: [],
      perPage: 10,
      characteristicsCurrentPage: 1,
      characteristicsCurrentPageCol: 1,
      alertVariant: null,
      alertMsg: null,
      alertShow: false
    };
  },
  methods: {
    addCharacteristic: function() {
      axios
        .post(
          "http://localhost:3000/carte/caracteristique",
          this.characteristicForm
        )
        .then(() => this.loadCharacteristics());
    },
    loadCharacteristics: function() {
      axios
        .get("http://localhost:3000/carte/caracteristique")
        .then(res => (this.characteristics = res.data))
        .catch(console.error);
    },
    deleteCharacteristic: function(id) {
      axios
        .delete(`http://localhost:3000/carte/caracteristique/${id}`)
        .then(() => this.loadCharacteristics())
        .catch(console.error);
    },
    updateCharacteristic: function(id) {
      axios
        .put(
          `http://localhost:3000/carte/caracteristique/${id}`,
          this.characteristicModalForm
        )
        .then(() => this.loadCharacteristics())
        .catch(console.error);
    },
    fillCharacteristicForm: function(characteristic) {
      this.characteristicModalForm.nom_caracteristique =
        characteristic.nom_caracteristique;
      this.characteristicToUpdate = characteristic.numero_caracteristique;
      this.$bvModal.show('modal-characteristic');
    }
  },
  computed: {
    characteristicsRowsAll() {
      return this.characteristics.length;
    }
  },
  created: function() {
    this.loadCharacteristics();
  }
};
</script>