<template> 
    <v-chip
      v-if="!textCopied"
      class="ml-2" 
      label 
      @click="copyCode"
    >
      <v-icon icon="mdi-content-copy"></v-icon> 
    </v-chip> 
    <v-chip 
      v-if="textCopied"
      label  
      color="success"
      class="ml-2"
    >
      <v-icon icon="mdi-check-bold"></v-icon> 
    </v-chip>  
</template>
<script>
export default {
  props: ['dataToClip'],
  data: (props) => ({
    props: props,
    textCopied: false
  }),
  methods: {
    async copyCode() {
      await navigator.clipboard.writeText(this.props.dataToClip);
      this.textCopied = true
      await this.sleep(1500); 
      this.textCopied = false
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }
}
</script>