<template>
  <div class="pa-16">
    <!-- Button to activate the modification -->
    <center v-if="!isModifying">
      <v-btn
        large
        outlined
        color="primary"
        class="ma-2 zoom-xs"
        @click="activate"
      >
        <v-icon
          left
          dark
        >
          mdi-wrench
        </v-icon>
        {{ textActivate }}
      </v-btn>
    </center>

    <!-- Button to discard / save the template -->
    <center v-else>
      <!-- Button to discard the template -->
      <v-btn
        large
        outlined
        color="error"
        class="ma-2 zoom-xs"
        @click="discard"
      >
        <v-icon
          left
          dark
        >
          mdi-delete
        </v-icon>
        Discard changes
      </v-btn>

      <!-- Button to save the template -->
      <v-btn
        large
        outlined
        color="success"
        class="ma-2 zoom-xs"
        @click="validate"
      >
        <v-icon
          left
          dark
        >
          mdi-check
        </v-icon>
        Save changes
      </v-btn>
    </center>
  </div>
</template>

<script>
export default {
  name: 'ButtonsChanges',

  props: {
    isModifying: {
      type: Boolean,
      required: true
    },
    textActivate: {
      type: String,
      required: true
    },
    activate: {
      type: Function,
      required: true
    },
    discard: {
      type: Function,
      required: true
    },
    validate: {
      type: Function,
      required: true
    }
  }
}
</script>
