<script>
export default {
  name: 'MixinCss'
}
</script>

<style>
/* Nuxt animation (by default : 'fade'. Can only be set with the transition: 'XYZ' property (fade, bounce, slide-bottom) */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}

.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.5s;
}
.layout-enter,
.layout-leave-to {
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
.slide-bottom-enter,
.slide-bottom-leave-to {
  opacity: 0;
  transform: translate3d(0, 15px, 0);
}
.bounce-enter-active {
  transform-origin: top;
  animation: bounce-in 0.8s;
}
.bounce-leave-active {
  transform-origin: top;
  animation: bounce-out 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(0);
  }
}

/* background SVG */
.background {
  background-color: #f5aaa6;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(240)'%3E%3Cstop offset='0' stop-color='%23f5aaa6'/%3E%3Cstop offset='1' stop-color='%2396a4cc'/%3E%3C/linearGradient%3E%3Cpattern patternUnits='userSpaceOnUse' id='b' width='540' height='450' x='0' y='0' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect x='0' y='0' fill='url(%23b)' width='100%25' height='100%25'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
},

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
.v-card.v-sheet.theme--light {
  background-color: #EEEEEE;
  transition: all 0.15s linear;
}
.v-card.v-sheet.theme--light:hover {
  background-color: #FAFAFA;
}


/* V-card class inside another V-card class */
.v-card.v-sheet.theme--light .v-card.v-sheet.theme--light {
  background-color: #CCCC;
  transition: all 0.15s linear;
  padding: 1em;
}
.v-card.v-sheet.theme--light .v-card.v-sheet.theme--light:hover {
  background-color: #EEEE;
  transform: scale(1.05);
}


/* tab-item a V-card class */
.v-card.v-sheet.theme--light .v-card__text {
  background-color: #212121;
  transition: all 0.15s linear;
}
.v-card.v-sheet.theme--light .v-card__text:hover {
  background-color: #292929;
}


/* V-card class inside a dialog (REQUIRED, ortherwise there's margin error) */
.v-dialog.v-dialog--active .v-card.v-sheet.theme--light {
  margin: 0;
}


/* V-card title with a right align (REQUIRED, ortherwise the title remains left-aligned) */
.v-card__title.text-right {
  display: block;
}

/* Nuxtlink
.v-application a {
  transition: 0.2s ease-in-out;
  color: inherit !important;
  text-decoration: none;
}
.v-application a:hover {
  color: #27B6B7 !important;
  text-decoration: none;
}
 */
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

/* ANIMATIONS */
/* Rotate */

/* Animation : Arrival in the dungeon */
.anim-arrival{
  animation: animationArrival 6s infinite;
}
@keyframes animationArrival{
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(-30deg);
  }
  40% {
    transform: rotate(0deg);
  }
  60% {
    transform: rotate(0deg);
  }
  80% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/* white-on-hover */
.white-on-hover {
  transition: all .3s ease-out;
}
.white-on-hover:hover {
  color: #fff;
}

/* Color classes */
.type-1 { color: #999999; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Normal */
.type-2 { color: #db1420; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Fire */
.type-3 { color: #1075ea; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Water */
.type-4 { color: #1daf26; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Plant */
.type-5 { color: #f4f262; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Elektrik */
.type-6 { color: #8fdbdc; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Ice */
.type-7 { color: #dc875b; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Fighting */
.type-8 { color: #9c17e8; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Poison */
.type-9 { color: #dec38c; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Ground */
.type-10 { color: #c1ebf6; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Flying */
.type-11 { color: #ec5bdc; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Psychic */
.type-12 { color: #b1e854; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Bug */
.type-13 { color: #b07f63; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Rock */
.type-14 { color: #62258d; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Ghost */
.type-15 { color: #483456; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Dark */
.type-16 { color: #1075ea; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Dragon */
.type-17 { color: #cdc1cc; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Steel */
.type-18 { color: #f3a0ea; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; } /* Fairy */
</style>
