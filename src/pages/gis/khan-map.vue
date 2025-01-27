<template>
  <div>
    <div ref="mapContainer" class="map-container"></div>
    <div id="popup" class="ol-popup text-[13px]">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorTileLayer from 'ol/layer/VectorTile';
import MVT from 'ol/format/MVT';
import VectorTileSource from 'ol/source/VectorTile';
import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style';
import {fromLonLat} from "ol/proj";

const mapContainer = ref(null);
definePageMeta({
  layout: 'web',
})
onMounted(() => {
  const vectorTileSource = new VectorTileSource({
    format: new MVT(),
    url: 'http://127.0.0.1:8080/tiles/{z}/{x}/{y}.pbf'
  });

  const vectorTileLayer = new VectorTileLayer({
    source: vectorTileSource,
    style: feature => {
      return new Style({
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.1)'
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'black', width: 1 })
        })
      });
    }
  });
  const vectorTileSource2 = new VectorTileSource({
    format: new MVT(),
    url: 'http://127.0.0.1:8080/buildings/{z}/{x}/{y}.pbf'
  });

  const vectorTileLayer2 = new VectorTileLayer({
    source: vectorTileSource2,
    style: feature => {
      return new Style({
        stroke: new Stroke({
          color: '#333dff',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(61,140,244,0.1)'
        }),
      });
    }
  });

  const rasterLayer = new TileLayer({
    source: new XYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
  });

  const map = new Map({
    target: mapContainer.value,
    layers: [vectorTileLayer, vectorTileLayer2],
    view: new View({
      center: fromLonLat([106.91736415028574, 47.91876971846709]),
      zoom: 16
    })
  });

  function showInfo(event, map) {

    let index = 0;

    map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      if (index === 0 && layer) {
        const properties = feature.getProperties();
        const coordinate = event.coordinate;

        console.log(properties)
        console.log(coordinate)
      }

    })
  }
  map.once('rendercomplete', () => {

    map.on('singleclick', (e) => showInfo(e, map));



  });


});
</script>

<style>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
