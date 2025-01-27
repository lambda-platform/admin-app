<template>
  <div id="area_search" class="flex">
    <div>
      <a-select
          v-model:value="districtCode"
          style="width: 210px"
          :options="districts"
          :loading="districtLoading"
          @change="getRegions"
          show-search
          allow-clear
          placeholder="Дүүрэг"
      >
      </a-select>
    </div>
    <div class="ml-2" v-if="regions.length >= 1">
      <a-select
          v-model:value="regionCode"
          style="width: 210px"
          :options="regions"
          :loading="regionLoading"
          @change="getRegion"
          show-search
          allow-clear
          placeholder="Хороо"
      >
      </a-select>
    </div>
  </div>
</template>
<script>

import axios from "~/plugins/core/axios";
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import {WKT} from 'ol/format';
import {transform, fromLonLat} from 'ol/proj';
import {Feature} from "ol";
import {decodeHexewkbToWkt} from "~/modules/map/utils";
import {easeOut} from "ol/easing";

const source = new VectorSource();
const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(32,206,245,0.3)'
  }),
  stroke: new Stroke({
    color: 'blue',
    width: 1
  })
});
const areaLayer = new VectorLayer({
  source: source,
  style: () => {
    return polygonStyle
  }
});
export default {
  props:["map"],
  data() {
    return {
      districts: [],
      regions: [],
      districtCode: null,
      regionCode: null,
      district: null,
      region: null,
      districtLoading: false,
      regionLoading: false,
    }
  },
  methods: {
    getDistricts() {
      axios.get("/gis/api/districts").then(({data}) => {
        if (data && data.length) {
          this.districts = data.map(d => {
            return {
              value: d.au2_code,
              label: d.name_desc
            }
          });
        }

      })
    },
    addPolygonToMap(geom){

      source.clear();

      const wktFormat = new WKT();
      const geometry = wktFormat.readGeometry(decodeHexewkbToWkt(geom));
      const feature = new Feature({
        geometry: geometry.transform('EPSG:4326', 'EPSG:3857')
      });

      source.addFeature(feature);


      const extent = source.getExtent();
      this.map.getView().fit(extent, {
        size: this.map.getSize(),
        padding: [70, 70, 70, 70],
        duration: 500,  // e.g., 1000 milliseconds for 1 second
        easing: easeOut // easeOut is one of the predefined easing functions
      });
    },
    getRegions() {
      if (this.districtCode) {
        this.districtLoading = true;
        axios.get("/gis/api/district/" + this.districtCode).then(({data}) => {
          if (data) {
            this.district = data;
            this.addPolygonToMap(this.district.geom)
            axios.get("/gis/api/regions/" + this.districtCode).then((res) => {
              if (res.data && res.data.length) {
                this.regions = res.data.map(d => {
                  return {
                    value: d.code,
                    label: d.name
                  }
                });
              }
              this.districtLoading = false;
            })
          }
        })
      } else {

        this.district = null;
        this.regions = [];
        source.clear();
      }
    },
    getRegion() {
      if (this.regionCode) {
        this.regionLoading = true;
        axios.get("/gis/api/region/" + this.regionCode).then(({data}) => {
          if (data) {
            this.region = data;

            this.addPolygonToMap(this.region.geom)
          }

          this.regionLoading = false;

        })
      } else {
        source.clear();
        this.region = null;

      }
    }
  },
  mounted() {
    // this.getDistricts()
    this.map.addLayer(areaLayer);
  }
}
</script>
