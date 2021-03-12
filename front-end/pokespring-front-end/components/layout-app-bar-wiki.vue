<template>
  <div>
    <v-spacer />
    <v-tabs
      v-model="tab"
      grow
      center-active
      centered
    >
      <v-menu
        v-for="topic in topics"
        :key="topic.id"
        offset-y
        open-on-hover
        origin="center center"
        transition="scale-transition"
      >
        <!-- TRIGGER -->
        <template v-slot:activator="{ on, attrs }">
          <v-tab
            :to="`/universe/${idUniverse}/wiki/topic/${topic.id}`"
            router
            exact
            v-bind="attrs"
            v-on="on"
          >
            <span class="shrink d-none d-sm-flex">{{ topic.name }}</span>
          </v-tab>
        </template>

        <!--List (if any) -->
        <v-list v-if="getSubTopicsByTopic(topic.id).length > 0">
          <v-list-item
            v-for="subTopic in getSubTopicsByTopic(topic.id)"
            :key="subTopic.id"
            :to="`/universe/${idUniverse}/wiki/subTopic/${subTopic.id}`"
          >
            <v-list-item-title>{{ subTopic.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LayoutAppBarWiki',

  data () {
    return {
      tab: null
    }
  },

  computed: {
    ...mapGetters('topic', ['getTopicsByUniverse']),
    ...mapGetters('subTopic', ['getSubTopicsByTopic']),

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || null
    },
    topics () {
      return this.getTopicsByUniverse(this.idUniverse)
    }
  },

  async mounted () {
    await this.$store.dispatch('topic/fetchTopicsForUniverse', { idUniverse: this.idUniverse })

    await Promise.all(this.getTopicsByUniverse(this.idUniverse).map((_) => {
      this.$store.dispatch('subTopic/fetchSubTopicsForTopic', { idTopic: _.id })
    }))
  }
}
</script>
