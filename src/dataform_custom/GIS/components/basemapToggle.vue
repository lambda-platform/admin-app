<template>
  <div class="toggle-basemap" @click="toggleGalleryVisibility">
    <!-- Replace the following SVG path with your desired SVG icon -->
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
         width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
         preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
         fill="#000000" stroke="none">
        <path d="M1388 3947 c-643 -292 -1165 -534 -1160 -538 7 -7 2267 -1035 2312
-1052 22 -8 183 63 1185 518 638 290 1164 530 1168 534 6 6 -2258 1044 -2323
1065 -8 3 -540 -234 -1182 -527z"/>
        <path d="M443 2667 c-122 -56 -222 -104 -222 -107 0 -8 2322 -1060 2339 -1060
17 -1 2339 1052 2340 1060 0 11 -460 212 -473 207 -8 -3 -431 -195 -940 -426
l-926 -421 -935 425 c-514 234 -941 425 -948 424 -7 -1 -113 -47 -235 -102z"/>
        <path d="M453 1817 c-122 -56 -224 -105 -227 -108 -3 -3 521 -245 1165 -537
l1170 -532 1170 532 c643 292 1166 535 1162 539 -4 4 -109 53 -232 108 l-223
101 -939 -426 -938 -427 -938 427 c-516 234 -940 426 -943 425 -3 0 -105 -46
-227 -102z"/>
      </g>
    </svg>
  </div>
</template>
<script >
export default {

  emits:["toggleGalleryVisibility"],
  methods:{
    toggleGalleryVisibility(){
      this.$emit("toggleGalleryVisibility")
    }
  }
}
</script>
