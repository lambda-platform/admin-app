<template>
  <div class="container  m-auto py-10">
      <swiper :spaceBetween="0" :speed="700" :hashNavigation="{watchState: true,}"  :autoHeight="true"
              :pagination="true"
              :modules="modules" class="mySwiper"
      >

        <swiper-slide data-hash="slide1" v-for="(banner, index) in banners" :key="index" >

          <img alt="Тасалбар захиалгын нэгдсэн платформ." class="rounded-lg" style="cursor:pointer; object-fit: cover; width: 100vw; height: 300px;" :src="banner.img"/>

        </swiper-slide>
      </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'

import {Autoplay, Navigation, Pagination } from 'swiper'
export default {
  name: 'Banner',
  components: {
    Swiper,
    SwiperSlide,

  },
  data () {
    return {
      loading: true,
      modules: [Autoplay, Navigation, Pagination],
      banners: [{
        img:"https://khankhulgun.mn/constellation.png",
        text:""
      },{
        img:"https://khankhulgun.mn/constellation.png",
        text:""
      }]
    }
  },
}
</script>

<style scoped>

</style>
