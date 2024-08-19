<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-sheet border rounded="lg" class="mb-4 pa-2">
        Block Height
        <v-divider class="mb-7"></v-divider>
        <div class="text-end">
          <v-chip label>
            {{ blockId }}
          </v-chip>
        </div>
      </v-sheet>
    </v-col>
    <v-col cols="12">
      <v-sheet border rounded="lg" class="mb-4 pa-2">
        Proposer Address
        <v-divider class="mb-7"></v-divider>
        <div class="text-end">
          <v-chip label>
            {{ blockInfo.sdk_block?.header.proposer_address }}
          </v-chip>
        </div>
      </v-sheet>
    </v-col>
    <v-col cols="12">
      <v-sheet border rounded="lg" class="mb-4 pa-2">
        Signature Status
        <v-divider class="mb-7"></v-divider>
        <div class="text-end">
          <v-chip label>
            {{ blockInfo.sdk_block?.last_commit.signatures.length }} /
            {{ totalValidators }}
          </v-chip>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="12">
      <v-sheet border rounded="lg" class="mb-4 pa-2">
        <v-table>
          <tbody>
            <tr>
              <td>Block time</td>
              <td>{{ blockInfo.block?.header.time }}</td>
            </tr>
            <tr>
              <td>ChainId</td>
              <td>{{ blockInfo.block?.header.chain_id }}</td>
            </tr>
            <tr>
              <td>Proposer Address</td>
              <td>{{ blockInfo.sdk_block?.header.proposer_address }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>
  </v-row>
  <v-row v-if="allTransactions.length > 0" no-gutters>
    <v-col cols="12">
      <v-sheet border rounded="lg" class="mb-4 pa-2">
        <v-table theme="dark">
          <thead>
            <tr>
              <th class="text-left">Message type</th>
              <th class="text-left">data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in allTransactions" :key="item.name">
              <td>{{ item.type }}</td>
              <td>{{ item.calories }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>
  </v-row>
  <!-- test {{ blockId }} <br />
{{ blockInfo }}
 -->
</template>
<script>
import { defaultRegistryTypes } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import { fromBase64, fromUtf8 } from "@cosmjs/encoding";
import axios from "axios";

export default {
  name: "BlocksView",
  data: () => ({
    blocks: [],
    isloaded: false,
    lastblock: [],
    blockId: 0,
    blockInfo: [],
    totalValidators: 0,
    allTransactions: [],
  }),
  async mounted() {
    this.blockId = this.$route.params.id;

    const client = await Tendermint37Client.connect("https://rpc.bitcanna.io");

    let getBlockInfo = await axios.get(
      "https://lcd.bitcanna.io/cosmos/base/tendermint/v1beta1/blocks/" +
        this.blockId,
    );
    this.blockInfo = getBlockInfo.data;

    for (let i = 0; i < this.blockInfo.block.data.txs.length; i++) {
      const decodedTx = decodeTxRaw(
        fromBase64(this.blockInfo.block.data.txs[i]),
      );

      for (let j = 0; j < decodedTx.body.messages.length; j++) {
        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === decodedTx.body.messages[j].typeUrl,
        );
        if (foundMsgType) {
          const msg = foundMsgType[1].decode(decodedTx.body.messages[j].value);
          console.log(msg);
          this.allTransactions.push({
            type: decodedTx.body.messages[j].typeUrl,
            message: msg,
          });
        } else {
          console.log(
            "Unknown message type: " + decodedTx.body.messages[j].typeUrl,
          );
        }
      }
    }

    const getTotalValidator = await client.validatorsAll();
    this.totalValidators = getTotalValidator.total;
  },
};
</script>
