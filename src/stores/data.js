import { defineStore } from "pinia";
import axios from "axios";
import Long from "long";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import {
  createProtobufRpcClient,
  QueryClient,
  StargateClient,
} from "@cosmjs/stargate";
import cosmosConfig from "@/cosmos.config";
import { setMsg } from "@/libs/msgType";

import * as staking from "cosmjs-types/cosmos/staking/v1beta1/query";
import * as gov from "cosmjs-types/cosmos/gov/v1beta1/query";
import * as bank from "cosmjs-types/cosmos/bank/v1beta1/query";
import * as distrib from "cosmjs-types/cosmos/distribution/v1beta1/query";
import * as mint from "cosmjs-types/cosmos/mint/v1beta1/query";

export const useAppStore = defineStore("app", {
  state: () => ({
    rpcClient: null,
    rpcBase: null,
    ibcVersion: "",
    sdkVersion: "",
    blockNow: "",
    allValidators: [],
    allValidatorsRpc: [],
    detailValidator: [],
    allProposals: [],
    inflation: 0,
    allsupply: 0,
    totalBounded: 0,
    // Wallet details
    spendableBalances: 0,
    totalDelegations: 0,
    totalUnbound: 0,
    totalRewards: 0,
    fiatWalletValue: 0,
    allAddressDelegations: [],
    allAddressTx: [],
    totalAddressTx: 0,

    priceNow: 0,
    allValidatorDelegations: [],
    // Params
    mintParams: [],
    stakingParams: [],
    govParams: [],
    distribParams: [],
    slashingParams: [],
  }),
  actions: {
    async refresh() {
      await this.initRpc();
      this.dataLoaded = true;
    },
    async initRpc() {
      if (this.rpcClient) {
        this.rpcBase.disconnect();
      }
      const client = await Tendermint37Client.connect(
        "https://rpc.bitcanna.io",
      );
      const queryClient = new QueryClient(client);
      const rpcClient = createProtobufRpcClient(queryClient);
      this.rpcClient = rpcClient;
      this.rpcBase = client;
    },
    async getSdkVersion() {
      const getSdk = await axios(
        "https://lcd.bitcanna.io/cosmos/base/tendermint/v1beta1/node_info",
      );
      for (let i of getSdk.data.application_version.build_deps) {
        let position = i.path.search("ibc-go");
        if (position !== -1) {
          this.ibcVersion = i.version;
        }
      }
      this.sdkVersion = getSdk.data.application_version.cosmos_sdk_version;
    },

    async getPriceNow() {
      const getPrice = await axios(
        "https://bcnaracle.bitcanna.io/bcnaracle.json",
      );
      this.priceNow = getPrice.data.bitcanna.usd;
      // commit("setPriceNow", getPrice.data.bitcanna.usd.toFixed(5));
    },

    async getWalletAmount() {
      let totalToken =
        Number(this.spendableBalances) +
        Number(this.totalDelegations) +
        Number(this.totalUnbound) +
        Number(this.totalRewards);

      this.totalTokens = totalToken.toFixed(6);
      this.fiatWalletValue = (totalToken * this.priceNow).toFixed(2);
    },
    async getBankModule(addrWallet) {
      const queryBank = new bank.QueryClientImpl(this.rpcClient);
      let spendableBalances = await queryBank.SpendableBalances({
        address: addrWallet,
      });
      let allBalances = await queryBank.AllBalances({ address: addrWallet });

      const found = spendableBalances.balances.find(
        (element) => element.denom === cosmosConfig[2].coinLookup.chainDenom,
      );
      // TODO: fix this
      let returnValue = "";
      if (found?.amount > 0) {
        returnValue = found?.amount / 1000000;
      } else {
        returnValue = 0;
      }

      let totalSupply = await queryBank.SupplyOf({
        denom: cosmosConfig[2].coinLookup.chainDenom,
      });
      this.spendableBalances = returnValue;
      this.totalSupply = totalSupply.amount.amount;
      this.totalSupplyPrice =
        (totalSupply.amount.amount / 1000000) * this.chainSelectedPrice;
    },
    async getStakingModule(addrWallet) {
      const queryStaking = new staking.QueryClientImpl(this.rpcClient);
      let getPoolStaking = await queryStaking.Pool({});
      let delegatorValidators = await queryStaking.DelegatorDelegations({
        delegatorAddr: addrWallet,
        pagination: {
          countTotal: false,
          key: "",
          offset: Long.fromNumber(0, true),
          limit: Long.fromNumber(200, true),
          reverse: false,
        },
      });

      let total = 0;
      let allUnbound = await queryStaking.DelegatorUnbondingDelegations({
        delegatorAddr: addrWallet,
      });
      let totalUnbound = 0;

      for (let i of delegatorValidators.delegationResponses) {
        total += Number(i.balance.amount);
      }
      if (allUnbound.unbondingResponses.length > 0) {
        for (let i of allUnbound.unbondingResponses) {
          for (let j of i.entries) {
            totalUnbound += Number(j.balance);
          }
        }
      } else {
        totalUnbound = 0.0;
      }

      this.totalDelegations = (total / 1000000).toFixed(6);
      this.totalUnbound = (totalUnbound / 1000000).toFixed(6);
      this.poolStaking = getPoolStaking.pool;
    },
    async getDistribModule(addrWallet) {
      const queryDistrib = new distrib.QueryClientImpl(this.rpcClient);
      const queryDistribResult = await queryDistrib.DelegationTotalRewards({
        delegatorAddress: addrWallet,
      });
      const found = queryDistribResult.total.find(
        (element) => element.denom === cosmosConfig[2].coinLookup.chainDenom,
      );
      let returnValue = "";
      if (queryDistribResult.total.length > 0) {
        returnValue = Number(found.amount / 1000000000000000000000000).toFixed(
          6,
        );
      } else {
        returnValue = 0;
      }

      let oldValue = this.totalRewards;
      this.totalMyValidators = queryDistribResult.rewards.length;
      this.totalDelegationsRewards = queryDistribResult.rewards;
      this.totalRewards = returnValue;
      this.totalRewardsTime = {
        old: oldValue,
        new: returnValue,
      };

      const queryWithdrawAddressResult =
        await queryDistrib.DelegatorWithdrawAddress({
          delegatorAddress: addrWallet,
        });
      this.myDelegatorWithdrawAddress =
        queryWithdrawAddressResult.withdrawAddress;
    },

    async getDelegations(addrWallet) {
      const getDelegations = await axios(
        cosmosConfig[2].apiURL +
          "/cosmos/distribution/v1beta1/delegators/" +
          addrWallet +
          "/rewards",
      );
      const getUnDelegations = await axios(
        cosmosConfig[2].apiURL +
          "/cosmos/staking/v1beta1/delegators/" +
          addrWallet +
          "/unbonding_delegations",
      );
      const getRedelegations = await axios(
        cosmosConfig[2].apiURL +
          "/cosmos/staking/v1beta1/delegators/" +
          addrWallet +
          "/redelegations",
      );
      for (let i of getDelegations.data.rewards) {
        if (i.reward.length > 0) {
          //i.amount = (i.reward[0].amount / 1000000).toFixed(6);
          //delete i.reward;
          i.reward = (i.reward[0].amount / 1000000).toFixed(6);
          this.allAddressDelegations.push(i);
        }
      }
      var result = this.allAddressDelegations.sort(function (a, b) {
        return a.reward - b.reward;
      });
      this.allAddressDelegations = result.reverse();
    },
    async getAddressTx(addrWallet, page) {
      const getRecipient = await axios(
        cosmosConfig[2].apiURL +
          "/cosmos/tx/v1beta1/txs?events=transfer.recipient=%27" +
          addrWallet +
          "%27&page=" +
          page +
          "&limit=10&order_by=2",
      );
      console.log("getRecipient", getRecipient.data);

      for (let i of getRecipient.data.tx_responses) {
        console.log("test", i);
        i.txhash = i.txhash;
        i.height = i.height;
        i.timestamp = i.timestamp;
        i.type = setMsg(i.tx.body.messages[0]["@type"]);
        i.memo = i.tx.body.memo;
        i.success = i.code === 0 ? "Success" : "Failed";
      }

      this.allAddressTx = getRecipient.data.tx_responses;
      this.totalAddressTx = getRecipient.data.total;
    },
    async getAllValidators() {
      let getAllValidators = await fetch(
        cosmosConfig[2].apiURL +
          "/cosmos/staking/v1beta1/validators?pagination.limit=500&status=BOND_STATUS_BONDED",
      );
      const getInflation = await axios(
        cosmosConfig[2].apiURL + "/cosmos/mint/v1beta1/inflation",
      );
      const allsupply = await axios(
        cosmosConfig[2].apiURL +
          `/cosmos/bank/v1beta1/supply/by_denom?denom=ubcna`,
      );
      const totalBounded = await axios(
        cosmosConfig[2].apiURL + `/cosmos/staking/v1beta1/pool`,
      );

      let getValidators = await getAllValidators.json();

      this.allsupply = allsupply.data.amount.amount;
      this.inflation = getInflation.data.inflation;
      this.totalBounded = totalBounded.data.pool.bonded_tokens;

      this.allValidators = getValidators.validators;
      this.countAllValidators = getValidators.validators.length;

      const queryStaking = new staking.QueryClientImpl(this.rpcClient);
      let allValidators = await queryStaking.Validators({
        status: "BOND_STATUS_BONDED",
      });
      this.allValidatorsRpc = allValidators.validators;

      var totalTokenBondedPc = this.totalBounded / 1000000;
      var cumulativeShare = 0;

      var result = this.allValidatorsRpc.sort(function (a, b) {
        return a.delegatorShares - b.delegatorShares;
      });

      for (let item of result.reverse()) {
        try {
          item.votingPowerPc = (
            ((item.tokens / 1000000) * 100) /
            totalTokenBondedPc
          ).toFixed(2);
          cumulativeShare += item.tokens / 1000000;
          item.votingPowerCumulative = (
            ((cumulativeShare + item.tokens) * 100) /
            totalTokenBondedPc
          ).toFixed(2);
          item.valApr =
            ((((this.allsupply / 1000000) *
              this.inflation *
              item.votingPowerPc) /
              100) *
              (100 -
                item.commission.commissionRates.rate / 10000000000000000)) /
            (item.tokens / 1000000);
        } catch (error) {
          console.error(error);
        }
      }

      //console.log(allValidators)
    },
    async getParams() {
      const getConfigMint = await axios(
        "https://lcd.bitcanna.io/cosmos/mint/v1beta1/params",
      );
      const getAnnualProvisions = await axios(
        "https://lcd.bitcanna.io/cosmos/mint/v1beta1/annual_provisions",
      );
      const getInflation = await axios(
        "https://lcd.bitcanna.io/cosmos/mint/v1beta1/inflation",
      );
      const getStakingParams = await axios(
        "https://lcd.bitcanna.io/cosmos/staking/v1beta1/params",
      );
      const getGovParamsVote = await axios(
        "https://lcd.bitcanna.io/cosmos/gov/v1beta1/params/voting",
      );
      const getGovParamsTallying = await axios(
        "https://lcd.bitcanna.io/cosmos/gov/v1beta1/params/tallying",
      );
      const getGovParamsDeposit = await axios(
        "https://lcd.bitcanna.io/cosmos/gov/v1beta1/params/deposit",
      );
      const getDistribParams = await axios(
        "https://lcd.bitcanna.io/cosmos/distribution/v1beta1/params",
      );
      const getSlashingParams = await axios(
        "https://lcd.bitcanna.io/cosmos/slashing/v1beta1/params",
      );

      let finalMint = [
        {
          mint: getConfigMint.data.params,
          annualProvisions:
            getAnnualProvisions.data.annual_provisions / 1000000,
          inflation: getInflation.data.inflation,
        },
      ];
      let finalStaking = [
        {
          staking: getStakingParams.data.params,
        },
      ];
      let finalGov = {
        voting: getGovParamsVote.data,
        tallying: getGovParamsTallying.data,
        deposit: getGovParamsDeposit.data,
      };

      this.mintParams = finalMint;
      this.stakingParams = finalStaking;
      this.govParams = finalGov;
      this.distribParams = getDistribParams.data.params;
      this.slashingParams = getSlashingParams.data.params;

      console.log("getSlashingParams", getSlashingParams.data.params);
    },

    async getDetailsValidator(address) {
      const querystaking = new staking.QueryClientImpl(this.rpcClient);
      let detailValidator = await querystaking.Validator({
        validatorAddr: address,
      });
      this.detailValidator = detailValidator.validator;

      let allValidatorDelegations = await querystaking.ValidatorDelegations({
        validatorAddr: address,
        pagination: {
          countTotal: false,
          key: "",
          offset: Long.fromNumber(0, true),
          limit: Long.fromNumber(200, true),
          reverse: false,
        },
      });

      for (let i of allValidatorDelegations.delegationResponses) {
        i.balance = (i.balance.amount / 1000000).toFixed(6);
        i.delegation = i.delegation.delegatorAddress;
      }

      this.allValidatorDelegations =
        allValidatorDelegations.delegationResponses;
    },
    async getProposalsConfig() {
      const queryProposals = new gov.QueryClientImpl(this.rpcClient);
      let allProposals = await queryProposals.Params({ paramsType: "voting" });
      this.allProposals = allProposals.proposals;
    },
  },
});
