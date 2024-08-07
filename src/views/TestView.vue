<template>
    <v-row>
        <v-col cols="12" :width="height" :height="height">
            <v-card border rounded="lg">
            <v-card-title>
                <h1>Test View</h1>
            </v-card-title>
            <v-card-text>
                <p>This is a test view.</p>
            </v-card-text>
            </v-card>
        </v-col>
    </v-row>
<!--     <v-card :width="height" :height="height">
      ...
    </v-card> -->

    <v-row >
      <v-col
        v-for="n in 3"
        :key="n"
        cols="12"
        sm="4"
      >
        <v-sheet border rounded="lg" class="my-2 pa-2">
          One of three columns
        </v-sheet>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
    import { computed } from 'vue'
    import { useDisplay } from 'vuetify'
  
    const { name } = useDisplay()
  
    const height = computed(() => {
      // name is reactive and
      // must use .value
      console.log(name.value)
      switch (name.value) {
        case 'xs': return 220
        case 'sm': return 400
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
        case 'xxl': return 1200
      }
  
      return undefined
    })
  </script>