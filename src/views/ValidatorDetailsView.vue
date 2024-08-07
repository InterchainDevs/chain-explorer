<template>
  <v-sheet border rounded="lg" class="mb-2 pa-4">
    <v-row no-gutters>
      <v-col>
        <h1>Validator detail</h1>
      </v-col>
      <v-col cols="auto" class="mt-1">
        <span class="me-1 text-h6">Top validator</span>

        <v-icon class="mt-n2" color="error" icon="mdi-fire-circle"></v-icon>
      </v-col>
    </v-row>
  </v-sheet>
  <v-sheet border rounded="lg" class="mb-2">
    <v-card :disabled="loading" :loading="loading" class="mx-auto">
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img height="250" :src="banner" cover>
        <v-card-title class="text-h4">
          <v-row class="mb-6" no-gutters>
            <v-col>
              {{ store.detailValidator.description?.moniker }}
            </v-col>
            <v-col cols="auto">
              <v-btn
                class="pa-2"
                :href="store.detailValidator.description?.website"
                target="_blank"
              >
                Website
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <p class="text-h6">{{ store.detailValidator.operatorAddress }}</p>
          <p class="text-h6">
            {{ store.detailValidator.description?.securityContact }}
          </p>
        </v-card-text>
      </v-img>

      <v-card-item>
        <v-card-subtitle>
          <span class="me-1 text-h6">Validator description</span>
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <div class="text-h6">
          {{ store.detailValidator.description?.details }}
        </div>
      </v-card-text>

      <v-divider class="mx-4 mb-1"></v-divider>
    </v-card>
    <v-row>
      <v-col cols="12" sm="2">
        <v-sheet
          border
          rounded="lg"
          class="mr-4 mb-4 pa-2 animate__animated animate__backInUp"
        >
          Block Height
          <v-divider class="mb-7"></v-divider>

          <div class="text-end">
            <v-chip label> 14,755,246 </v-chip>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-table>
      <tbody>
        <tr>
          <td>Commission</td>
          <td>{{ store.detailValidator.commission }}</td>
        </tr>
      </tbody>
    </v-table>

    {{ store.detailValidator }}
  </v-sheet>

  <v-row no-gutters>
    <v-col cols="12" sm="6">
      <v-sheet border rounded="lg" class="pa-2 mr-4">
        One of three columns
        <v-data-table :items="store.allValidatorDelegations"></v-data-table>
      </v-sheet>
    </v-col>
    <v-col cols="12" sm="6">
      <v-sheet border rounded="lg" class="pa-2"> One of three columns </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { useAppStore } from "@/stores/data";

import banner from "@/assets/bitcanna-banner.jpeg";

export default {
  name: "BlocksView",
  data: () => ({
    banner,
    valAddress: "",
  }),
  setup() {
    const store = useAppStore();
    return { store };
  },
  async mounted() {
    await this.store.initRpc();
    this.valAddress = this.$route.params.address;
    console.log(this.valAddress);
    this.store.getDetailsValidator(this.valAddress);
  },
};
</script>
<style>
.transparent-body {
  background: transparent;
}
</style>
