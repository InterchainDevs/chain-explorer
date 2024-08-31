<template>
  <v-sheet border rounded="lg" class="mb-4 pa-4">
    <v-row no-gutters>
      <v-col>
        <h4 class="text-truncate text-sm-h5 font-weight-bold">{{ address }}</h4>
      </v-col>
      <v-col cols="auto" class="mt-1">
        <h4 class="text-sm-h5 font-weight-bold">
          $ {{ store.fiatWalletValue }}
        </h4>
      </v-col>
    </v-row>
  </v-sheet>

  <v-row no-gutters>
    <v-col cols="12" xs="12" md="8">
      <v-sheet min-height="430" border rounded="lg" class="mb-4 pa-4">
        <h4 class="text-h5 font-weight-bold mb-4">Delegations</h4>

        <v-data-table
          :items="store.allAddressDelegations"
          items-per-page="4"
        ></v-data-table>
      </v-sheet>
    </v-col>
    <v-col cols="12" xs="12" md="4">
      <v-sheet min-height="430" border rounded="lg" class="mb-4 ml-md-4 pa-4">
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
                  <v-list-item :title="0.0" :subtitle="'$ 0.00'"></v-list-item>
                </v-list>
              </td>
            </tr>
            <tr>
              <td>Delegations</td>
              <td align="right">
                <v-list>
                  <v-list-item
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
            <v-chip label :to="'/tx/' + item.txhash">
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

import banner from "@/assets/bitcanna-banner.jpeg";

export default {
  name: "BlocksView",
  data: () => ({
    moment,
    banner,
    address: "",
    currentPage: 1,
    isLoaded: false,
  }),
  setup() {
    const store = useAppStore();
    return { store };
  },
  async mounted() {
    await this.store.initRpc();
    this.address = this.$route.params.address;
    console.log(this.address);
    //this.store.getWalletAmount(this.address);
    await this.store.getBankModule(this.address);
    await this.store.getStakingModule(this.address);
    await this.store.getDistribModule(this.address);
    await this.store.getDelegations(this.address);
    await this.store.getAddressTx(this.address, 1);
    await this.store.getPriceNow();
    await this.store.getWalletAmount();

    this.isLoaded = true;
  },
  methods: {
    async handlePageChange() {
      this.isLoaded = false;
      await this.store.getAddressTx(this.address, this.currentPage);
      this.isLoaded = true;
    },
    formatNumber(value) {
      return new Intl.NumberFormat().format(
        value
      );
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
