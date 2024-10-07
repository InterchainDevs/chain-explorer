<template>
  <v-row no-gutters >
    <v-col cols="12" md="3" lg="4">
      <v-sheet border rounded="lg" class="mb-6 mr-0 mr-md-3 pa-2">
        Block Height
        <v-divider class="mb-7"></v-divider>
        <div class="text-end">
          <v-chip label>
            {{ blockId }}
          </v-chip>
        </div>
      </v-sheet>
    </v-col>
    <v-col cols="12" md="6" lg="4">
      <v-sheet border rounded="lg" class="mb-6 mx-0 mx-md-3 pa-2">
        Proposer Address
        <v-divider class="mb-7"></v-divider>
        <div class="text-end">
          <v-chip label>
            {{ blockInfo.sdk_block?.header.proposer_address }}
          </v-chip>
        </div>
      </v-sheet>
    </v-col>
    <v-col cols="12" md="3" lg="4">
      <v-sheet border rounded="lg" class="mb-6 ml-0 ml-md-3 pa-2">
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
    <v-col>
      <v-sheet border rounded="lg" class="mb-6 pa-2">
        <v-table>
          <tbody>
            <tr>
              <td>Block time</td>
              <td>              
              {{               
                moment(blockInfo.block?.header.time).format(
                  "MMMM Do YYYY, h:mm:ss a",
                )
              }}</td>
            </tr>
            <tr>
              <td>ChainId</td>
              <td>
                <v-chip label>
                  {{ blockInfo.block?.header.chain_id }}
                </v-chip>
              </td>
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
    <v-col cols="12" >
      <v-sheet border rounded="lg" class="pa-2">
        <v-table theme="dark">
          <thead>
            <tr>
              <th class="text-left">Message type</th>
              <th class="text-left">data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in allTransactions" :key="item.name">
              <td>
                <v-chip class="ma-2" label :color="item.formatMsg.color">
                  {{ item.formatMsg.typeReadable }} 
                </v-chip> </td>
              <td><!--  {{ item.formatMsg }} --></td>
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
import moment from "moment";

import { setMsg } from "@/libs/msgType";

export default {
  name: "BlocksView",
  data: () => ({
    moment,
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

    document.title =
      this.$route.meta.title + " - " + this.blockId + " | BitCanna Explorer";
    document.head.querySelector('meta[name="description"]').content =
      this.$route.meta.title + " - " + this.blockId + " | BitCanna Explorer";

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
          let formatMsg = setMsg(
            decodedTx.body.messages[j].typeUrl,
            "",
            "",
            "",
            "",
          );
          this.allTransactions.push({
            type: decodedTx.body.messages[j].typeUrl,
            message: msg,
            formatMsg: formatMsg,
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
