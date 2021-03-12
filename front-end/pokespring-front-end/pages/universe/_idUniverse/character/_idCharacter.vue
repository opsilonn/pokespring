<template>
  <v-container>
    <!-- when loading : progress-bar -->
    <CustomProgressBar v-if="isLoading" message="Loading the character's sheet..." />

    <v-form v-else ref="form" v-model="validForm">
      <!-- Status of the character's sheet -->
      <v-row align="center" justify="center">
        <v-col class="pa-4" cols="12" sm="6" md="4">
          <v-select
            v-model="selectedStatusTitle"
            :items="itemsStatus.map(item => item.title)"
            :disabled="!isUsersCharacter && !isAdmin"
            required
            prepend-icon="mdi-wrench"
            solo
            :color="selectedStatus.color"
            :item-color="selectedStatus.color"
            :class="'ma-4 ' + selectedStatus.color + '--text'"
            @change="changeStatus"
          />
        </v-col>
      </v-row>

      <!-- Card containing all data about the character -->
      <v-card shaped>
        <!-- Title for all the essential data about the character -->
        <v-container class="pa-4">
          <!-- Character's name -->
          <v-row align="center" justify="center">
            <v-col class="pa-4" cols="8" sm="6" md="4">
              <v-text-field
                v-model="characterPlaceholder.name"
                label="Character's name"
                prepend-icon="mdi-face"
                :rules="[rules.required, rules.maxSmall]"
                :disabled="!isModifying"
              />
            </v-col>
          </v-row>

          <v-row>
            <!-- Image on the left -->
            <v-col class="pa-4" cols="12" lg="4">
              <!-- Container with fill-height to vertically center the image -->
              <v-container class="pa-4">
                <div v-if="isModifying">
                  <ImageUploader
                    v-model="image"
                    :label="`character`"
                    :upload-to="`${urlOrigin}/api/v1/characters/${idCharacter}`"
                    upload-name="character-image"
                    :default-image="characterUri"
                    :max-height="200"
                    @error="uploadError = $event"
                  />
                </div>
                <div v-else>
                  <v-img
                    contain
                    :src="characterUri"
                    @load="replaceByDefault"
                  />
                </div>
              </v-container>
            </v-col>

            <!-- Inputs on the right -->
            <v-col cols="12" lg="8">
              <v-container>
                <!-- For each stat category, we add a card -->
                <CharacterCardStatisticCategory
                  :is-modifying="isModifying"
                  :category="statsEssential"
                  :is-highlighted="false"
                />
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-divider class="ma-12" />

      <!-- Tabs for each data about the character -->
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
            v-for="(item, i) in itemsTab"
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
            <CharacterCardStatistics :is-modifying="isModifying" :categories="statsRegular" />
          </v-tab-item>

          <!-- Tab n° 2 - Inventory -->
          <v-tab-item>
            <CharacterCardInventory :is-modifying="isModifying" :inventory="inventory" />
          </v-tab-item>

          <!-- Tab n° 3 - Magic (may be passed) -->
          <v-tab-item v-if="hasMagic">
            <CharacterCardMagic :is-modifying="isModifying" :categories="statsSpecial" />
          </v-tab-item>

          <!-- Tab n° 4 - BackStory -->
          <v-tab-item>
            <CharacterCardBackstory :is-modifying="isModifying" :backstory="characterPlaceholder.backstory" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>

      <!-- Buttons for modification -->
      <ButtonsChanges
        v-if="isUsersCharacter"
        :is-modifying="isModifying"
        text-activate="Modify the character"
        :activate="activateChanges"
        :discard="discardChanges"
        :validate="saveChanges"
      />
    </v-form>
  </v-container>
</template>

<script>
// Imports
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import MixinRules from '@/mixins/mixin-rules'
import MixinOrderByName from '@/mixins/mixin-order-by-name'
import CharacterCardStatistics from '@/components/character-card-statistics'
import CharacterCardInventory from '@/components/character-card-inventory'
import CharacterCardMagic from '@/components/character-card-magic'
import CharacterCardBackstory from '@/components/character-card-backstory'
import CustomProgressBar from '@/components/custom-progress-bar'
import ImageUploader from '@/components/image-uploader'
const lodash = require('lodash')

export default {
  name: 'PageCharacter',

  components: {
    CharacterCardStatistics,
    CharacterCardInventory,
    CharacterCardMagic,
    CharacterCardBackstory,
    CustomProgressBar,
    ImageUploader
  },

  mixins: [MixinRules, MixinOrderByName],

  data: () => ({
    // Whether the user is able to modify its data or not
    isModifying: false,
    hasMagic: true,
    isLoading: true,
    isAdmin: false,

    // Whether the form is valid or not
    validForm: false,

    // Data about the character to be STORED
    character: {
      name: '',
      stats: [],
      idUser: -1,
      bIsDead: 0,
      sheetStatus: 0
    },

    // Data about the character to be DISPLAYED
    characterPlaceholder: {
      name: '',
      bIsDead: 0,
      sheetStatus: 0,
      backstory: '',
      src: 'https://picsum.photos/500/300?image=1',
      stats: [
        {
          id: 0,
          name: '',
          order: 0,
          stats: [
            {
              id: 0,
              name: '',
              value: 0,
              bIsNumber: true,
              bIsRequired: true
            }
          ]
        }
      ]
    },

    // Status of the character's card
    selectedStatusTitle: 'Work In Progress',
    itemsAllStatus: [
      {
        title: 'Work In Progress',
        color: 'primary',
        isForAdmin: false
      },
      {
        title: 'Waiting Validation',
        color: 'warning',
        isForAdmin: false
      },
      {
        title: 'Refused',
        color: 'error',
        isForAdmin: true
      },
      {
        title: 'Validated',
        color: 'success',
        isForAdmin: true
      }
    ],

    // Whether the picture dialog is open or not
    dialogPicture: false,
    pictureSelected: '',
    pictures: [
      'https://qph.fs.quoracdn.net/main-qimg-4ab11fd74be31e6c46ee07a7de8a050c',
      'http://www.pokepedia.fr/images/thumb/7/70/Simiabraz-DP.png/250px-Simiabraz-DP.png',
      'http://images.wikia.com/es.pokemon/images/b/bb/Empoleon_%28dream_world%29.png'
    ],

    // Tab currently selected on the menu
    tab: null,

    image: null,
    urlOrigin: window.location.origin,
    onError: null
  }),

  computed: {
    ...mapState('auth', ['bIsConnected', 'connectedUser']),
    ...mapGetters('character', ['getCharacterByid']),
    ...mapGetters('inventory', ['getInventories']),
    ...mapGetters('templateCategory', ['getTemplateCategories']),
    ...mapGetters('templateStat', ['getTemplateStats']),
    ...mapGetters('user', ['getUser']),

    /** Items contained in the status widget */
    itemsStatus () {
      // We return the correct / reduced list
      // We get :
      // If item is not for admin, then it is for the character's owner
      // If item is for admin... then it is for admin :D
      // The current one
      return this.itemsAllStatus.filter(item => !item.isForAdmin === this.isUsersCharacter || item.isForAdmin === this.isAdmin || item.title === this.selectedStatusTitle)
    },

    /** Items Selected in the status widget */
    selectedStatus () {
      return this.itemsStatus.find(item => item.title === this.selectedStatusTitle)
    },

    /** Items contained in the tab */
    itemsTab () {
      const items = [
        {
          title: 'Statistics',
          icon: 'mdi-counter'
        },
        {
          title: 'Inventory',
          icon: 'mdi-bag-checked'
        },
        {
          title: 'Special',
          icon: 'mdi-wizard-hat'
        },
        {
          title: 'Backstory',
          icon: 'mdi-feather'
        }
      ]

      if (!this.hasMagic) {
        items.splice(2, 1)
      }

      return items
    },

    /** Category (the first in order) containing all Essential statCategories */
    statsEssential () {
      return this.characterPlaceholder.stats.length > 0 ? this.characterPlaceholder.stats[0] : { stats: [] }
    },

    /** Category containing non-Essential statCategories (all but the first) */
    statsNonEssential () {
      return this.characterPlaceholder.stats.length > 1 ? this.characterPlaceholder.stats.slice(1, this.characterPlaceholder.stats.length) : [{ stats: [] }]
    },

    /** Categories of statCategories that are neither Magic nor Essential */
    statsRegular () {
      return this.statsNonEssential.filter(category => !category.bIsSpecial) || []
    },

    /** Categories of statCategories that are Magic (but not Essential) */
    statsSpecial () {
      return this.statsNonEssential.filter(category => category.bIsSpecial) || []
    },

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || undefined
    },

    /** Return whether this page is for a new Character or not */
    isNewCharacter () {
      return this.$route.params.idCharacter === undefined
    },

    /** Return the id of the Character, if he has one */
    idCharacter () {
      return (this.isNewCharacter) ? undefined : parseInt(this.$route.params.idCharacter)
    },

    /** Returns whether the user is logged or not */
    isLogged () {
      return this.bIsConnected
    },

    /** Return the id of the Character, if he has one */
    isUsersCharacter () {
      return this.connectedUser.id !== -1 && this.connectedUser.id === this.character.idUser
    },

    /** Inventory of the character */
    inventory () {
      return this.getInventories() || []
    },

    characterUri () {
      if (this.onError !== null) {
        return this.onError
      }
      return parseInt(this.$route.params.idCharacter) > 0 ? `${this.urlOrigin}/back/universes/${this.idUniverse}/character/${this.idCharacter}/character.jpg#${this.character.uuid}` : ''
    }
  },

  watch: {
    // whenever the universe's id changes
    async idUniverse () {
      // Re-compute whether the user is an admin
      await this.setIsAdmin()
    },

    /** whenever the user's logged in / out */
    async isLogged () {
      // Re-compute whether the user is an admin
      await this.setIsAdmin()
    },

    image () {
      if (this.idCharacter <= 0) { return }

      this.updateUuid(this.idCharacter)
      this.character = this.getCharacterByid(this.idCharacter)
    }
  },

  async mounted () {
    // GOING FORWARD, we consider that this is a valid character in a valid universe

    // We initialize the value of the picture selected by the user
    this.pictureSelected = this.characterPlaceholder.src

    // We get the template of a character's stats in this universe
    await this.fetchTemplateCategorywithTemplateStat(this.idUniverse)
    const characterTemplateStats = this.getTemplateCategories()

    // If it is a new character :
    // we get the default template
    // the user can directly modify his data
    // Otherwise :
    // We get the character's data
    if (this.isNewCharacter) {
      this.isModifying = true
      this.character.idUser = this.connectedUser.id
    } else {
      // We fetch the character's own data
      await this.fetchCharacterWithStat(this.idCharacter)
      await this.fetchInventoryForCharacter(this.idCharacter)

      // We get the character's data
      this.character = this.getCharacterByid(this.idCharacter)
    }

    // We create a clone of the Template stats, which we will fill with the player's inputs (if any), or default
    const completeStats = lodash.cloneDeep(characterTemplateStats)

    // We fill the template with the data from the database
    completeStats.forEach((category) => {
      // We simplify the category we are browsing
      category.stats = category.stats.list

      // We get the matching category
      const categoryPlayer = this.character.stats.find(c => c.id === category.id)

      // we iterate through the stat of the category
      category.stats.forEach((stat) => {
        // We get the stat (from the player), if any
        const statPlayer = (categoryPlayer !== undefined) ? categoryPlayer.stats.find(s => s.id === stat.id) : undefined

        // We set the stat from the player, or its default value
        stat.value = (statPlayer !== undefined) ? statPlayer.value : (stat.bIsNumber) ? 0 : ''
      })
    })

    // We assign the COMPLETE STATS to the character
    this.character.stats = completeStats

    // We fill the placeholder
    this.initPlaceholder()

    // We set whether the user is admin or not
    await this.setIsAdmin()

    this.updateUuid(this.idCharacter)
    // We consider the loading done
    this.isLoading = false
  },

  methods: {
    ...mapActions('character', ['fetchCharacterWithStat', 'putCharacter', 'putSheetStatusForCharacter', 'putStatForCharacter']),
    ...mapActions('inventory', ['fetchInventoryForCharacter', 'putInventory']),
    ...mapActions('templateCategory', ['fetchTemplateCategoryForUniverse', 'fetchTemplateCategorywithTemplateStat']),
    ...mapActions('templateStat', ['fetchTemplateStatForCategory']),
    ...mapActions('user', ['fetchPlayersOfUniverse']),
    ...mapMutations('character', ['updateUuid']),

    replaceByDefault () {
      const image = new Image()
      image.onload = (e) => {
        if (e.originalTarget.width === 1 && e.originalTarget.height === 1) {
          this.onError = 'https://tse1.mm.bing.net/th?id=OIP.UYxX1vxsuqp7EKw6eFQr7QHaE8&pid=Api'
        }
      }
      image.src = this.characterUri
    },

    /** Initializes the placeholder */
    initPlaceholder () {
      // We fill the placeholder with the character's data
      this.characterPlaceholder = lodash.cloneDeep(this.character)

      // We set the status according to the placeholder
      this.selectedStatusTitle = this.itemsAllStatus[this.characterPlaceholder.sheetStatus].title
    },

    /** Saves a change to the character's status */
    changeStatus () {
      // We get the new status
      const newStatus = this.itemsAllStatus.findIndex(i => i.title === this.selectedStatusTitle)

      // We set the new status
      this.characterPlaceholder.sheetStatus = newStatus
      this.characterPlaceholder.sheetStatus = newStatus

      // We PUT the modification in the database
      this.putSheetStatusForCharacter({ id: this.idCharacter, sheetStatus: newStatus })
    },

    /** Activates the changes to the character card */
    activateChanges () {
      // We open the modifications
      this.isModifying = true
    },

    /** Discard the changes brought to the character card */
    discardChanges () {
      // We reset the placeholder
      this.initPlaceholder()

      // We close the modifications
      this.isModifying = false
    },

    /** Saves the changes brought to the character's sheet, IF VALID */
    async saveChanges () {
      // If the form is valid
      if (this.$refs.form.validate()) {
        // We modify the ACTUAL character's data
        this.character = lodash.cloneDeep(this.characterPlaceholder)

        // Now, we PUT all these data into the database
        // 1 - put the character
        await this.putCharacter({ character: this.character, id: this.idCharacter })

        // 2 - put the stat (we create a single array containing all stats)
        const stats = []
        this.character.stats.forEach(category => stats.push(...category.stats))
        await this.putStatForCharacter({ stats, id: this.idCharacter })

        // We close the modifications
        this.isModifying = false
      }
    },

    /** Sets whether the user is the admin of the current universe */
    async setIsAdmin () {
      // We check that the user is logged AND in a universe
      // Otherwise : always false
      if (this.isLogged) {
        // We get the user's reference from this universe
        await this.fetchPlayersOfUniverse(this.idUniverse)
        const user = this.getUser(this.connectedUser.id)

        // If found, we return whether he's a GM or not
        this.isAdmin = user !== undefined ? user.bIsGM : false
      } else {
        this.isAdmin = false
      }
    }
  },

  head () {
    return { title: (this.isNewCharacter) ? 'new character' : this.character.name }
  }
}
</script>
