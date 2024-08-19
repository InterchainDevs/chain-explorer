<template>
  <v-app id="inspire">
    <v-app-bar height="72" flat="true" >
      <v-avatar class="mx-2" size="40" variant="flat">
        <v-img :src="image"></v-img>
      </v-avatar>

      <v-btn class="me-2" color="#0FB786" height="40" variant="outlined" to="/"
        >Dashboard</v-btn
      >

      <!--       <v-btn
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined" 
      >Transactions</v-btn> -->

      <v-btn
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/blocks"
        >Blocks</v-btn
      >

      <v-btn
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/validators"
        >Validators</v-btn
      >

      <v-btn
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/proposals"
        >Proposals</v-btn
      >

      <v-btn
        class="me-2"
        color="#0FB786"
        height="40"
        variant="outlined"
        to="/parameters"
        >Parameters</v-btn
      >

      <v-btn
        class="me-2"
        color="orange"
        height="40"
        variant="outlined"
        prepend-icon="mdi-gamepad-variant"
        to="/games"
        >Games</v-btn
      >
      <v-spacer></v-spacer>

      <v-responsive max-width="500">
        <v-text-field
          v-model="searchData"
          density="compact"
          append-inner-icon="mdi-magnify"
          class="mr-8"
          label="Search Tx hash or address"
          rounded="lg"
          variant="solo-filled"
          flat
          hide-details
          single-line
          @click:append-inner="onClick"
        ></v-text-field>
      </v-responsive>
    </v-app-bar>

    <!--     <v-footer
      color="grey"
      height="44"
      app
    ></v-footer> -->

    <v-navigation-drawer :width="352">
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
        <v-footer class="bg-grey-lighten-1">
          <v-row justify="center" no-gutters>
            <v-col class="text-center mt-2" cols="12">
              {{ new Date().getFullYear() }} — <strong>BitCanna</strong>
            </v-col>
          </v-row>
        </v-footer>
      </template>
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import image from "./assets/logo-bcna.png";

import moment from "moment";
import millify from "millify";
import bech32 from "bech32";
import axios from "axios";

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
    millify: millify,
    moment: moment,
    cosmosConfig: cosmosConfig,
    image: image,

    socket: null,
    lastTxs: [],

    searchData: "",
    wsIsStarted: false,
  }),
  setup() {
    const store = useAppStore();
    return { store };
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
    const { mobile } = useDisplay();

    await this.store.initRpc();
    await this.store.getSdkVersion();
    await this.store.getAllValidators();

    /*     this.socket = new WebSocket('wss://rpc.bitcanna.io/websocket'); 
    //this.socket = new WebSocket('wss://rpc.osmosis.zone/websocket'); 

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.result.events === undefined) {
        return;
      }

      let formatMsg = setMsg(
          message.result.events['message.action'][0],
          '',
          Date.now(),
          '',
          message.result.events['tx.hash'][0],
      )

      // Add new transaction to the list
      this.lastTxs.unshift(formatMsg);

      // Keep only the last 5 transactions
      if (this.lastTxs.length > 9) {
        this.lastTxs.pop();
      }
      console.log(message.result.events);
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.sendMessage();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket encountered an error:', error);
    }; */
  },
  methods: {
    sendMessage(content) {
      console.log("Connected on bitcanna blockchain from WebSocket");
      const message = JSON.stringify({
        method: "subscribe",
        params: ["tm.event='Tx'"],
        id: "1",
        jsonrpc: "2.0",
      });
      this.socket.send(message);
    },
    async testTxHash(hashTx) {
      try {
        console.log(hashTx);
        const testHash = await axios(
          "https://lcd.bitcanna.io/cosmos/tx/v1beta1/txs/" + hashTx,
        );
        console.log(testHash);
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
        console.log(message.result.events);
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
