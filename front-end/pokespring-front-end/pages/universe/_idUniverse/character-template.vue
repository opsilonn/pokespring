<template>
  <v-container>
    <!-- when loading : progress-bar -->
    <CustomProgressBar v-if="isLoading" message="Loading the character's sheet..." />

    <!-- after loading : display the template -->
    <v-form v-else ref="form" v-model="validForm">
      <!-- Buttons for modifications -->
      <ButtonsChanges
        v-if="bIsGM"
        :is-modifying="isModifying"
        text-activate="Modify the template"
        :activate="activateChanges"
        :discard="discardChanges"
        :validate="saveChanges"
      />

      <!-- Card containing all data about the character -->
      <v-card shaped>
        <!-- Title for all the essential data about the character -->
        <v-container class="pa-4">
          <v-row>
            <!-- Image on the left -->
            <v-col class="pa-4" cols="12" lg="4">
              <!-- Container with fill-height to vertically center the image -->
              <v-container class="pa-4" fill-height>
                <!-- small image for small screens -->
                <v-img
                  class="shrink d-flex d-sm-none"
                  min-height="150"
                  max-height="150"
                  lazy-src="/logo.png"
                  src="https://blog.headway-advisory.com/wp-content/uploads/2018/01/fmeunier_paris-1024x1024.jpeg"
                  contain
                />

                <!-- big image for bigger screens -->
                <v-img
                  class="shrink d-none d-sm-flex"
                  min-height="350"
                  max-height="350"
                  lazy-src="/logo.png"
                  src="https://blog.headway-advisory.com/wp-content/uploads/2018/01/fmeunier_paris-1024x1024.jpeg"
                />
              </v-container>
            </v-col>

            <!-- Inputs on the right -->
            <v-col cols="12" lg="8">
              <!-- Container with fill-height to vertically center the content -->
              <v-container class="pa-4" fill-height>
                <!-- A text to present the 1st category -->
                <v-container>
                  <h3 class="text-center pa-4">
                    Here is the <span class="font-weight-bold primary--text">'Essential'</span> category : each character's sheet needs it
                  </h3>
                </v-container>

                <!-- Form to add inputs for essential stats -->
                <!-- Button to add numbered stat -->
                <v-container>
                  <v-btn
                    v-if="isModifying"
                    class="ma-2 primary--text"
                    outlined
                    @click="addStat(statsEssential.id, true)"
                  >
                    Add numbered stat
                  </v-btn>
                </v-container>

                <!-- The inputs for numbered stats -->
                <v-row>
                  <v-col
                    v-for="item in statsEssential.stats.list.filter((c) => c.bIsNumber)"
                    :key="item.id"
                    cols="12"
                    sm="6"
                    md="3"
                  >
                    <v-text-field
                      v-model="item.name"
                      :label="item.name.length === 0 ? 'statistic\'s name' : ''"
                      :rules="[rules.required, rules.maxSmall]"
                      :disabled="!isModifying"
                      append-icon="mdi-delete"
                      class="ma-4"
                      type="text"
                      @click:append="deleteStat(statsEssential.id, item.id)"
                    />
                  </v-col>
                </v-row>

                <!-- Button to add alphabetic stat -->
                <v-container>
                  <v-btn
                    v-if="isModifying"
                    class="ma-2 primary--text"
                    outlined
                    @click="addStat(statsEssential.id, false)"
                  >
                    Add alphabetic stat
                  </v-btn>
                </v-container>

                <!-- The inputs for numbered stats -->
                <v-row>
                  <v-col
                    v-for="item in statsEssential.stats.list.filter((c) => !c.bIsNumber)"
                    :key="item.id"
                    cols="12"
                    sm="6"
                    md="3"
                  >
                    <v-text-field
                      v-model="item.name"
                      :label="item.name.length === 0 ? 'statistic\'s name' : ''"
                      :rules="[rules.required, rules.maxSmall]"
                      :disabled="!isModifying"
                      append-icon="mdi-delete"
                      class="ma-4"
                      type="text"
                      @click:append="deleteStat(statsEssential.id, item.id)"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-divider class="ma-12" />

      <v-card shaped>
        <!-- Tabs for each data about the character -->
        <v-tabs
          v-model="tab"
          grow
          icons-and-text
          center-active
          centered
        >
          <v-tab
            v-for="(item, i) in tabItems"
            :key="i"
            exact
          >
            <span class="shrink d-none d-sm-flex">{{ item.title }}</span>
            <v-icon>{{ item.icon }}</v-icon>
          </v-tab>
        </v-tabs>

        <!-- Tabs -->
        <v-tabs-items v-model="tab">
          <!-- Tab n° 1 - Statistics -->
          <v-tab-item>
            <CharacterTemplateNewCategory
              :categories="statsRegular"
              :is-modifying="isModifying"
              :b-is-special="false"
              :add-category="addCategory"
              :delete-category="deleteCategory"
              :add-stat="addStat"
              :delete-stat="deleteStat"
            />
          </v-tab-item>

          <!-- Tab n° 2 - Special -->
          <v-tab-item>
            <v-container>
              <!-- A switch to (dis)able the special in this template -->
              <div class="d-flex justify-center">
                <v-switch
                  v-model="hasMagic"
                  inset
                  label="Do the characters have access to special stats ?"
                />
              </div>

              <!-- The creator of category, if the template has special -->
              <CharacterTemplateNewCategory
                v-if="hasMagic"
                :categories="statsSpecial"
                :is-modifying="isModifying"
                :b-is-special="true"
                :add-category="addCategory"
                :delete-category="deleteCategory"
                :add-stat="addStat"
                :delete-stat="deleteStat"
              />
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
// Imports
import MixinRules from '@/mixins/mixin-rules'
import ButtonsChanges from '@/components/buttons-changes'
import CharacterTemplateNewCategory from '@/components/character-template-new-category'
import CustomProgressBar from '@/components/custom-progress-bar'
import { mapState, mapGetters, mapActions } from 'vuex'
const lodash = require('lodash')

export default {
  name: 'PageCharacterTemplate',

  components: {
    ButtonsChanges,
    CharacterTemplateNewCategory,
    CustomProgressBar
  },

  mixins: [MixinRules],

  data: () => ({
    // Some booleans
    hasMagic: false,
    isAdmin: false,
    isLoading: true,
    isModifying: false,

    // Whether the form is valid or not
    validForm: false,

    // Error message, if the template contains an error
    errorMessage: '',
    errorIsActive: false,

    // Counter for both categories and statistics, which starts at the smallest negative number
    idCpt: -1,

    // Tab currently selected on the menu
    tab: null,
    tabItems: [
      {
        title: 'Statistics',
        icon: 'mdi-counter'
      },
      {
        title: 'Special',
        icon: 'mdi-wizard-hat'
      }
    ],

    // TEMPORARY - arrays to contain some data
    // A new Stat array is initiated as follow (only has 1 category, the 'Essential', which is required)
    categoriesPlaceholder: []
  }),

  computed: {
    // imports
    ...mapState('auth', ['connectedUser']),

    ...mapGetters('templateCategory', ['getTemplateCategories']),
    ...mapGetters('templateStat', ['getTemplateStats']),

    /** Category (the first in order) containing all Essential stats */
    statsEssential () {
      return this.categoriesPlaceholder[0]
    },

    /** Category (the first in order) containing all Essential stats */
    statsNonEssential () {
      return this.categoriesPlaceholder.slice(1, this.categoriesPlaceholder.length) || []
    },

    /** Categories of stats that are neither Magic nor Essential */
    statsRegular () {
      return this.statsNonEssential.filter(category => !category.bIsSpecial)
    },

    /** Categories of stats that are Magic */
    statsSpecial () {
      return this.statsNonEssential.filter(category => category.bIsSpecial)
    },

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || undefined
    },

    /** Categories of stats (if empty, return with a 1st predefined category) */
    categories () {
      return this.getTemplateCategories()
    },

    /** Whether the user is a Game Master for this universe */
    bIsGM () {
      if (!this.connectedUser) { return false }
      const universe = this.connectedUser.universesPlays.find(_ => _.id === this.idUniverse)
      if (!universe) { return false }
      return universe.bIsGM
    }
  },

  async mounted () {
    // We get the template of a character's stats in this universe
    await this.fetchTemplateCategorywithTemplateStat(this.idUniverse)

    // We set the placeholder
    this.categoriesPlaceholder = lodash.cloneDeep(this.categories)

    // We consider the loading done
    this.isLoading = false
  },

  methods: {
    // imports
    ...mapActions('templateCategory', ['fetchTemplateCategorywithTemplateStat', 'addTemplateCategory', 'putTemplateCategory', 'deleteTemplateCategory']),
    ...mapActions('templateStat', ['putTemplateStat', 'addTemplateStat', 'deleteTemplateStat']),

    /** Activate the changes to the template */
    activateChanges () {
      // We start the modification
      this.isModifying = true
    },

    /** Discard the changes brought to the template */
    discardChanges () {
      // We end the modification
      this.isModifying = false

      // We reset the placeholder
      this.categoriesPlaceholder = lodash.cloneDeep(this.categories)
    },

    /** Save the changes brought to the template */
    async saveChanges () {
      // If the form is valid
      if (this.$refs.form.validate()) {
        // FIRST - we select the categories to remove
        const cats = this.categories.filter(cat => !this.categoriesPlaceholder.some(_ => _.id === cat.id))

        // For each category to remove, we send a request to the server
        let promises = cats.map(_ => this.deleteTemplateCategory(_.id))

        // We wait for all the promises to work
        await Promise.all(promises).then(async () => {
          // SECOND - we modify / update all the categories
          promises = this.categoriesPlaceholder.map(_ => (_.id < 0) ? this.addTemplateCategory(_) : this.putTemplateCategory({ id: _.id, template: _ }))

          // We wait for all the promises to work
          await Promise.all(promises).then(async () => {
            // THIRD - we remove all deleted stats
            // We reset the promises
            promises = []

            // We iterate through the categories
            for (const category of this.categories) {
              // We get the category from the placeholder
              const cat = this.categoriesPlaceholder.find(_ => _.id === category.id)

              // If found :
              if (cat !== undefined) {
                // We get the stats that were removed
                const stats = category.stats.list.filter(stat => !cat.stats.list.some(_ => _.id === stat.id))

                // We add to the promises to the list
                promises = promises.concat(stats.map(_ => this.deleteTemplateStat(_.id)))
              }
            }

            // We wait for all the promises to work
            await Promise.all(promises).then(async () => {
              // FOURTH - we modify / update all the remaining stats
              // We reset the promises
              promises = []

              // We iterate through the categories
              for (const category of this.categoriesPlaceholder) {
                // We add the promises for all stats (either new or modified)
                promises = promises.concat(category.stats.list.map(_ => (_.id < 0) ? this.addTemplateStat(_) : this.putTemplateStat({ id: _.id, template: _ })))

                // We wait for all the promises to work
                await Promise.all(promises).then(() => {
                  // We end the modification
                  this.isModifying = false
                })
              }
            })
          })
        })
      }
    },

    /**
     * Adds a new Category to the character's card
     * @param {Boolean} bIsSpecial whether the new Category is a magic one or not
     */
    addCategory (bIsSpecial) {
      this.categoriesPlaceholder.push({
        name: '',
        id: this.idCpt--,
        bIsSpecial,
        order: null,
        idUniverse: this.idUniverse,
        stats: {
          list: []
        }
      })
    },

    /**
     * Deletes a Category of given id
     * @param {Int} idCategory position at which the category is located
     */
    deleteCategory (idCategory) {
      // We get the position of the category of given id
      const index = this.categoriesPlaceholder.findIndex(category => category.id === idCategory)

      // If found, we remove the Category
      if (index !== -1) {
        this.categoriesPlaceholder.splice(index, 1)
      }
    },

    /**
     * Adds a stat to the category of given id, and precises if it is a number or an alphabetic value
     * @param {Int} idCategory id of the category where the stat is located
     * @param {Boolean} bIsNumber whether the new stat is a number or not
     */
    addStat (idCategory, bIsNumber) {
      // We get the position of the category of given id
      const indexCategory = this.categoriesPlaceholder.findIndex(category => category.id === idCategory)

      // If found, we continue
      if (indexCategory !== -1) {
        this.categoriesPlaceholder[indexCategory].stats.list.push({
          name: '',
          value: (bIsNumber) ? 0 : '',
          bIsNumber,
          id: this.idCpt--,
          idTemplateCategory: idCategory
        })
      }
    },

    /**
     * Deletes a stat of the category of given index
     * @param {Int} idCategory position of the category where the stat is located
     * @param {Int} idStat id of the stat to delete
     */
    deleteStat (idCategory, idStat) {
      // We get the position of the category of given id
      const indexCategory = this.categoriesPlaceholder.findIndex(category => category.id === idCategory)

      // If found, we continue
      if (indexCategory !== -1) {
        // We get the position of the stat to delete
        const indexStat = this.categoriesPlaceholder[indexCategory].stats.list.findIndex(stat => stat.id === idStat)

        // If found, we remove the stat
        if (indexStat !== -1) {
          this.categoriesPlaceholder[indexCategory].stats.list.splice(indexStat, 1)
        }
      }
    }
  },

  head () {
    return { title: 'Character template' }
  }
}
</script>
