<template>
  <v-sheet
    border
    rounded="lg"
    class="mb-4 pa-4 animate__animated animate__backInLeft"
  >
    <h1>Last Blocks</h1>
  </v-sheet>
  <div v-if="isloaded">
    <v-sheet
      border
      rounded="lg"
      class="mb-2 pa-2 animate__animated animate__backInRight"
    >
      <v-table>
        <thead>
          <tr>
            <th class="text-left">height</th>
            <th class="text-left">Date</th>
            <th class="text-left">Txs</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in lastblock" :key="item.name">
            <td>
              <v-chip class="ma-2" label :to="'/block/' + item.header.height">
                {{ item.header.height }}
              </v-chip>
            </td>
            <td>{{ item.header.time }}</td>
            <td>{{ item.numTxs }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-sheet>
  </div>
</template>
<script>
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";

export default {
  name: "BlocksView",
  data: () => ({
    blocks: [],
    isloaded: false,
    lastblock: [],
  }),
  async mounted() {
    const client = await Tendermint37Client.connect("https://rpc.bitcanna.io");
    const height = (await client.status()).syncInfo.latestBlockHeight;
    const blockchain = await client.blockchain();

    for (const type of blockchain.blockMetas) {
      this.lastblock.push(type);
    }

    document.title = this.$route.meta.title + " | BitCanna Explorer";
    document.head.querySelector('meta[name="description"]').content =
      this.$route.meta.title + " | BitCanna Explorer";

    this.blocks = height;
    this.isloaded = true;
  },
};
</script>
