<template>
  <v-sheet border rounded="lg" class="mb-2 pa-4">
    <v-row no-gutters>
      <v-col>
        <h1>Validator detail</h1>
      </v-col>
      <!--       <v-col cols="auto" class="mt-1">
        <span class="me-1 text-h6">Top validator</span>

        <v-icon class="mt-n2" color="error" icon="mdi-fire-circle"></v-icon>
      </v-col> -->
    </v-row>
  </v-sheet>

  <v-sheet border rounded="lg" class="mb-2">
    <v-card
      :disabled="loading"
      :loading="loading"
      class="mx-auto"
      elevation="0"
    >
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
          </v-row>
        </v-card-title>
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
    </v-card>

    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <v-sheet :height="400" border class="ma-2 pa-2">
          <v-table>
            <tbody>
              <tr>
                <td>Validator address</td>
                <td align="right">
                  <v-list>
                    <v-list-item
                      :title="this.store.detailValidator.operatorAddress"
                    ></v-list-item>
                  </v-list>
                </td>
              </tr>
              <tr>
                <td>Account address</td>
                <td align="right">
                  <v-list>
                    <v-list-item :title="this.selfDelegationAddr"></v-list-item>
                  </v-list>
                </td>
              </tr>
              <tr>
                <td>Contact</td>
                <td align="right">
                  <v-list>
                    <v-btn
                      class="pa-2"
                      :href="store.detailValidator.description?.website"
                      target="_blank"
                    >
                      Website
                    </v-btn>
                  </v-list>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </v-col>
      <v-col cols="12" sm="6">
        <v-sheet :height="400" border class="ma-2 pa-2">
          <v-data-table
            v-model:page="page"
            :items="store.allValidatorDelegations"
            :items-per-page="itemsPerPage"
            hide-details
            
          >
            <template v-slot:item.delegation="{ item }">
              <v-chip label :to="'../address/' + item.delegation">
                {{ item.delegation }}
              </v-chip>
            </template>
            <template v-slot:bottom>
              <div class="text-center pt-2">
                <v-pagination
                  v-model="page"
                  :length="pageCount"
                  :total-visible="4"
                ></v-pagination>
              </div>
            </template>
          </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="2" class="ml-4">
        <v-sheet
          border
          rounded="lg"
          class="mr-4 mb-4 pa-2 animate__animated animate__backInUp"
        >
          Self delegation tokens
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip label> {{ selfDelegationTokens / 1000000 }} BCNA</v-chip>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" sm="2" class="ml-4">
        <v-sheet
          border
          rounded="lg"
          class="mr-4 mb-4 pa-2 animate__animated animate__backInUp"
        >
          Missed blocks
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip v-if="pageLoaded" label> {{ this.missingBlocks }} </v-chip>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" sm="2" class="ml-4">
        <v-sheet
          border
          rounded="lg"
          class="mr-4 mb-4 pa-2 animate__animated animate__backInUp"
        >
          Total delegations
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip label> {{ store.allValidatorDelegations.length }} </v-chip>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" sm="2" class="ml-2">
        <v-sheet
          border
          rounded="lg"
          class="mr-4 mb-4 pa-2 animate__animated animate__backInUp"
        >
          Total Bonded
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip label>
              {{ store.detailValidator.tokens / 1000000 }} BCNA</v-chip
            >
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" sm="2" class="ml-2">
        <v-sheet
          border
          rounded="lg"
          class="mr-4 mb-4 pa-2 animate__animated animate__backInUp"
        >
          Commission Rates
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip label>
              {{
                store.detailValidator.commission?.commissionRates.rate /
                10000000000000000
              }}
              %</v-chip
            >
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-sheet>

  <!--   <v-row no-gutters>
    <v-col cols="12" sm="6">
      <v-sheet border rounded="lg" class="pa-2 mr-4">
        <h4 class="text-h5 font-weight-bold mb-4">Outstanding Rewards</h4>

      </v-sheet>
    </v-col>
    <v-col cols="12" sm="6">
      <v-sheet border rounded="lg" class="pa-2"> Commissions </v-sheet>
    </v-col>
  </v-row> -->

  <!--   <v-row no-gutters>
    <v-col cols="12" sm="12">
      <v-sheet border rounded="lg" class="pa-2 mt-4">
        <h4 class="text-h5 font-weight-bold mb-4">All delegations</h4>
        <v-data-table :items="store.allValidatorDelegations">
          <template v-slot:item.delegation="{ item }">
            <v-chip label :to="'../address/'+item.delegation "> {{ item.delegation }}  </v-chip>
          </template>
        </v-data-table>
      </v-sheet>
    </v-col>
 
  </v-row> -->
</template>
<script>
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import bech32 from "bech32";
import axios from "axios";
import { useAppStore } from "@/stores/data";

import banner from "@/assets/bitcanna-banner.jpeg";

export default {
  name: "BlocksView",
  data: () => ({
    banner,
    page: 1,
    itemsPerPage: 5,
    valAddress: "",
    selfDelegationAddr: "",
    selfDelegationTokens: "",
    pageLoaded: false,
  }),
  setup() {
    const store = useAppStore();
    return { store };
  },
  async mounted() {
    await this.store.initRpc();
    this.valAddress = this.$route.params.address;
    this.store.getDetailsValidator(this.valAddress);
    const decode = bech32.decode(this.valAddress);
    const encode = bech32.encode("bcna", decode.words);
    this.selfDelegationAddr = encode;

    const getSelfDelegation = await axios(
      "https://lcd.bitcanna.io/cosmos/staking/v1beta1/delegations/" +
        this.selfDelegationAddr,
    );
    const found = getSelfDelegation.data.delegation_responses.find(
      (element) => element.delegation.validator_address === this.valAddress,
    );
    this.selfDelegationTokens = found?.balance.amount;

    const getAddressKey = await axios(
      "https://lcd.bitcanna.io/cosmos/staking/v1beta1/validators/" +
        this.valAddress,
    );
    const addressKey = getAddressKey.data.validator.consensus_pubkey.key;
    this.addressKey = addressKey;

    const getSigningAddress = await axios(
      "https://lcd.bitcanna.io/cosmos/base/tendermint/v1beta1/validatorsets/latest",
    );
    const signingAddress = getSigningAddress.data.validators.find(
      (element) => element.pub_key.key === this.addressKey,
    );
    this.signingAddress = signingAddress?.address;

    const getMissingBlocks = await axios(
      "https://lcd.bitcanna.io/cosmos/slashing/v1beta1/signing_infos/" +
        this.signingAddress,
    );
    const missingBlocks =
      getMissingBlocks.data.val_signing_info.missed_blocks_counter;
    console.log(missingBlocks);


    document.title = this.$route.meta.title + " - " + this.store.detailValidator.description?.moniker  + " | BitCanna Explorer";
    document.head.querySelector('meta[name="description"]').content = this.$route.meta.title + " - " + this.store.detailValidator.description?.moniker  + " | BitCanna Explorer";

    this.missingBlocks = missingBlocks;
    this.pageLoaded = true;
  },
  computed: {
      pageCount () {
        return Math.ceil(this.store.allValidatorDelegations.length / this.itemsPerPage)
      },
    },
};
</script>
<style>
.transparent-body {
  background: transparent;
}
</style>
