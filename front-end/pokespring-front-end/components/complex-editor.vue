<template>
  <div class="editor">
    <v-card light>
      <v-banner rounded="0" dark elevation="17" single-line class="grey darken-4">
        <!-- eslint-disable-next-line vue/no-template-shadow -->
        <editor-menu-bar v-slot="{ commands, isActive }" dark :editor="editor">
          <div class="menubar">
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.bold() }"
              :outlined="isActive.bold()"
              color="grey darken-2"
              @click="commands.bold"
            >
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.italic() }"
              :outlined="isActive.italic()"
              color="grey darken-2"
              @click="commands.italic"
            >
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>
            <v-btn
              :class="{ 'is-active': isActive.underline() }"
              :outlined="isActive.underline()"
              color="grey darken-2"
              @click="commands.underline"
            >
              <v-icon>mdi-format-underline</v-icon>
            </v-btn>
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.strike() }"
              :outlined="isActive.strike()"
              color="grey darken-2"
              @click="commands.strike"
            >
              <v-icon>mdi-format-strikethrough-variant</v-icon>
            </v-btn>
            <v-divider vertical />
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 1 }) }"
              :outlined="isActive.heading({ level: 1 })"
              color="grey darken-2"
              @click="commands.heading({ level: 1 })"
            >
              H1
            </v-btn>
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 2 }) }"
              :outlined="isActive.heading({ level: 2 })"
              color="grey darken-2"
              @click="commands.heading({ level: 2 })"
            >
              H2
            </v-btn>
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 3 }) }"
              :outlined="isActive.heading({ level: 3 })"
              color="grey darken-2"
              @click="commands.heading({ level: 3 })"
            >
              H3
            </v-btn>
            <v-divider vertical />
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.bullet_list() }"
              :outlined="isActive.bullet_list()"
              color="grey darken-2"
              @click="commands.bullet_list()"
            >
              <v-icon> mdi-format-list-bulleted</v-icon>
            </v-btn>
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.ordered_list() }"
              :outlined="isActive.ordered_list()"
              color="grey darken-2"
              @click="commands.ordered_list()"
            >
              <v-icon> mdi-format-list-numbered-rtl</v-icon>
            </v-btn>
            <v-divider vertical />
            <v-btn
              class="menubar__button"
              color="grey darken-2"
              @click="showImagePrompt(commands.image)"
            >
              <v-icon> mdi-image</v-icon>
            </v-btn>
          </div>
        </editor-menu-bar>
      </v-banner>
      <editor-content
        ref="edit"
        v-model="value"
        class="editor__content"
        :editor="editor"
        :style="`min-height: ${minHeight}px; max-height: ${maxHeight}px; overflow-y: scroll; overflow-x: auto`"
      />
    </v-card>
  </div>
</template>
<script>
/* eslint-disable no-console */
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Bold, Italic, Underline, Heading, BulletList, ListItem, OrderedList, Strike, Image } from 'tiptap-extensions'
export default {

  name: 'ComplexEditor',

  components: {
    EditorContent,
    EditorMenuBar
  },

  props: {
    value: {
      type: String,
      required: false,
      default: null
    },
    minHeight: {
      type: String,
      required: false,
      default: '500'
    },
    maxHeight: {
      type: String,
      required: false,
      default: '500'
    }
  },

  data () {
    return {
      editor: null,
      isActive: false,
      source: '',
      localText: ''
    }
  },
  mounted () {
    this.editor = new Editor({
      content: this.value,
      extensions: [
        new Bold(),
        new Italic(),
        new Underline(),
        new Heading(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Strike(),
        new Image()
      ],
      onUpdate: ({ getHTML }) => {
      // get new content on update
        this.$emit('input', getHTML())
      }
    })
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    showImagePrompt (command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
    }
  }
}
</script>
