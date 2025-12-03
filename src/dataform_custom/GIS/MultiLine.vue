<template>
  <lambda-form-item :label=label :name="model.component" :meta="meta">
    <div class="relative">
      <a-popover title="Дархарга">
        <template #content>
          <div class="menu_style bg-white dark:bg-slate-900">
            <a-menu
              v-model:openKeys="openKeys"
              v-model:selectedKeys="selectedKeys"
              style="width: 100%;"
              mode="inline"
            >
              <a-sub-menu :key="`${catIndex}`" v-for="(category, catIndex) in categories">
                <template #icon>
                  <div class="flex">
                    <!--<img alt="" class="w-5 h-5" :src="category.icon"/>-->
                    <img alt=""
                         class="w-5 h-5 flex-none text-white transition-all duration-300 group-hover:block hidden dark:block"
                         :src="category.icon"/>
                    <img alt=""
                         class="w-5 h-5 flex-none text-white transition-all duration-300 group-hover:hidden block dark:hidden"
                         :src="category.icontwo"/>
                  </div>
                </template>
                <template #title><span class="dark:text-white">{{ category.title }}</span></template>
                <a-menu-item :key="layerIndex"
                             v-for="(layer, layerIndex) in category.layers.filter(layer=>!layer.uniqueRerender)">
                  <template #icon>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                         v-if="layer.type === 'Polygon'">
                      <path d="M14.5 7.31843V14H0.5V0.785098L14.5 7.31843Z" :fill="layer.fill" :stroke="layer.stroke"/>
                    </svg>
                    <svg width="18" height="24" viewBox="0 0 19 7" fill="none" xmlns="http://www.w3.org/2000/svg"
                         v-if="layer.type === 'Line'">
                      <path d="M1 6L10 2L18 1" :fill="layer.stroke" :stroke="layer.stroke" stroke-width="2"/>
                    </svg>
                    <img alt="" class="w-6 h-6" :src="layer.marker" v-if="layer.type === 'Point'"/>
                  </template>

                  <div @click="changeLayerVisible(catIndex, layer)"
                       class="cursor-pointer flex items-center justify-between py-3">

                    <div class="w-52 whitespace-normal" style="line-height: 20px !important;">
                      <span class="dark:text-white">{{ layer.title }}</span>
                    </div>
                    <img alt="" class="w-4 h-4"
                         :src="layer.visible ? '/map/image/Eye.svg' : '/map/image/Eyeclose.svg'"/>
                  </div>

                </a-menu-item>
                <a-sub-menu :key="layerIndex"
                            v-for="(layer, layerIndex) in category.layers.filter(layer=>layer.uniqueRerender && layer.uniqueRerender.uniqueValueInfos && layer.uniqueRerender.uniqueValueInfos.length >= 1)">
                  <template #icon>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                         v-if="layer.type === 'Polygon'">
                      <path d="M14.5 7.31843V14H0.5V0.785098L14.5 7.31843Z" :fill="layer.fill" :stroke="layer.stroke"/>
                    </svg>
                    <svg width="18" height="24" viewBox="0 0 19 7" fill="none" xmlns="http://www.w3.org/2000/svg"
                         v-if="layer.type === 'Line'">
                      <path d="M1 6L10 2L18 1" :fill="layer.stroke" :stroke="layer.stroke" stroke-width="2"/>
                    </svg>
                    <img alt="" class="w-6 h-6" :src="layer.marker" v-if="layer.type === 'Point'"/>
                  </template>

                  <template #title>
                    <div @click="changeLayerVisible(catIndex, layer)"
                         class="cursor-pointer flex items-center justify-between py-3 max-w-80px mr-6">

                      <div class="w-52 whitespace-normal" style="line-height: 20px !important;">
                        <span class="dark:text-white">{{ layer.title }}</span>
                      </div>
                      <img alt="" class="w-4 h-4 cursor-pointer"
                           :src="layer.visible ? '/map/image/Eye.svg' : '/map/image/Eyeclose.svg'"/>
                    </div>
                  </template>
                  <a-menu-item :key="`${uniqueValueInfoIndex}`"
                               v-for="(uniqueValueInfo, uniqueValueInfoIndex) in layer.uniqueRerender.uniqueValueInfos">
                    <template #icon>
                      <img alt="" class="w-6 h-6 ml-2" :src="uniqueValueInfo.symbol"/>
                    </template>
                    <div @click="changeLayerUniqueVisible(catIndex, layer, uniqueValueInfo)"
                         class="cursor-pointer flex items-center justify-between py-3">

                      <div class="w-52 whitespace-normal" style="line-height: 20px !important;">
                        <span class="dark:text-white">{{ uniqueValueInfo.label }}</span>
                      </div>
                      <img alt="" class="w-4 h-4"
                           :src="uniqueValueInfo.visible ? '/map/image/Eye.svg' : '/map/image/Eyeclose.svg'"/>
                    </div>
                  </a-menu-item>
                </a-sub-menu>
              </a-sub-menu>
            </a-menu>
          </div>
        </template>

        <div class="toggle-basemap" style="z-index: 1500">
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
      </a-popover>

      <div ref="map" class="map"></div>
      <starter :started="started" @start="start" :selectedType="selectedType"></starter>
<!--      <basemapToggle @toggleGalleryVisibility="toggleGalleryVisibility"></basemapToggle>-->
<!--      <basemapGallery :bases="bases" v-show="isGalleryVisible" @setBaseLayer="setBaseLayer"></basemapGallery>-->
    </div>
  </lambda-form-item>
</template>

<script>

import mixin from "./mixin_old";
export default {
  mixins:[mixin],
  data(){
    return {
      selectedType: 'MultiLine',
      is3D: false,
      zoom:16,
      openKeys: ['0', '0-0', '1', '1-0'],
      selectedKeys: [],
      categories: [],
    }
  }

}
</script>

