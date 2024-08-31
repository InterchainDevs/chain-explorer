<template>
  <v-sheet
    border
    rounded="lg"
    class="mb-4 pa-4 animate__animated animate__backInLeft"
  >
    <h1>All validators</h1>
  </v-sheet>
  <v-sheet
    border
    rounded="lg"
    class="mb-2 pa-2 animate__animated animate__backInRight"
  >
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Moniker</th>
          <th class="text-left">Delegations</th>
          <th class="text-left">Commission</th>
          <th class="text-left">Voting Power Cumulative</th>
          <th class="text-left">Cumulative Share</th>
          <th>Website</th>
        </tr>
      </thead>
      <!-- {{ store.allValidatorsRpc }} -->
      <tbody>
        <tr v-for="(item, index) in store.allValidatorsRpc" :key="item.name">
          <td>{{ index + 1 }}</td>
          <td>
            <v-avatar class="mr-4">
              <v-img
                :alt="item.description.moniker"
                :src="getImageUrl(item.operatorAddress)"
              ></v-img>
            </v-avatar>

            <v-chip
              class="ma-2"
              label
              :to="'/validator/' + item.operatorAddress"
              >{{ item.description.moniker }}</v-chip
            >
          </td>
          <td>{{ item.tokens / 1000000 }} BCNA</td>
          <td>
            {{ item.commission.commissionRates.rate / 10000000000000000 }} %
          </td>
          <td>{{ item.votingPowerPc }} %</td>
          <td>
            <v-progress-linear
              v-model="item.votingPowerCumulative"
              color="#0FB786"
              height="25"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </td>
          <td>
            <v-chip
              class="ma-2"
              label
              :href="item.description?.website"
              target="_blank"
              link
            >
              Website
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>

<script>
import image from "@/assets/logo-bcna.png";
import { useAppStore } from "@/stores/data";

export default {
  data: () => ({
    image: image,
    labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
    value: [200, 675, 410, 390, 310, 460, 250, 240],
  }),
  setup() {
    const store = useAppStore();
    return { store };
  },
  async mounted() {
    await this.store.initRpc();
  },
  methods: {
    getImageUrl(name) {
      let createUrl = new URL(`../assets/moniker/${name}.png`, import.meta.url)
        .href;
      if (createUrl.includes("undefined")) {
        return this.image;
      }
      return createUrl;
    },
  },
};
</script>
