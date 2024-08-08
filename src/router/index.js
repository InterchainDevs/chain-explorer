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
import TestView from "../views/TestView.vue";

import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
    },
    {
      path: "/block/:id",
      name: "blockdetail",
      component: BlockDetailsView,
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
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  ],
});

export default router;
