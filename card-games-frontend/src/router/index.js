import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home.vue';
import Cartes from '../components/Cartes';
import CarteEdition from '../components/CarteEdition.vue';
import Joueur from '../components/Joueurs.vue';
import NotFound from '../components/NotFound.vue';

/**TODO: */
import Deck from '../components/Deck.vue';
import AjoutCartesDeck from '../components/AjoutCartesDeck.vue';
import Parties from '../components/Parties.vue';
import Propriete from '../components/Propriete.vue';
import Stats from '../components/Stats.vue';
import Admin from '../components/Admin.vue';

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', component: Home },
        { path: '/carte', component: Cartes },
        { path: '/carteEdition/:id', component: CarteEdition },
        { path: '/joueur', component: Joueur },
        { path: '/deck', component: Deck },
        { path: '/ajoutCartesDeck/:id', component: AjoutCartesDeck},
        { path: '/parties', component: Parties },
        { path: '/propriete', component: Propriete },
        { path: '/stats', component: Stats },
        { path: '/admin', component: Admin },

        { path: '/404', component: NotFound },
        { path: '*', redirect: '/404' },
    ]
})