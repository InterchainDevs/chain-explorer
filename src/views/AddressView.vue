<template>
  <v-sheet border rounded="lg" class="mt-7 mb-6 pa-4">
    <v-row no-gutters>
      <v-col>
        <h4 class="text-truncate text-sm-h5 font-weight-bold">{{ address }}</h4>
      </v-col>
      <v-col cols="auto" class="mt-1">
        <h4 v-if="isLoaded" class="text-sm-h5 font-weight-bold">
          $ {{ store.fiatWalletValue }}
        </h4>
      </v-col>
    </v-row>
  </v-sheet>

  <v-row no-gutters>
    <v-col cols="12" xs="12" md="8">
      <v-sheet min-height="440" border rounded="lg" class="mb-6 mr-md-3 pa-4">
        <h4 class="text-h5 font-weight-bold mb-4">Delegations</h4>

        <v-data-table
          :items="store.allAddressDelegations"
          items-per-page="4"
        >        
            <template v-slot:item.validator_address="{ item }">     
              <!-- <CopyClipboard :dataToClip="item.validator_address" />    -->       
              <v-chip label :to="'../validator/' + item.validator_address" class="ml-2">
                {{ item.validator_address }}
              </v-chip>
            </template>        
        </v-data-table>
      </v-sheet>
    </v-col>
    <v-col cols="12" xs="12" md="4">
      <v-sheet border rounded="lg" min-height="440" class="mb-6 ml-md-3 pa-4">
        <v-list>
          <v-list-item
            prepend-avatar="https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/bitcanna/asset/bcna.png"
            :title="store.totalTokens + ' BCNA'"
            :subtitle="'$ ' + store.fiatWalletValue"
          >
          </v-list-item>
        </v-list>

        <v-divider class="mt-4"></v-divider>
        <v-table>
          <tbody>
            <tr>
              <td>Spendable Balances</td>
              <td align="right">
                <v-list>
                  <v-list-item
                    v-if="isLoaded"
                    :title="formatNumber(store.spendableBalances)"
                    :subtitle="
                      '$ ' +
                      (store.spendableBalances * store.priceNow).toFixed(2)
                    "
                  ></v-list-item>
                </v-list>
              </td>
            </tr>
            <tr>
              <td>Vested</td>
              <td align="right">
                <v-list>
                  <v-list-item v-if="isLoaded" :title="0.0" :subtitle="'$ 0.00'"></v-list-item>
                </v-list>
              </td>
            </tr>
            <tr>
              <td>Delegations</td>
              <td align="right">
                <v-list>
                  <v-list-item
                    v-if="isLoaded"
                    :title="formatNumber(this.store.totalDelegations)"
                    :subtitle="
                      '$ ' +
                      (this.store.totalDelegations * store.priceNow).toFixed(2)
                    "
                  ></v-list-item>
                </v-list>
              </td>
            </tr>
            <tr>
              <td>Unbound</td>
              <td align="right">
                <v-list>
                  <v-list-item
                    v-if="isLoaded"
                    :title="formatNumber(this.store.totalUnbound)"
                    :subtitle="
                      '$ ' +
                      (this.store.totalUnbound * store.priceNow).toFixed(2)
                    "
                  ></v-list-item>
                </v-list>
              </td>
            </tr>
            <tr>
              <td>Rewards</td>
              <td align="right">
                <v-list>
                  <v-list-item
                    v-if="isLoaded"
                    :title="formatNumber(this.store.totalRewards)"
                    :subtitle="
                      '$ ' +
                      (this.store.totalRewards * store.priceNow).toFixed(2)
                    "
                  ></v-list-item>
                </v-list>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>
  </v-row>

  <!-- Nft view -->
  <v-sheet
    v-if="allAddressNft.length > 0"
    class="mx-auto mb-4 "
    elevation="8" 
    border
    rounded="lg"
  > 
  <v-row no-gutters>
      <v-col>
        <h4 class="text-truncate text-sm-h5 font-weight-bold ml-4 mt-4">NFT Owner</h4>
      </v-col>
  </v-row>
  
    <v-slide-group 
      class="pa-4"
      selected-class="bg-primary"
      show-arrows
    >
      <v-slide-group-item
        v-for="n in allAddressNft"
        :key="n"
        v-slot="{ isSelected, toggle, selectedClass }"
      >


  <v-card
    :disabled="loading"
    :loading="loading" 
    max-height="500"
    max-width="274"
    border
    :class="['ma-4', selectedClass]"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="300"
      :src="n.image"
      cover
    ></v-img>

    <v-card-item>
      <v-card-title>{{ n.name }}</v-card-title>


    </v-card-item>

    <v-card-text>

      <div class="my-2 text-subtitle-1">
        {{ n.collection.symbol }}
      </div>

      <div>{{ n.description }}</div>
    </v-card-text>

<!--     <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        text="Reserve"
        block
        border
        @click="reserve"
      ></v-btn>
    </v-card-actions> -->
  </v-card>
 
      </v-slide-group-item>
    </v-slide-group>
 
  </v-sheet>



  <v-sheet border rounded="lg">
    <h4 class="text-h5 font-weight-bold ma-4">
      Last txs | Total: {{ store.totalAddressTx }}
    </h4>
    <v-skeleton-loader
      v-if="!isLoaded"
      class="mx-auto border"
      type="table-tbody"
    ></v-skeleton-loader>
    <v-table v-if="isLoaded" id="tx-list">
      <thead>
        <tr>
          <th class="text-left">Transaction type</th>
          <th class="text-left">Tx Hash</th>
          <th class="text-left">Block Height</th>
          <th class="text-left">Memo</th>
          <th class="text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.allAddressTx" :key="item.name">
          <td>
            <v-chip class="ma-2" label :color="item.type.color">
              {{ item.type.typeReadable }}
            </v-chip>
          </td>

          <td>
            <!-- <CopyClipboard :dataToClip="item.txhash" />  -->
            <v-chip label :to="'/tx/' + item.txhash" class="ml-2">
              
              {{ truncate(item.txhash) }}
            </v-chip>
          </td>
          <td>
            <v-chip class="ma-2" label>
              {{ formatNumber(item.height) }}
            </v-chip>
          </td>
          <td>
            <span class="d-inline-block text-truncate" style="max-width: 150px">
              {{ item.memo }}
            </span>
          </td>
          <td>
            {{ moment(item.timestamp).format("MMMM Do YYYY, h:mm:ss a") }} ({{
              moment(item.timestamp).fromNow()
            }})
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-model="currentPage"
      class="mt-2 mb-2"
      size="small"
      :total-visible="4"
      :length="store.totalAddressTx / 10"
      @click="handlePageChange"
    ></v-pagination>
  </v-sheet>
</template>
<script>
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { useAppStore } from "@/stores/data";
import moment from "moment";
import bech32 from "bech32";
import axios from "axios";

import banner from "@/assets/bitcanna-banner.jpeg";

export default {
  name: "BlocksView",
  data: () => ({
    moment,
    banner,
    address: "",
    currentPage: 1,
    isLoaded: false,
    allAddressNft: [],
  }),
  setup() {
    const store = useAppStore();
    return { store };
  },
  async mounted() {
    await this.store.initRpc();
    this.address = this.$route.params.address;
    //this.store.getWalletAmount(this.address);
    await this.store.getBankModule(this.address);
    await this.store.getStakingModule(this.address);
    await this.store.getDistribModule(this.address);
    await this.store.getDelegations(this.address);
    await this.store.getPriceNow();
    await this.store.getWalletAmount();

    await this.store.getAddressTx(this.address, 1);

    const decode = bech32.decode(this.address);
    const starsAddr = bech32.encode("stars", decode.words);

    const getMyNft = await axios.get(
    "https://wallet.bitcanna.io/api/nfts/" +
      starsAddr 
    ); 
 
    for (let i = 0; i < getMyNft.data.getMyNft.length; i++) { 
      if (
          getMyNft.data.getMyNft[i].collection.contractAddress ===
          "stars1w4dff5myjyzymk8tkpjrzj6gnv352hcdpt2dszweqnff927a9xmqc7e0gv"
      )  
      this.allAddressNft.push(getMyNft.data.getMyNft[i]);
    }

    this.isLoaded = true;
  },
  methods: {
    async handlePageChange() {
      this.isLoaded = false;
      await this.store.getAddressTx(this.address, this.currentPage);
      this.isLoaded = true;
    },
    formatNumber(value) {
      return new Intl.NumberFormat().format(value);
    },

    truncate(
      fullStr,
      strLen = 8,
      separator = "...",
      frontChars = 6,
      backChars = 6,
    ) {
      if (fullStr.length <= strLen) return fullStr;

      return (
        fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars)
      );
    },
  },
};
</script>
<style>
.transparent-body {
  background: transparent;
}
#tx-list tr:nth-child(even) {
  background-color: #2a2a2a;
}
</style>
