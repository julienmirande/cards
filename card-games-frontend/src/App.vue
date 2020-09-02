<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark" class="mb-4">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">Card Game</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item to="/carte">Cartes</b-nav-item>
        <b-nav-item to="/joueur">Joueurs</b-nav-item>
        <b-nav-item to="/deck">Decks</b-nav-item>
        <b-nav-item to="/parties">Parties</b-nav-item>
        <b-nav-item to="/propriete">Propriete</b-nav-item>
        <b-nav-item to="/stats">Stats</b-nav-item>
        <b-nav-item to="/admin">Admin</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
  methods: {},
  created: function() {}
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

