<script>
export default {
  name: 'MixinCss'
}
</script>

<style>
/* Changes the mouse's cursor on Pointer */
.pointer {
  cursor: pointer;
}

/* Color of the biggest headers
h1,
h2 {
  color: #cb3e3e;
}
*/

/* V-card class */
.v-card.v-sheet.theme--dark {
  background-color: #212121;
  transition: all 0.15s linear;
  margin: 1em;
  padding: 1em;
}
.v-card.v-sheet.theme--dark:hover {
  background-color: #292929;
}

/* V-card class inside another V-card class */
.v-card.v-sheet.theme--dark .v-card.v-sheet.theme--dark {
  background-color: #525252;
  transition: all 0.15s linear;
  padding: 1em;
}

/* V-card class inside another V-card class */
.v-card.v-sheet.theme--dark .v-card.v-sheet.theme--dark:hover {
  background-color: #757575;
  transform: scale(1.05);
}

/* V-card class inside a dialog (REQUIRED, ortherwise there's margin error) */
.v-dialog.v-dialog--active .v-card.v-sheet.theme--dark {
  margin: 0;
}

/* V-card title with a right align (REQUIRED, ortherwise the title remains left-aligned) */
.v-card__title.text-right {
  display: block;
}

/* Nuxtlink */
.v-application a {
  transition: 0.2s ease-in-out;
  color: inherit !important;
  text-decoration: none;
}
.v-application a:hover {
  color: #27B6B7 !important;
  text-decoration: none;
}

/* Zoom effect when hovering */
.zoom {
  transition: transform 0.2s;
}
.zoom:hover {
  transform: scale(1.2);
}
.zoom-sm {
  transition: transform 0.2s;
}
.zoom-sm:hover {
  transform: scale(1.1);
}
.zoom-xs {
  transition: transform 0.2s;
}
.zoom-xs:hover {
  transform: scale(1.05);
}
</style>
