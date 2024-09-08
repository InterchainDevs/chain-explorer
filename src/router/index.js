import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TxView from "../views/TxView.vue";
import BlocksView from "../views/BlocksView.vue";
import AllValidatorsView from "../views/AllValidatorsView.vue";
import BlockDetailsView from "../views/BlockDetailsView.vue";
import ProposalsView from "../views/ProposalsView.vue";
import ValidatorDetailsView from "../views/ValidatorDetailsView.vue";
import AddressView from "../views/AddressView.vue";
import GamesView from "../views/GamesView.vue";
import ParametersView from "../views/ParametersView.vue";
import StoresFinderView from "../views/StoresFinderView.vue";

import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Bitcanna dashboard",
        content: "My page meta description",
      },
    },
    {
      path: "/tx/:txhash",
      name: "txdetails",
      component: TxView,
    },
    {
      path: "/blocks",
      name: "blocklist",
      component: BlocksView,
      meta: {
        title: "Last blocks",
        content: "",
      },
    },
    {
      path: "/block/:id",
      name: "blockdetail",
      component: BlockDetailsView,
      meta: {
        title: "Details block",
        content: "",
      },
    },
    {
      path: "/validators",
      name: "validatorsList",
      component: AllValidatorsView,
    },
    {
      path: "/validator/:address",
      name: "validatorsDetails",
      component: ValidatorDetailsView,
      meta: {
        title: "Validator details",
        content: "",
      },
    },
    {
      path: "/address/:address",
      name: "detailaddress",
      component: AddressView,
    },
    {
      path: "/proposals",
      name: "proposals",
      component: ProposalsView,
    },
    {
      path: "/games",
      name: "gamespage",
      component: GamesView,
    },
    {
      path: "/parameters",
      name: "parameters",
      component: ParametersView,
    },
    {
      path: "/stores-finder",
      name: "storesfinder",
      component: StoresFinderView,
      meta: {
        title: "Stores finder",
        content: "",
      },
    },
    //{ path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: () => import('../views/HomeView.vue')
    }
  ],
});

export default router;
