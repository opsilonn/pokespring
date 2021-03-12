<script>
export default {
  name: 'MixinCss'
}
</script>

<style>
/* Changes the mouse's cursor on Pointer */
.pointer {cursor: pointer;}

/* Zoom effect when overing */
h1, h2 {
  color: #E9C490;
}

/* V-card class */
.v-card.v-sheet.theme--dark {
  background-color: #212121;
  transition: all 0.15s linear;
}
.v-card.v-sheet.theme--dark:hover {
  background-color: #292929;
}

/* V-card class inside another V-card class */
.v-card.v-sheet.theme--dark .v-card.v-sheet.theme--dark {
  background-color: #313131;
  transition: all 0.15s linear;
  padding: 1em;
}

/* V-card class inside another V-card class */
.v-card.v-sheet.theme--dark .v-card.v-sheet.theme--dark:hover {
  background-color: #393939;
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

/* No underline effect for NuxtLink (does not work) */
NuxtLink { text-decoration: none; }

/* Zoom effect when overing */
.zoom {
  transition: transform .2s;
}
.zoom:hover {
  transform: scale(1.2);
  transition: all 0.15s linear;
}
.zoom-sm {
  transition: transform .2s;
}
.zoom-sm:hover {
  transform: scale(1.1);
  transition: all 0.15s linear;
}
.zoom-xs {
  transition: transform .2s;
}
.zoom-xs:hover {
  transform: scale(1.05);
  transition: all 0.15s linear;
}

/* Background SVG pattern */
.background {
  background-color: #0a0908;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg fill-opacity='0.07'%3E%3Cpolygon fill='%23372e23' points='1600 160 0 460 0 350 1600 50'/%3E%3Cpolygon fill='%2363543e' points='1600 260 0 560 0 450 1600 150'/%3E%3Cpolygon fill='%2390795a' points='1600 360 0 660 0 550 1600 250'/%3E%3Cpolygon fill='%23bc9f75' points='1600 460 0 760 0 650 1600 350'/%3E%3Cpolygon fill='%23e9c490' points='1600 800 0 800 0 750 1600 450'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}
</style>
