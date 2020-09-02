<template>
  <div class="overflow-auto">
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <h2>Ajouter Proprietaire</h2>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="2">
          <b-form @submit.prevent="addNewPropriete">
            <b-form-group id="pseudo-group-1" label="Le pseudonyme du joueur" label-for="pseudo-1">
              <b-form-input id="pseudo-1" v-model="form.pseudonyme"></b-form-input>
            </b-form-group>
            <b-form-group id="exem-group-1" label="L'exemplaire de la carte" label-for="exem-1">
              <b-form-select id="exem-1" v-model="form.numero_exemplaire">
                <option
                  v-for="exem in exemOptions"
                  v-bind:key="exem.numero_exemplaire"
                  :value="exem.numero_exemplaire"
                >{{ `${exem.numero_exemplaire} - ${exem.titre_carte}` }}</option>
              </b-form-select>
            </b-form-group>
            <b-form-group id="etat-gp-1" label="L'etat de la carte" label-for="etat-1">
              <b-form-input type="number" min="0" max="100" id="etat-1" v-model="form.etat"></b-form-input>
            </b-form-group>

            <b-form-group id="mode-gp-1" label="Mode de acquisition de la carte" label-for="mode-1">
              <b-form-input id="mode-1" v-model="form.mode_acquisition"></b-form-input>
            </b-form-group>

            <b-form-group id="acq-gp-1" label="Date de acquisition de la carte" label-for="acq-1">
              <b-form-input type="date" id="acq-1" v-model="form.date_acquisition"></b-form-input>
            </b-form-group>

            <b-form-group id="prix-gp-1" label="Prix de acquisition la carte" label-for="etat-1">
              <b-form-input type="number" min="0" id="etat-1" v-model="form.prix_acquisition"></b-form-input>
            </b-form-group>

            <b-form-group id="modep-gp-1" label="Mode de perte de la carte" label-for="modep-1">
              <b-form-input id="modep-1" v-model="form.mode_perte"></b-form-input>
            </b-form-group>

            <b-form-group id="perte-gp-1" label="Date de perte de la carte" label-for="perte-1">
              <b-form-input type="date" id="perte-1" v-model="form.date_perte"></b-form-input>
            </b-form-group>

            <b-form-group id="vente-gp-1" label="Prix de vente la carte" label-for="vente-1">
              <b-form-input type="number" min="0" id="vente-1" v-model="form.prix_vente"></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">
              <font-awesome-icon icon="plus" />
            </b-button>
          </b-form>
          <br />
        </b-col>
        <b-col cols="10">
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
            :items="allProprietes"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
            style="text-align: center;"
          >
            <template v-slot:cell(etat)="data">
              <span v-if="+data.value >= 90" style="color: green;">{{ data.value }}</span>
              <span
                v-else-if="+data.value >= 50 && +data.value < 90"
                style="color: orange;"
              >{{ data.value }}</span>
              <span v-else style="color: red;">{{ data.value }}</span>
            </template>

            <template v-slot:cell(date_acquisition)="data">
              <span>{{ data.value | moment("DD/MM/YYYY") }}</span>
            </template>

            <template v-slot:cell(prix_acquisition)="data">
              <span>{{ `${(+data.value).toFixed(2)}€` }}</span>
            </template>

            <template v-slot:cell(date_perte)="data">
              <span>{{ data.value | moment("DD/MM/YYYY") }}</span>
            </template>

            <template v-slot:cell(prix_vente)="data">
              <span>{{ `${ data.value ? (+data.value).toFixed(2)+'€':'' }` }}</span>
            </template>

            <template v-slot:cell(options)="row">
              <b-button
                size="sm"
                @click="fillUpdateForm(row.item.numero_propriete)"
                class="mr-2"
                variant="info"
                v-b-modal.modal-1
              >
                <font-awesome-icon icon="pencil-alt" />
              </b-button>

              <b-button
                size="sm"
                @click="deletePropriete(row.item.numero_propriete)"
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
    <b-modal id="modal-1" title="Mettre a jour Propriete" @ok="updatePropriete">
      <b-form>
        <b-form-group id="pseudo-group" label="Le numero du joueur" label-for="pseudo">
          <b-form-input id="pseudo" v-model="form_modal.numero_joueur"></b-form-input>
        </b-form-group>
        <b-form-group id="exem-group" label="L'exemplaire de la carte" label-for="exem">
          <b-form-select id="exem" v-model="form_modal.numero_exemplaire">
            <option
              v-for="exem in exemOptions"
              v-bind:key="exem.numero_exemplaire"
              :value="exem.numero_exemplaire"
            >{{ `${exem.numero_exemplaire} - ${exem.titre_carte}` }}</option>
          </b-form-select>
        </b-form-group>
        <b-form-group id="etat-gp" label="L'etat de la carte" label-for="etat">
          <b-form-input
            type="number"
            min="0"
            max="100"
            id="etat"
            v-model="form_modal.etat_propriete"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="mode-gp" label="Mode de acquisition de la carte" label-for="mode">
          <b-form-input id="mode" v-model="form_modal.mode_acquisition"></b-form-input>
        </b-form-group>

        <b-form-group id="acq-gp" label="Date de acquisition de la carte" label-for="acq">
          <b-form-input type="date" id="acq" v-model="form_modal.date_acquisition"></b-form-input>
        </b-form-group>

        <b-form-group id="prix-gp" label="Prix de acquisition la carte" label-for="etat">
          <b-form-input type="number" min="0" id="etat" v-model="form_modal.prix_acquisition"></b-form-input>
        </b-form-group>

        <b-form-group id="modep-gp" label="Mode de perte de la carte" label-for="modep">
          <b-form-input id="modep" v-model="form_modal.mode_perte"></b-form-input>
        </b-form-group>

        <b-form-group id="perte-gp" label="Date de perte de la carte" label-for="perte">
          <b-form-input type="date" id="perte" v-model="form_modal.date_perte"></b-form-input>
        </b-form-group>

        <b-form-group id="vente-gp" label="Prix de vente la carte" label-for="vente">
          <b-form-input type="number" min="0" id="vente" v-model="form_modal.prix_vente"></b-form-input>
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
      fields: [
        "joueur",
        "carte",
        "etat",
        "mode_acquisition",
        "date_acquisition",
        "prix_acquisition",
        "mode_perte",
        "date_perte",
        "prix_vente",
        "options"
      ],
      allProprietes: [],
      form: {
        pseudonyme: null,
        etat: null,
        numero_exemplaire: null,
        mode_acquisition: null,
        date_acquisition: null,
        prix_acquisition: null,
        mode_perte: null,
        date_perte: null,
        prix_vente: null
      },

      form_modal: {
        numero_joueur: null,
        etat_propriete: null,
        numero_exemplaire: null,
        mode_acquisition: null,
        date_acquisition: null,
        prix_acquisition: null,
        mode_perte: null,
        date_perte: null,
        prix_vente: null
      },
      toUpdate: null,
      exemOptions: [],
      perPage: 10,
      currentPage: 1
    };
  },
  methods: {
    getAllProprietes: function() {
      axios
        .get("http://localhost:3000/propriete/complete")
        .then(res => {
          this.allProprietes = res.data;
          this.allProprietes.forEach(prop => {
            prop.etat = prop.etat_propriete;
          });
        })
        .catch(console.error);
    },
    addNewPropriete: function() {
      axios
        .post("http://localhost:3000/propriete/byName", this.form)
        .then(this.getAllProprietes)
        .catch(console.error);
    },

    deletePropriete: function(id) {
      axios
        .delete(`http://localhost:3000/propriete/${id}`)
        .then(this.getAllProprietes)
        .catch(console.error);
    },

    updatePropriete: function() {
      const form = this.form_modal;

      if (form.date_acquisition === "") form.date_acquisition = null;
      if (form.date_perte === "") form.date_perte = null;
      if (form.prix_vente === "") form.prix_vente = null;


      axios
        .put(`http://localhost:3000/propriete/${this.toUpdate}`, form)
        .then(this.getAllProprietes)
        .catch(console.error);
    },

    fillUpdateForm: function(id) {
      axios
        .get(`http://localhost:3000/propriete/${id}`)
        .then(res => {
          this.form_modal = res.data;
          this.toUpdate = id;
          if (this.form_modal.date_acquisition)
            this.form_modal.date_acquisition = res.data.date_acquisition.split(
              "T"
            )[0];
          if (this.form_modal.date_perte)
            this.form_modal.date_perte = res.data.date_perte.split("T")[0];
        })
        .catch(console.error);
    },

    getAllExemplaires: function() {
      axios
        .get("http://localhost:3000/exemplaire/complete")
        .then(res => (this.exemOptions = res.data))
        .catch(console.error);
    }
  },

  computed: {
    rowsAll() {
      return this.allProprietes.length;
    }
  },

  created: function() {
    this.getAllProprietes();
    this.getAllExemplaires();
  }
};
</script>