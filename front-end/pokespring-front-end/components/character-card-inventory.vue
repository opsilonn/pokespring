<template>
  <v-container>
    <!-- Data table to display the inventory -->
    <v-data-table
      fixed-header
      :headers="headers()"
      :items="inventory"
      :hide-default-footer="true"
      sort-by="name"
    >
      <!-- Slot for the 'weightTotal' field -->
      <template v-slot:[`item.weightTotal`]="{ item }">
        {{ item.number * item.weight }}
      </template>

      <!-- Slot for the 'actions' field -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Action to edit the item -->
        <v-icon color="primary" small @click="dialogItemOpen(item)">
          mdi-pencil
        </v-icon>

        <!-- Action to delete the item -->
        <v-icon color="error" small @click="dialogDeleteOpen(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Dialog to add a new item -->
    <v-dialog
      v-if="isModifying"
      v-model="dialogItem"
      max-width="500px"
      persistent
    >
      <!-- Dialog's trigger -->
      <template v-slot:activator="{ on, attrs }">
        <center class="pa-8">
          <v-btn
            color="primary"
            outlined
            class="mb-2"
            v-bind="attrs"
            v-on="on"
            @click="dialogItemOpen(undefined)"
          >
            New Item
          </v-btn>
        </center>
      </template>

      <!-- What to display if there no data in the table -->
      <template v-slot:no-data>
        <h2 class="pa-4">
          Sorry, it seems there is no item in your inventory :(
        </h2>
      </template>

      <!-- Dialog -->
      <v-card>
        <v-card-title>
          <span class="headline">New Item</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="formInventory" v-model="formInventory">
              <!-- Inputs for the new item -->
              <v-row>
                <!-- New item : name -->
                <v-col cols="12">
                  <v-text-field
                    v-model="item.name"
                    label="Name"
                    :rules="[rules.required]"
                  />
                </v-col>

                <!-- New item : description -->
                <v-col cols="12">
                  <v-textarea
                    v-model="item.description"
                    label="Description"
                    :rules="[rules.required]"
                    :placeholder="item.description || 'Please write the description of your item !'"
                    outlined
                    auto-grow
                    rows="2"
                  />
                </v-col>

                <!-- New item : number -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="item.number"
                    label="Number"
                    :rules="[rules.required]"
                    type="number"
                  />
                </v-col>

                <!-- New item : weight -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="item.weight"
                    label="Weight"
                    :rules="[rules.required]"
                    type="number"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <!-- Divider -->
        <v-divider />

        <v-card-actions>
          <v-spacer />
          <!-- Button to cancel the new item -->
          <v-btn class="zoom-sm ma-8" color="warning" text @click="dialogItem = false">
            Cancel
          </v-btn>

          <!-- Button to save the new item -->
          <v-btn class="zoom-sm ma-8" color="success" text @click="dialogItemConfirm">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog to delete an item -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <!-- Title -->
        <v-card-title class="headline">
          Are you sure you want to delete this item ?
        </v-card-title>

        <!-- Buttons -->
        <v-card-actions>
          <v-spacer />
          <!-- Cancel deletion -->
          <v-btn class="zoom-sm ma-8" color="warning" outlined @click="dialogDelete = false">
            Cancel
          </v-btn>

          <!-- Confirm deletion -->
          <v-btn class="zoom-sm ma-8" color="error" outlined @click="dialogDeleteConfirm">
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// Imports
import { mapActions } from 'vuex'
import MixinRules from '@/mixins/mixin-rules'
const lodash = require('lodash')

export default {
  name: 'CharacterCardInventory',

  mixins: [MixinRules],

  props: {
    isModifying: {
      type: Boolean,
      required: true,
      default: false
    },
    inventory: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  data: () => ({
    // Whether the form to add a dialog is valid or not
    formInventory: false,

    // Whether the dialogs are active or not
    dialogItem: false,
    dialogDelete: false,

    itemIndex: -1,
    deleteId: -1,
    item: {},
    defaultItem: {
      name: '',
      description: '',
      number: undefined,
      weight: undefined
    }
  }),

  computed: {
    /** Return the id of the Character, if he has one */
    idCharacter () {
      return (this.isNewCharacter) ? undefined : parseInt(this.$route.params.idCharacter)
    }
  },

  methods: {
    ...mapActions('inventory', ['addInventory', 'deleteInventory', 'putInventory']),

    /**
     * Headers for the data table
     */
    headers () {
      // We define an array
      const headerArray = [
        { text: 'Name', value: 'name', align: 'center' },
        { text: 'Description', value: 'description', align: 'center' },
        { text: 'Number', value: 'number', align: 'center' },
        { text: 'weight', value: 'weight', align: 'center' },
        { text: 'Total weight', value: 'weightTotal', align: 'center' }
      ]

      // We add the 'action' slot if the user is modifying
      if (this.isModifying) {
        headerArray.push({ text: 'Actions', value: 'actions', align: 'center', sortable: false })
      }

      // We return the array
      return headerArray
    },

    /**
     * Method for when the Dialog to add an item is to be opened
     * @param {} itemReceived Item to (maybe ?) add
     */
    dialogItemOpen (itemReceived) {
      // If allowed to, we reset the form
      if (this.$refs.formInventory !== undefined) {
        this.$refs.formInventory.resetValidation()
      }

      // If the item received is not undefined : set the template with it
      // Otherwise : default template
      if (itemReceived !== undefined) {
        // We set the item's values
        this.item = lodash.cloneDeep(itemReceived)
        this.itemIndex = this.inventory.findIndex(i => i.id === itemReceived.id)
      } else {
        // We reset the item template
        this.item = lodash.cloneDeep(this.defaultItem)
        this.itemIndex = -1
      }

      // We open the Add dialog
      this.dialogItem = true
    },

    /**
     * Method for when the Dialog to add / modify an item is validated
     */
    async dialogItemConfirm () {
      // If the form is valid
      if (this.$refs.formInventory.validate()) {
        // We add the ID of the user
        this.item.idCharacter = this.idCharacter

        // Depending on the situation, either PUT or POST
        if (this.itemIndex >= 0) {
          // Modify
          await this.putInventory({ id: this.item.id, inventory: this.item })
        } else {
          // Add
          await this.addInventory(this.item)
        }

        // We close the Add dialog
        this.dialogItem = false
      }
    },

    /**
     * Method for when the Dialog to delete an item is to be opened
     * @param {} item Item to (maybe ?) delete
     */
    dialogDeleteOpen (item) {
      // We set the index of the item to delete
      this.deleteId = item.id

      // We open the Delete dialog
      this.dialogDelete = true
    },

    /**
     * Method for when the Dialog to delete an item is validated
     */
    async dialogDeleteConfirm () {
      // We remove the item to delete
      await this.deleteInventory(this.deleteId)

      // Just in case, we reset the id
      this.deleteId = -1

      // We close the Delete dialog
      this.dialogDelete = false
    }
  }
}
</script>
