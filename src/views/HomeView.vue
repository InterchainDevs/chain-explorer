<template>
  <v-row>
    <v-col cols="12" xs="12" md="8">
      <v-sheet
        border
        rounded="lg"
        height="350"
        class="mb-sm-2 pa-2 animate__animated animate__backInDown"
      >
        <apexchart
          type="candlestick"
          height="300"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </v-sheet>
    </v-col>
    <v-col cols="12" xs="6" md="4">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-sheet
            border
            rounded="lg"
            class="mr-sm-4 mb-4 pa-2 animate__animated animate__backInUp"
          >
            Block Height
            <v-divider class="mb-7"></v-divider>

            <div class="text-end">
              <v-chip label> {{ store.blockNow }} </v-chip>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-sheet
            border
            rounded="lg"
            class="pa-2 mb-4 animate__animated animate__backInUp"
          >
            Inflation
            <v-divider class="mb-7"></v-divider>

            <div class="text-end">
              <v-chip label> 10% / Year </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-sheet
            border
            rounded="lg"
            class="mr-sm-4 mb-4 pa-2 animate__animated animate__backInUp"
          >
            Total Supply
            <v-divider class="mb-8"></v-divider>

            <div class="text-end">
              <v-chip label class="mr-2">
                {{ millify(totalSupply) }} BCNA
                <v-tooltip activator="parent" location="top">
                  ${{ millify(totalSupply * tokenPrice) }}
                </v-tooltip>
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-sheet
            border
            rounded="lg"
            class="pa-2 mb-4 animate__animated animate__backInUp"
          >
            Bonded Tokens
            <v-divider class="mb-8"></v-divider>

            <div class="text-end">
              <v-chip label class="mr-2">
                {{ millify(totalBounded) }} BCNA
                <v-tooltip activator="parent" location="top">
                  ${{ millify(totalBounded * tokenPrice) }}
                </v-tooltip>
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-sheet
            border
            rounded="lg"
            class="mr-sm-4 mb-4 pa-2 animate__animated animate__backInUp"
          >
            Community Pool
            <v-divider class="mb-8"></v-divider>

            <div class="text-end">
              <v-chip label> {{ millify(totalCommunityPool) }} BCNA </v-chip>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-sheet
            border
            rounded="lg"
            class="pa-2 animate__animated animate__backInUp"
          >
            Pool Value
            <v-divider class="mb-8"></v-divider>

            <div class="text-end">
              <v-chip label>
                ${{ millify(totalCommunityPool * tokenPrice) }}
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="12" sm="6">
      <v-sheet
        min-height="900"
        border
        rounded="lg"
        class="mr-sm-4 mt-4 pa-6 text-white mx-auto animate__animated animate__backInLeft"
      >
        <h4 class="text-h5 font-weight-bold mb-4">Last Proposals</h4>
        <v-divider class="mt-8"></v-divider>
        <v-table>
          <tbody>
            <tr v-for="item in allProposals" :key="item.name">
              <td>{{ item.id }}</td>
              <td>{{ item.messages[0].content.title }}</td>
              <td v-if="item.status === 'PROPOSAL_STATUS_PASSED'">
                <v-icon
                  color="green-darken-2"
                  icon="mdi-circle"
                  size="large"
                ></v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>
    <v-col cols="12" sm="6">
      <v-sheet
        min-height="900"
        border
        rounded="lg"
        class="pa-6 mt-4 text-white mx-auto animate__animated animate__backInRight"
      >
        <h4 class="text-h5 font-weight-bold mb-4">Random Validators</h4>
        <v-divider class="mt-8"></v-divider>
        <v-table>
          <tbody>
            <tr v-for="item in randomValidators" :key="item.name">
              <td>
                <v-chip label :to="'validator/' + item.operator_address">
                  {{ item.description.moniker.substring(0, 15) }}
                </v-chip>
              </td>
              <td>
                {{ (item.commission.commission_rates.rate * 100).toFixed(0) }}%
              </td>
              <td>
                <v-chip label color="green"> Online </v-chip>
              </td>
              <td></td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import axios from "axios";
import millify from "millify";
import { useAppStore } from "@/stores/data";

import { setMsg } from "@/libs/msgType";

window.Apex = {
  chart: {
    foreColor: "#ccc",
    toolbar: {
      show: true,
    },
  },
  stroke: {
    width: 3,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: "dark",
  },
  grid: {
    borderColor: "#535A6C",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
};

export default {
  data: () => ({
    millify: millify,
    poolStake: {},
    totalSupply: 0,
    totalBounded: 0,
    totalCommunityPool: 0,
    allProposals: [],
    randomValidators: [],
    tokenPrice: 0,

    series: [
      {
        data: [],
      },
    ],
    chartOptions: {
      chart: {
        type: "candlestick",
        //height: 350
      },
      title: {
        text: "BitCanna Chart",
        align: "left",
        style: {
          fontSize: "25px",
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
    series2: [44, 55, 41],
    chartOptions2: {
      labels: ["Total bounded", "Unbonding", "Unbonded"],
      chart: {
        type: "donut",
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
        },
      },
      grid: {
        padding: {
          bottom: -80,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  }),
  setup() {
    const store = useAppStore();
    return { store };
  },
  async mounted() {
    /* let getOhlc = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcanna/ohlc?days=7&vs_currency=usd",
    ); */
    let getOhlc = await axios.get(
      "https://gist.githubusercontent.com/atmoner/01b2228336092fce49feee68254617b2/raw/7f90f05dc99e582413903510ad82eadd09d4027b/sample_ohcv.json",
    );
    // handle success
    //console.log(getOhlc);
    for (let i = 0; i < getOhlc.data.length; i++) {
      //console.log(getOhlc.data[i]);

      this.series[0].data.push({
        x: new Date(getOhlc.data[i][0]),
        y: [
          getOhlc.data[i][1],
          getOhlc.data[i][2],
          getOhlc.data[i][3],
          getOhlc.data[i][4],
        ],
      });
    }

    let getPrice = await axios.get(
      "https://bcnaracle.bitcanna.io/bcnaracle.json",
    );
    let getTokenNomics = await axios.get(
      "https://lcd.bitcanna.io/cosmos/staking/v1beta1/pool",
    );
    let getSupply = await axios.get(
      "https://lcd.bitcanna.io/cosmos/bank/v1beta1/supply",
    );
    let getCommunityPool = await axios.get(
      "https://lcd.bitcanna.io/cosmos/distribution/v1beta1/community_pool",
    );
    let getProposals = await axios.get(
      "https://lcd.bitcanna.io/cosmos/gov/v1/proposals?proposal_status=PROPOSAL_STATUS_UNSPECIFIED",
    );
    let getValidators = await axios.get(
      "https://lcd.bitcanna.io/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED",
    );

    for (let i = 0; i < 14; i++) {
      this.randomValidators.push(
        getValidators.data.validators[
          Math.floor(Math.random() * getValidators.data.validators.length)
        ],
      );
    }

    const found = getSupply.data.supply.find(
      (token) => token.denom === "ubcna",
    );
    this.totalBounded = getTokenNomics.data.pool.bonded_tokens / 1000000;
    // millify((getTokenNomics.data.pool.bonded_tokens / 1000000));
    this.totalSupply = found.amount / 1000000;
    this.totalCommunityPool = getCommunityPool.data.pool[0].amount / 1000000;
    this.allProposals = getProposals.data.proposals.reverse();
    // this.randomValidators =  getValidators.data.validators;
    this.tokenPrice = getPrice.data.bitcanna.usd;

    this.series2 = [
      Number(getTokenNomics.data.pool.bonded_tokens),
      Number(getTokenNomics.data.pool.not_bonded_tokens),
      Number(
        found.amount -
          (getTokenNomics.data.pool.bonded_tokens +
            getTokenNomics.data.pool.not_bonded_tokens),
      ),
    ];
    // Get last block
    await this.store.getBlockNow();

    document.title = this.$route.meta.title;
    document.head.querySelector('meta[name="description"]').content =
      this.$route.meta.title;
  },
  methods: {},
};
</script>
