<template>
  <v-card class="pa-4 d-flex justify-center flex-wrap" theme="dark">
    <v-container class="text-center">
      <v-row justify="center" dense>
        <!--         <v-col cols="12">
          <v-img
            class="mx-auto mt-12 mb-16"
            max-height="240"
            max-width="240"
            src="https://i.imgur.com/pjq59Yh.png"
          ></v-img>
        </v-col> -->

        <!--           <v-col cols="12">
            <v-autocomplete
              :items="items" 
              class="mx-auto"
              density="comfortable"
              menu-icon=""
              placeholder="Search coffee shop or cbd store"
              prepend-inner-icon="mdi-magnify"
              style="max-width: 450px;"
              theme="light"
              variant="solo"
              auto-select-first
              item-props
              rounded
            ></v-autocomplete>
          </v-col> -->

        <v-col v-for="(shortcut, i) in shortcuts" :key="i" cols="auto">
          <v-card
            class="pa-4"
            rel="noopener noreferer"
            target="_blank"
            width="112"
            flat
            @click="selectCountry(shortcut.id)"
          >
            <v-avatar>
              <v-img alt="John" :src="shortcut.img"></v-img>
            </v-avatar>
            <!--               <v-avatar :icon="shortcut.icon" class="mb-2" color="white" variant="tonal"></v-avatar>
   -->
            <div
              class="text-caption text-truncate"
              v-text="shortcut.title"
            ></div>
          </v-card>
        </v-col>

        <v-col cols="auto">
          <v-dialog v-model="dialog" max-width="500">
            <template v-slot:activator="{ props }">
              <v-card v-bind="props" class="pa-4" width="112" flat>
                <v-avatar
                  class="mb-2"
                  color="white"
                  icon="mdi-plus"
                  variant="tonal"
                ></v-avatar>

                <div class="text-caption text-truncate">Add store</div>
              </v-card>
            </template>

            <v-card rounded="lg" title="Add shortcut">
              <template v-slot:text>
                <v-label class="text-caption">Name</v-label>

                <v-text-field
                  density="compact"
                  variant="solo-filled"
                  flat
                ></v-text-field>

                <v-label class="text-caption">URL</v-label>

                <v-text-field
                  density="compact"
                  variant="solo-filled"
                  flat
                ></v-text-field>
              </template>

              <div class="py-4 px-5 text-end">
                <v-btn
                  class="text-none me-2"
                  color="blue"
                  text="Cancel"
                  variant="text"
                  border
                  @click="dialog = false"
                ></v-btn>

                <v-btn
                  class="text-none"
                  color="blue"
                  text="Done"
                  variant="flat"
                  @click="dialog = false"
                ></v-btn>
              </div>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <!--   <v-data-iterator
    :items="allStores"
    :page="page"
    class="mt-4"
    items-per-page="100"
  >
    <template v-slot:default="{ items }">
      <template v-for="(item, i) in items" :key="i">
 
        <v-card
          class="mx-auto"
          prepend-icon="$vuetify"
          :subtitle="item.raw.description"
        >
          <template v-slot:title>
            <span class="font-weight-black">{{ item.raw.title }}</span>
          </template>

          <v-card-text class="bg-surface-light pt-4">
            {{ item.raw.description }} {{ item.raw }}
          </v-card-text>
        </v-card>
        <br />
      </template>
    </template>
  </v-data-iterator> -->

  <v-card class="mt-4">
    <v-data-iterator :items="allStores" :items-per-page="6" :search="search">
      <template v-slot:header>
        <v-toolbar class="px-2">
          <v-text-field
            v-model="search"
            density="comfortable"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 500px"
            variant="solo"
            clearable
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:default="{ items }">
        <v-container class="pa-2" fluid>
          <v-row dense>
            <v-col v-for="item in items" :key="item.title" cols="auto" md="4">
              <v-card
                :disabled="loading"
                :loading="loading"
                class="mx-auto my-12"
                border
              >
                <template v-slot:loader="{ isActive }">
                  <v-progress-linear
                    :active="isActive"
                    color="deep-purple"
                    height="4"
                    indeterminate
                  ></v-progress-linear>
                </template>

                <v-img
                  class="align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.7)"
                  height="250"
                  :src="banner"
                  cover
                >
                  <v-card-title class="text-white">
                    <v-avatar class="mr-2" rounded="0">
                      <v-img
                        v-if="item.raw.country === 'france'"
                        :alt="item.raw.country"
                        src="https://flagsapi.com/FR/shiny/64.png"
                      />
                      <v-img
                        v-if="item.raw.country === 'spain'"
                        :alt="item.raw.country"
                        src="https://flagsapi.com/ES/shiny/64.png"
                      />
                    </v-avatar>
                  </v-card-title>
                </v-img>

                <v-card-item>
                  <v-card-title>{{ item.raw.title }}</v-card-title>
                </v-card-item>

                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :model-value="item.raw.rating"
                      color="amber"
                      density="compact"
                      size="small"
                      half-increments
                      readonly
                    ></v-rating>

                    <div class="text-grey ms-4">
                      4.5 ({{ item.raw.reviews }})
                    </div>
                  </v-row>

                  <div class="mt-4 text-subtitle-1 text-capitalize">
                    {{ item.raw.country }}, {{ item.raw.city }}
                  </div>
                  {{ item.raw.address }}

                  <div v-if="item.raw.service_options">
                    <span
                      class="d-inline-block text-truncate"
                      style="max-width: 350px"
                    >
                      {{ item.raw.service_options }}
                    </span>
                  </div>
                  <div v-else>
                    <br />
                  </div>
                </v-card-text>

                <v-divider class="mx-4 mb-1"></v-divider>

                <v-card-title>Availability</v-card-title>

                <div class="px-4 mb-2">
                  {{ item.raw.description }}
                </div>

                <v-card-actions>
                  <v-btn
                    color="deep-purple-lighten-2"
                    text="Reserve"
                    block
                    border
                    @click="reserve"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            :disabled="page === 1"
            density="comfortable"
            icon="mdi-arrow-left"
            variant="tonal"
            rounded
            @click="prevPage"
          ></v-btn>

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn
            :disabled="page >= pageCount"
            density="comfortable"
            icon="mdi-arrow-right"
            variant="tonal"
            rounded
            @click="nextPage"
          ></v-btn>
        </div>
      </template>
    </v-data-iterator>
  </v-card>
</template>
<script>
import {
  CosmWasmClient,
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from "@cosmjs/cosmwasm-stargate";

import banner from "@/assets/canna-banner.jpeg";

export default {
  data: () => ({
    contractAddress:
      "bcna1zydegef0z6lz4gamamzlnu52ethe8xnm0xe5fkyrgwumsh9pplusyspyq6",
    banner,
    dialog: false,
    client: null,
    allStores: [],
    page: 1,
    items: [
      {
        prependIcon: "mdi-clock-outline",
        title: "recipe with chicken",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!",
      },
      {
        prependIcon: "mdi-clock-outline",
        title: "best hiking trails near me",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!",
      },
      {
        prependIcon: "mdi-clock-outline",
        title: "how to learn a new language",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!",
      },
      {
        prependIcon: "mdi-clock-outline",
        title: "DIY home organization ideas",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!",
      },
      {
        prependIcon: "mdi-clock-outline",
        title: "latest fashion trends",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!",
      },
    ],
    shortcuts: [
      {
        id: "france",
        title: "French",
        img: "https://flagsapi.com/FR/shiny/64.png",
        href: "https://github.com/vuetifyjs/vuetify",
      },
      {
        id: "spain",
        title: "Spain",
        img: "https://flagsapi.com/ES/shiny/64.png",
        href: "https://github.com/vuetifyjs/vuetify/tree/dev",
      },
      {
        id: "netherlands",
        title: "Netherlands",
        img: "https://flagsapi.com/NL/shiny/64.png",
        href: "https://github.com/vuetifyjs/vuetify/tree/v2-stable",
      },
      {
        id: "germany",
        title: "Germany",
        img: "https://flagsapi.com/DE/shiny/64.png",
        href: "https://github.com/vuetifyjs/vuetify/pulls/johnleider",
      },
    ],

    search: "",
    games: [
      {
        img: "https://cdn.vuetifyjs.com/docs/images/graphics/games/4.png",
        title: "The Sci-Fi Shooter Experience",
        subtitle:
          "Dive into a futuristic world of intense battles and alien encounters.",
        advanced: false,
        duration: "8 minutes",
      },
      {
        img: "https://cdn.vuetifyjs.com/docs/images/graphics/games/2.png",
        title: "Epic Adventures in Open Worlds",
        subtitle:
          "Embark on a journey through vast, immersive landscapes and quests.",
        advanced: true,
        duration: "10 minutes",
      },
      {
        img: "https://cdn.vuetifyjs.com/docs/images/graphics/games/3.png",
        title: "Surviving the Space Station Horror",
        subtitle:
          "Navigate a haunted space station in this chilling survival horror game.",
        advanced: false,
        duration: "9 minutes",
      },
      {
        img: "https://cdn.vuetifyjs.com/docs/images/graphics/games/5.png",
        title: "Neon-Lit High-Speed Racing Thrills",
        subtitle:
          "Experience adrenaline-pumping races in a futuristic, neon-soaked city.",
        advanced: true,
        duration: "12 minutes",
      },
      {
        img: "https://cdn.vuetifyjs.com/docs/images/graphics/games/6.png",
        title: "Retro-Style Platformer Adventures",
        subtitle:
          "Jump and dash through pixelated worlds in this classic-style platformer.",
        advanced: false,
        duration: "11 minutes",
      },
      {
        img: "https://cdn.vuetifyjs.com/docs/images/graphics/games/7.png",
        title: "Medieval Strategic War Campaigns",
        subtitle:
          "Lead armies into epic battles and conquer kingdoms in this strategic game.",
        advanced: true,
        duration: "10 minutes",
      },
      {
        img: "https://cdn.vuetifyjs.com/docs/images/graphics/games/1.png",
        title: "Underwater VR Exploration Adventure",
        subtitle:
          "Dive deep into the ocean and discover the mysteries of the underwater world.",
        advanced: true,
        duration: "11 minutes",
      },
      {
        img: "https://cdn.vuetifyjs.com/docs/images/graphics/games/8.png",
        title: "1920s Mystery Detective Chronicles",
        subtitle:
          "Solve crimes and uncover secrets in the glamourous 1920s era.",
        advanced: false,
        duration: "9 minutes",
      },
    ],
  }),
  async mounted() {
    //this.$store.dispatch('fetchItems');
    const client = await CosmWasmClient.connect(
      "https://rpc-devnet-6.bitcanna.io",
    );
    const result = await client.queryContractSmart(this.contractAddress, {
      stores_list: {
        start_after: 0,
        limit: 100,
      },
    });
    this.allStores = result.entries;
    console.log(result);
  },
  methods: {
    async selectCountry(country) {
      console.log("Selected country:", country);
      const client = await CosmWasmClient.connect(
        "https://rpc-devnet-6.bitcanna.io",
      );
      const result = await client.queryContractSmart(this.contractAddress, {
        stores_list_debug: {
          country: country,
        },
      });
      this.allStores = result.entries;
      console.log(result);
    },
  },
};
</script>
