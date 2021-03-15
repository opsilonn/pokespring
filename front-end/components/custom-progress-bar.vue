<template>
  <div class="text-center">
    <div>
      <v-progress-circular class="pa-16" color="secondary" :size="70" :width="8" indeterminate />
    </div>
    <h3 class="ma-8 secondary--text font-italic">
      {{ message }}
    </h3>
  </div>
</template>

<script>
export default {
  name: 'CustomProgressBar',

  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>
