<template>
  <v-sheet border rounded="lg" class="mb-2">
    <v-card
      :disabled="loading"
      :loading="loading"
      class="mx-auto"
      elevation="0"
    >
 

      <v-img rounded="lg" class="d-flex align-end" height="233" :src="banner" cover>
        <v-card-title  v-for="n in 1" :key="n" class="text-h4">
          <v-row no-gutters>
            <v-col>
              <v-avatar class="mr-4">
                <v-img
                  :alt="store.detailValidator.description?.moniker"
                  :src="getImageUrl(this.store.detailValidator.operatorAddress)"
                ></v-img>
                
              </v-avatar>
              {{ store.detailValidator.description?.moniker }}
            </v-col>
            <v-btn class="ma-3 pa-2" :href="store.detailValidator.description?.website" target="_blank">
              Website
            </v-btn>
          </v-row>
        </v-card-title>
      </v-img>
    </v-card>
  </v-sheet>




  <v-row class="d-flex justify-space-between mt-2 mb-2">
      <v-col cols="6" md="2">
        <v-sheet
          border
          rounded="lg"
          class="pa-2 mt-2 animate__animated animate__backInDown"
        >
          Status
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip
              v-if="this.bondedStatus == 'BOND_STATUS_BONDED'"
              class="mx-2"
              label
              color="green"> BONDED
            </v-chip>
            <v-chip
              v-if="this.jailedStatus == 'true'"
              class="mx-2"
              label
              color="red"> JAILED
            </v-chip>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="6" md="2">
        <v-sheet
          border
          rounded="lg"
          class="mt-2 pa-2 animate__animated animate__backInDown"
        >
          Missed blocks
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip v-if="pageLoaded" label> 
              {{ this.missingBlocks }} 
            </v-chip>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="6" md="2">
        <v-sheet
          border
          rounded="lg"
          class="mt-2 pa-2 animate__animated animate__backInDown"
        >
          Total delegations
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip label> 
              {{ store.allValidatorDelegations.length }} 
            </v-chip>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="6" md="2">
        <v-sheet
          border
          rounded="lg"
          class="mt-2 pa-2 animate__animated animate__backInDown"
        >
          Commission rate
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip label>
              {{ store.detailValidator.commission?.commissionRates.rate / 10000000000000000 }} %
            </v-chip>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="2" xl="3">
        <v-sheet
          border
          rounded="lg"
          class="mt-2 pa-2 animate__animated animate__backInDown"
        >
          Total bonded
          <v-divider class="mb-7"></v-divider>
          <div class="text-end">
            <v-chip label>
              {{ (store.detailValidator.tokens / 1000000).toFixed(3) }} BCNA
            </v-chip>
          </div>
        </v-sheet>
      </v-col>
    </v-row>




    <v-row class="d-flex justify-space-between mt-2 mb-2">
      <v-col cols="12" md="6">
        <v-sheet :min-height="420" border rounded="lg">
          <v-table>
            <div class="text-h6 pa-3">
              Validator details
            </div>
            <tbody>
              <tr>
                <td>Validator address</td>
                <td align="right">
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <td class="text-body-2">
 
                            <v-chip label >
                              {{ this.store.detailValidator.operatorAddress }}
                          </v-chip>
                          <!-- <CopyClipboard v-if="pageLoaded" :dataToClip="this.store.detailValidator.operatorAddress" /> -->
                          </td>  
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </td>
              </tr>
              <tr>
                <td>Account address</td>
                <td align="right">
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-chip label :to="'../address/' + this.selfDelegationAddr">
                            {{ this.selfDelegationAddr }}
                          </v-chip>
                          <!-- <CopyClipboard v-if="pageLoaded" :dataToClip="this.selfDelegationAddr" /> -->
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </td>
              </tr>
              <tr>
                <td>Self delegation</td>
                <td align="right">
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-chip label> 
                            {{ selfDelegationTokens / 1000000 }} BCNA
                          </v-chip>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </td>
              </tr>
              <tr>
                <td>Commission</td>
                <td align="right">
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-chip label>
                            {{ (rewardCommission / 1000000).toFixed(3) }} BCNA
                          </v-chip>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </td>
              </tr>
              <tr>
                <td>Security contact</td>
                <td align="right">
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <td class="text-body-2">
                            {{ this.securityContact }}
                          </td>  
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="6">
        <v-sheet :min-height="420" border rounded="lg">
          <v-data-table
            v-model:page="page"
            :items="store.allValidatorDelegations"
            :items-per-page="itemsPerPage"
            hide-details
          >
            <template v-slot:item.delegation="{ item }">
              <!-- <CopyClipboard v-if="pageLoaded" :dataToClip="item.delegation" /> -->
              <v-chip label :to="'../address/' + item.delegation" class="ml-2">
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

 
</template>

<script>
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import bech32 from "bech32";
import axios from "axios";
import { useAppStore } from "@/stores/data";

import banner from "@/assets/bitcanna-banner.jpeg";
import image from "@/assets/logo-bcna.png";

export default {
  name: "BlocksView", 
  data: () => ({
    banner, 
    image: image,
    page: 1,
    itemsPerPage: 5,
    valAddress: "",
    selfDelegationAddr: "",
    selfDelegationTokens: "",
    pageLoaded: false,
    rewardCommission: "",
    bondedStatus: "",
    jailedStatus: "",
    securityContact: "",
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

    this.missingBlocks = missingBlocks;
    this.pageLoaded = true;

    const getRewardCommission = await axios(
      "https://lcd.bitcanna.io/cosmos/distribution/v1beta1/validators/" +
        this.valAddress,
    );
    this.rewardCommission = 
      getRewardCommission.data.commission[0]?.amount;

    const getValidatorStatus = await axios(
      "https://lcd.bitcanna.io/cosmos/staking/v1beta1/validators/" +
        this.valAddress,
    );
    this.bondedStatus = 
      getValidatorStatus.data.validator.status;
    this.jailedStatus = 
      getValidatorStatus.data.validator.jailed;
    this.securityContact =
      getValidatorStatus.data.validator.description.security_contact;

    document.title =
      this.$route.meta.title +
      " - " +
      this.store.detailValidator.description?.moniker +
      " | BitCanna Explorer";
    document.head.querySelector('meta[name="description"]').content =
      this.$route.meta.title +
      " - " +
      this.store.detailValidator.description?.moniker +
      " | BitCanna Explorer";

    this.pageLoaded = true;
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
  computed: {
    pageCount() {
      return Math.ceil(
        this.store.allValidatorDelegations.length / this.itemsPerPage,
      );
    },
  },
};
</script>

<style>
.transparent-body {
  background: transparent;
}
</style>
