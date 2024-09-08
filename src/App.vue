<template>
  <v-app id="inspire">
 
    <v-app-bar >
      <template v-if="mobile" v-slot:prepend>
        <v-app-bar-nav-icon @click="drawerMobile = !drawerMobile"></v-app-bar-nav-icon>
      </template>
      <v-avatar class="mx-2" size="40" variant="flat">
        <v-img :src="image"></v-img>
      </v-avatar>
 
      <v-btn v-if="!mobile" class="me-2" color="#0FB786" height="40" variant="outlined" to="/">
        Dashboard
      </v-btn>

      <v-btn
        v-if="!mobile"
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/blocks"
        >Blocks</v-btn
      >

      <v-btn
        v-if="!mobile"
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/validators"
        >Validators</v-btn
      >

      <v-btn
        v-if="!mobile"
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/proposals"
        >Proposals</v-btn
      >

      <v-btn
        v-if="!mobile"
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/parameters"
        >Parameters</v-btn
      >

<!--       <v-btn
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/stores-finder"
        >Stores Finder</v-btn
      > -->

      <v-btn
        v-if="!mobile"
        class="me-2"
        color="orange"
        height="40"
        variant="outlined"
        prepend-icon="mdi-gamepad-variant"
        to="/games"
        >Games</v-btn
      >
      <v-spacer v-if="!mobile"></v-spacer>
<!--       <v-menu transition="slide-x-transition">
        <template v-slot:activator="{ props }">
          <v-btn class="mr-4" v-bind="props">
            {{ cosmosConfig[this.store.setChainSelected].name }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in cosmosConfig.slice().reverse()"
            :key="i"
          >
            <v-list-item-title @click="changeChain(i)">{{
              item.name
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
 
        <v-text-field
          v-model="searchData"
          density="compact"
          append-inner-icon="mdi-magnify"
          class="mr-4"
          label="Search Tx hash or address"
          rounded="lg"
          variant="solo-filled"
          flat
          hide-details
          single-line
          height="40"
          @click:append-inner="onClick"
        ></v-text-field>
 

      <v-btn
        v-if="!this.store.isLogged && !mobile"
        icon="mdi-dots-vertical"
        @click="this.store.keplrConnect()"
      >
        <v-avatar>
          <v-img alt="keplrImage" :src="keplrImage"></v-img>
        </v-avatar>
      </v-btn>
      <v-avatar v-if="this.store.isLogged" class="mr-4">
        <RouterLink :to="'/address/' + this.store.addrWallet">
          <v-btn icon="mdi-account" color="#0FB786"></v-btn>
        </RouterLink>
      </v-avatar>
    </v-app-bar>
    <v-navigation-drawer
        v-if="mobile"
        v-model="drawerMobile"
        :mobile="mobile"
        temporary 
      >
        <v-list 
          v-for="items in itemsMenu"
          density="compact"
          nav
        >
          <v-list-item 
            :prepend-icon="items.icon" 
            :title="items.title"  
            :to="items.to"
          ></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer v-if="!mobile" :width="352">
      <v-table>
        <tbody>
          <tr>
            <td>SDK Version</td>
            <td class="text-right">
              <v-chip label>{{ store.sdkVersion }}</v-chip>
            </td>
          </tr>
          <tr>
            <td>IBC Version</td>
            <td class="text-right">
              <v-chip label>
                {{ store.ibcVersion }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-divider></v-divider>

      <div>
        <div class="ml-2 mt-4">
          <v-icon
            icon="mdi-record-circle"
            :class="wsIsStarted ? 'mr-4 heart' : 'mr-4'"
          ></v-icon>
          Live Tx's
          <v-btn
            v-if="!wsIsStarted"
            class="text-none mt-n1"
            flat
            icon="mdi-play-circle-outline"
            @click="startWebsocket()"
          ></v-btn>
          <v-btn
            v-if="wsIsStarted"
            class="text-none mt-n1"
            flat
            icon="mdi-stop-circle-outline"
            @click="stopWebsocket()"
          ></v-btn>
          <v-btn
            v-if="lastTxs.length > 0"
            class="text-none mt-n1"
            flat
            icon="mdi-delete-circle-outline"
            @click="deleteWebsocket()"
          ></v-btn>
        </div>

        <v-list lines="two">
          <div v-for="n in lastTxs" :key="n">
            <v-list-item
              prepend-icon="mdi-cog-transfer"
              :key="n"
              ripple
              :to="'/tx/' + n.finalHash"
              class="animate__animated animate__backInUp"
            >
              <template v-slot:title>
                <div v-html="n.typeReadable"></div>
              </template>

              <template v-slot:subtitle>
                <div
                  v-html="moment(n.timestamp).format('MMMM Do YYYY, h:mm:ss a')"
                ></div>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list>
      </div>
      <template v-slot:append>
        <v-footer >
          <v-row justify="center" no-gutters>
            <v-col class="text-center mt-2" cols="12">
              <!-- {{ new Date().getFullYear() }} — <strong>BitCanna</strong> -->
                Dev with 💚 for <strong>BitCanna</strong>
            </v-col>
          </v-row>
        </v-footer>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-row v-if="debug" justify="center" no-gutters class="mb-4">
        <v-alert icon="mdi-console">
          <v-col class="text-center mt-2" cols="12">
            {{ height }} {{ name }} {{ width }}
          </v-col>
        </v-alert>
      </v-row>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import image from "./assets/logo-bcna.png";
import keplrImage from "./assets/keplr.png";

import moment from "moment";
import millify from "millify";
import bech32 from "bech32";
import axios from "axios";
import { computed } from "vue";
import { useMeta } from "vue-meta";

import { setMsg } from "@/libs/msgType";
import cosmosConfig from "@/cosmos.config";
import { useAppStore } from "@/stores/data";
import { useDisplay } from "vuetify";

window.Apex = {
  chart: {
    foreColor: "#ccc",
    toolbar: {
      show: true,
    },
  },
  stroke: {
    width: 3,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: "dark",
  },
  grid: {
    borderColor: "#535A6C",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
};

export default {
  data: () => ({
    debug: false,
    millify: millify,
    moment: moment,
    cosmosConfig: cosmosConfig,
    image: image,
    keplrImage: keplrImage,
    socket: null,
    lastTxs: [],
    searchData: "",
    wsIsStarted: false,
    drawerMobile: false,
    itemsMenu: [
        {
          title: 'Dashboard',
          color: '#0FB786',
          to: '/',
          icon: 'mdi-home-account',
        },
        {
          title: 'Blocks',
          color: '#0FB786',
          to: '/blocks',
          icon: 'mdi-view-dashboard',
        },
        {
          title: 'Validators',
          color: '#0FB786',
          to: '/validators',
          icon: 'mdi-consolidate',
        },
        {
          title: 'Proposals',
          color: '#0FB786',
          to: '/proposals',
          icon: 'mdi-vote',
        },
        {
          title: 'Parameters',
          color: '#0FB786',
          to: '/parameters',
          icon: 'mdi-cog-outline',
        },
        {
          title: 'Games',
          color: '#0FB786',
          to: '/games',
          icon: 'mdi-gamepad-variant',
        },
      ],
  }),
  setup() {
    const store = useAppStore();
    const { name, width, mobile } = useDisplay();

    const height = computed(() => {
      switch (name.value) {
        case "xs":
          return 220;
        case "sm":
          return 400;
        case "md":
          return 500;
        case "lg":
          return 600;
        case "xl":
          return 800;
        case "xxl":
          return 1200;
      }

      return undefined;
    });

    return { store, height, name, width, mobile };
  },
  watch: {
    searchData(hash) {
      try {
        const decode = bech32.decode(hash);
        const encode = bech32.encode("bcna", decode.words);
        this.searchData = "";
        this.$router.push({
          path: "/address/",
          name: "detailaddress",
          params: { address: encode },
        });
        return;
      } catch (error) {
        //console.log(error);
      }

      try {
        //this.searchData = '';
        if (hash.length !== 64) {
          return;
        }
        if (this.testTxHash(hash)) {
          this.$router.push({ name: "txdetails", params: { txhash: hash } });
        }
      } catch (error) {
        //console.log(error);
      }
    },
  },
  async mounted() {
    var myAddress = localStorage.getItem("myBitcannaAddress");
    if (myAddress) {
      this.store.keplrConnect();
    }

    const { mobile } = useDisplay();
    console.log(this.$vuetify.display.mobile);
    console.log("Mobile: ", mobile.value);

    await this.store.initRpc();
    await this.store.getSdkVersion();
    await this.store.getAllValidators();

  },
  methods: {
    changeChain(i) {
      this.store.setChainSelected = i;
      this.store.refresh();
    },
    sendMessage(content) {
      console.log("Connected on bitcanna blockchain from WebSocket");
      const message = JSON.stringify({
        method: "subscribe",
        params: {
          query: "tm.event='Tx'", // tm.event='Tx' AND mint.owner='ownerAddress'
        },
        id: "1",
        jsonrpc: "2.0",
      });
      this.socket.send(message);
    },
    async testTxHash(hashTx) {
      try {
        await axios(
          "https://lcd.bitcanna.io/cosmos/tx/v1beta1/txs/" + hashTx,
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    startWebsocket() {
      this.socket = new WebSocket("wss://rpc.bitcanna.io/websocket");
      //this.socket = new WebSocket('wss://rpc.osmosis.zone/websocket');

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.result.events === undefined) {
          return;
        }

        let formatMsg = setMsg(
          message.result.events["message.action"][0],
          "",
          Date.now(),
          "",
          message.result.events["tx.hash"][0],
        );

        // Add new transaction to the list
        this.lastTxs.unshift(formatMsg);

        // Keep only the last 5 transactions
        if (this.lastTxs.length > 9) {
          this.lastTxs.pop();
        }
      };

      this.socket.onopen = () => {
        console.log("WebSocket connection established");
        this.sendMessage();
        this.wsIsStarted = true;
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket encountered an error:", error);
      };
    },
    stopWebsocket() {
      if (this.socket) {
        this.socket.close();
        this.wsIsStarted = false;
        console.log("WebSocket connection closed");
      }
    },
    deleteWebsocket() {
      this.lastTxs = [];
    },
  },
};
</script>

<style>
/* Styling Heart */
.heart {
  color: red;
  font-size: 250px;
  height: 100px;
  width: 100px;
  /* Animating heart */
  animation: pulse 1.5s infinite;
}
.footerNav {
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(1.9);
    opacity: 0;
  }
}
</style>
