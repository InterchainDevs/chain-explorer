<template>
  <v-sheet
    border
    rounded="lg"
    class="mb-4 pa-4 animate__animated animate__backInLeft"
  >
    <h1>Bitcanna Parameters</h1>
  </v-sheet>

  <v-sheet
    border
    rounded="lg"
    class="mb-4 pa-4 animate__animated animate__backInRight"
  >
    <h4 class="text-h5 font-weight-bold ma-2">Minting Parameters</h4>
    <v-divider class="mb-2"></v-divider>
    <v-table>
      <tbody>
        <tr>
          <td>Mint denom</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.mintParams[0]?.mint.mint_denom }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Inflation</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.mintParams[0]?.inflation * 100 }}%
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Inflation rate change</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.mintParams[0]?.mint.inflation_rate_change * 100 }}%
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Inflation max</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.mintParams[0]?.mint.inflation_max * 100 }}%
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Inflation min</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ (store?.mintParams[0]?.mint.inflation_min * 100).toFixed(2) }}%
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Annual Provisions</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{
                Number(store?.mintParams[0]?.annualProvisions).toFixed(2)
              }}
              BCNA
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
  
  <v-sheet
    border
    rounded="lg"
    class="pa-2 mb-4 animate__animated animate__backInLeft"
  >
    <h4 class="text-h5 font-weight-bold ma-2">Staking Parameters</h4>
    <v-divider class="mb-2"></v-divider>
    <v-table>
      <tbody>
        <tr>
          <td>Unbonding time</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.stakingParams[0]?.staking.unbonding_time }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Max validators</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.stakingParams[0]?.staking.max_validators }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Max entries</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.stakingParams[0]?.staking.max_entries }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Historical entries</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.stakingParams[0]?.staking.historical_entries }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Historical entries</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.stakingParams[0]?.staking.historical_entries }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Min commission rate</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.stakingParams[0]?.staking.min_commission_rate * 100 }}%
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>

  <v-sheet
    border
    rounded="lg"
    class="pa-2 mb-4 animate__animated animate__backInRight"
  >
    <h4 class="text-h5 font-weight-bold ma-2">Governance Parameters</h4>
    <v-divider class="mb-2"></v-divider>
    <v-table>
      <tbody>
        <tr>
          <td>Voting period</td>
          <td>
            <v-chip class="ma-2" label>
              {{ store?.govParams.voting?.voting_params.voting_period }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Tallying</td>
          <td>
            <v-table>
              <tbody>
                <tr>
                  <td>Quorum</td>
                  <td class="text-right">
                    <v-chip class="ma-2" label>
                      {{
                        store?.govParams.tallying?.tally_params.quorum * 100
                      }}
                      %
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <td>Threshold</td>
                  <td class="text-right">
                    <v-chip class="ma-2" label>
                      {{
                        store?.govParams.tallying?.tally_params.threshold * 100
                      }}
                      %
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <td>Veto threshold</td>
                  <td class="text-right">
                    <v-chip class="ma-2" label>
                      {{
                        store?.govParams.tallying?.tally_params.veto_threshold *
                        100
                      }}
                      %
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </td>
        </tr>
        <tr>
          <td>Min deposit</td>
          <td>
            <v-chip class="ma-2" label>
              {{
                store?.govParams.deposit?.deposit_params.min_deposit[0].amount /
                1000000
              }}
              BCNA
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Max deposit period</td>
          <td>
            <v-chip class="ma-2" label>
              {{ store?.govParams.deposit?.deposit_params.max_deposit_period }}
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
  <v-sheet
    border
    rounded="lg"
    class="pa-2 mb-4 animate__animated animate__backInLeft"
  >
    <h4 class="text-h5 font-weight-bold ma-2">Distribution Parameters</h4>
    <v-divider class="mb-2"></v-divider>
    <v-table>
      <tbody>
        <tr>
          <td>Community tax</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.distribParams.community_tax * 100 }} %
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Base proposer reward</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.distribParams.base_proposer_reward * 100 }} %
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Bonus proposer reward</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.distribParams.bonus_proposer_reward * 100 }} %
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Withdraw addr enabled</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.distribParams.withdraw_addr_enabled }}
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
  <v-sheet
    border
    rounded="lg"
    class="pa-2 mb-4 animate__animated animate__backInRight"
  >
    <h4 class="text-h5 font-weight-bold ma-2">Slashing Parameters</h4>
    <v-divider class="mb-2"></v-divider>
    <v-table>
      <tbody>
        <tr>
          <td>Signed blocks window</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.slashingParams.signed_blocks_window }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Min signed per window</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.slashingParams.min_signed_per_window * 100 }} %
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Downtime jail duration</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.slashingParams.downtime_jail_duration }}
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Slash fraction double sign</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.slashingParams.slash_fraction_double_sign * 100 }} %
            </v-chip>
          </td>
        </tr>
        <tr>
          <td>Slash fraction downtime</td>
          <td class="text-right">
            <v-chip class="ma-2" label>
              {{ store?.slashingParams.slash_fraction_downtime * 100 }} %
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>
<script>
import { useAppStore } from "@/stores/data";

export default {
  name: "ParametersView",
  data: () => ({
    tabGov: null,
    mintingParams: [],
    stakingParams: [],
    governanceParams: [],
    distributionParams: [],
    slashingParams: [],
  }),
  setup() {
    const store = useAppStore();
    return { store };
  },
  async mounted() {
    await this.store.getParams();
  },
};
</script>
