<template>
  <v-sheet
    border
    rounded="lg"
    class="mb-6 pa-4 animate__animated animate__backInLeft"
  >
    <h1>All proposals</h1>
  </v-sheet>

  <v-row no-gutters>
    <v-col cols="12" sm="12">
      <v-sheet
        border
        rounded="lg"
        class="pa-2 animate__animated animate__fadeInUpBig"
      >
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Proposal ID</th>
              <th class="text-left">Name</th>
              <th class="text-left">Submit Time</th>

              <th class="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in getProposals" :key="item.name">
              <td>#{{ item.proposal_id }}</td>
              <td>{{ item.content.title }}</td>
              <td>
                {{ moment(item.submit_time).format("MMMM Do YYYY, h:mm:ss a") }}
              </td>

              <td>
                <v-chip
                  v-if="item.status == 'PROPOSAL_STATUS_PASSED'"
                  class="ma-2"
                  label
                  color="green"
                >
                  STATUS PASSED
                </v-chip>
                <v-chip
                  v-if="item.status == 'PROPOSAL_STATUS_VOTING_PERIOD'"
                  class="ma-2"
                  label
                  color="orange"
                >
                  STATUS VOTING PERIOD
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import axios from "axios";
import moment from "moment";

import { useAppStore } from "@/stores/data";

export default {
  name: "BlocksView",
  data: () => ({
    moment,
    blocks: [],
    isloaded: false,
    lastblock: [],
    getProposals: [],
  }),
  setup() {
    const store = useAppStore();
    return { store };
  },
  async mounted() {
    //this.store.getProposalsConfig();

    let getPrpoposals = await axios.get(
      "https://lcd.bitcanna.io/cosmos/gov/v1beta1/proposals?proposal_status=PROPOSAL_STATUS_UNSPECIFIED",
    );

    console.log(getPrpoposals.data.proposals);
    this.getProposals = getPrpoposals.data.proposals.reverse();
  },
};
</script>
