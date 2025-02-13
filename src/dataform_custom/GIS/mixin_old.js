import mixin from '@lambda-platform/lambda-vue/src/modules/dataform/elements/_mixin'
import 'ol/ol.css';
import './map.scss';
import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import View from 'ol/View';
import {Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {WKT} from 'ol/format';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Modify from 'ol/interaction/Modify';
import Polygon from 'ol/geom/Polygon';
import {transform, fromLonLat, toLonLat} from 'ol/proj';
import {Feature} from "ol";
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { createXYZ } from 'ol/tilegrid';
import MVT from 'ol/format/MVT';
import {applyStyle} from 'ol-mapbox-style';
import {decodeHexewkbToWkt, to3D, bases} from "./utils"

import basemapToggle from "./components/basemapToggle.vue";
import basemapGallery from "./components/basemapGallery.vue";
import starter from "./components/starter.vue";
import {toStringHDMS} from "ol/coordinate";
import {template} from "~/modules/map/utils";



const vectorTileLayerSource = new VectorTileSource({
  format: new MVT(),
  url: 'https://imap.mn/06826032-4372-11ec-81d3-0242ac130003/{z}/{x}/{y}.pbf',
  tileGrid: createXYZ({ maxZoom: 19 }),
  tilePixelRatio: 16
});



const source = new VectorSource({wrapX: false});
const markerStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: '/map/marker.svg',
    scale: 1,
  })
});
const lineStyle = new Style({
  stroke: new Stroke({
    color: 'blue',
    width: 3
  })
});
const selectionLayer = new VectorTileLayer({
  renderMode: 'vector',

  style: function (feature) {
    if (feature.getId() in selection) {
      let geometry = feature.getGeometry();

      if (geometry.getType() === 'LineString') {
        return lineHighlightStyle;
      } else {
        return highlightStyle;
      }

    }
  },
});
const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.4)'
  }),
  stroke: new Stroke({
    color: 'blue',
    width: 1.5
  })
});
const vector = new VectorLayer({
  source: source,
  style: (feature) => {
    const geometryType = feature.getGeometry().getType();
    switch (geometryType) {
      case 'Point':
        return markerStyle;
      case 'LineString':
        return lineStyle;
      case 'MultiLineString':
        return lineStyle;
      case 'Polygon':
        return polygonStyle;
      case 'MultiPolygon':
        return polygonStyle;
      default:
        return null;  // or return some other default style
    }
  }
});
const transformToWGS84 = coord => transform(coord, 'EPSG:3857', 'EPSG:4326');

export default {

  components:{
    basemapToggle,
    basemapGallery,
    starter
  },
  mixins: [mixin],
  data() {
    let baseKey = "googleLayerRoadmap"
    const savedBaseMapKey = localStorage.getItem('selectedBaseMapKey');
    if (savedBaseMapKey) {
      baseKey = savedBaseMapKey
    }
    return {
      map: null,
      vectorSource: source,
      draw: null,
      selectedType: 'Point',
      baseKey,
      bases,
      base: new TileLayer({
        source: bases[baseKey],
      }),
      iMapBase: new VectorTileLayer({
        source: vectorTileLayerSource
      }),

      is3D: false,
      isGalleryVisible: false,
      started:false,
      modify:null,
      ready:false,
      categories:[],
      zoom:16,
    }
  },
  mounted() {
    if (!this.meta.hidden && this.do_render) {
      this.initMap();
    }
  },
  methods: {
    initMap() {

      const centerCoords = fromLonLat([106.8723, 47.8838]);

      this.map = new Map({
        layers: [ ],
        target: this.$refs.map,
        view: new View({
          center: centerCoords,
          zoom: this.zoom,
          maxZoom: 19,
        }),
      });



      applyStyle(this.iMapBase, 'https://imap.mn/06826032-4372-11ec-81d3-0242ac130003/style.json').then(()=>{

        if(this.baseKey === "iMap"){
          this.base.setVisible(false);
          this.iMapBase.setVisible(true)
        } else {
          this.iMapBase.setVisible(false);
          this.base.setVisible(true);
        }
        this.map.addLayer(this.iMapBase);
        this.map.addLayer(this.base);
        this.map.addLayer(vector);

        this.renderLayers();
      })

      this.ready = true;

    },
    changeLayerVisible(catIndex, layer) {
      let layerIndex = this.categories[catIndex].layers.findIndex(l=>l.url === layer.url);
      if(layerIndex >= 0){
        this.categories[catIndex].layers[layerIndex].visible = !this.categories[catIndex].layers[layerIndex].visible;
        this.categories[catIndex].layers[layerIndex].layer.setVisible(this.categories[catIndex].layers[layerIndex].visible);
      }
    },
    changeLayerUniqueVisible(catIndex, layer, uniqueValueInfo) {
      let layerIndex = this.categories[catIndex].layers.findIndex(l=>l.url === layer.url);
      if(layerIndex >= 0){
        let uniqueIndex = this.categories[catIndex].layers[layerIndex].uniqueRerender.uniqueValueInfos.findIndex(u=>u.value === uniqueValueInfo.value)
        if(uniqueIndex >= 0){

          this.categories[catIndex].layers[layerIndex].uniqueRerender.uniqueValueInfos[uniqueIndex].visible = !this.categories[catIndex].layers[layerIndex].uniqueRerender.uniqueValueInfos[uniqueIndex].visible;
          this.categories[catIndex].layers[layerIndex].layer.changed();
        }
      }
    },

    clearSelection() {

      selectionLayer.changed();
      return;
    },
    renderLayers() {



      this.categories.forEach((cat, catIndex) => {
        cat.layers.forEach((layer, layerIndex) => {
          if (layer.type === "Point" || layer.type === "Polygon" || layer.type === "Line") {
            layer.layer = new VectorTileLayer({
              declutter: true,

              source: new VectorTileSource({
                format: new MVT(),
                url: layer.url
              }),
              style: (feature, resolution) => {
                let geometry = feature.getGeometry();


                if (geometry.getType() === 'Point') {
                  let iconSrc = layer.marker;

                  if(layer.uniqueRerender){
                    let value = feature.get(layer.uniqueRerender.field);
                    let index = layer.uniqueRerender.uniqueValueInfos.findIndex(u=>u.value === value);

                    if(index >= 0){
                      if(this.categories[catIndex].layers[layerIndex].uniqueRerender.uniqueValueInfos[index].visible){
                        if(index >= 0){
                          iconSrc = layer.uniqueRerender.uniqueValueInfos[index].symbol;
                        }
                        // if (feature.get('tp_number') % 2 === 0) {
                        //   iconSrc = '/laika-risk-map/images/zurchil.svg';
                        // }
                      } else {
                        return null;
                      }
                    }
                  }
                  return new Style({
                    image: new Icon({
                      src: iconSrc,
                      scale: 25 / Math.max(25, 25),
                      anchor: [0.5, 1],
                      anchorXUnits: 'fraction', // 'fraction' or 'pixels'
                      anchorYUnits: 'fraction' // 'fraction' or 'pixels'
                    })
                  });
                } else if (geometry.getType() === 'Polygon') {
                  return new Style({
                    fill: new Fill({
                      color: layer.fill  // The color of the fill. Can be in RGB, RGBA, hex format etc.
                    }),
                    stroke: new Stroke({
                      color: layer.stroke,  // The color of the stroke. Can be in RGB, RGBA, hex format etc.
                      width: 1  // The width of the stroke.
                    }),
                    text:layer.label && layer.label.color ? new Text({
                      font: layer.label.font,
                      fill: new Fill({
                        color: layer.label.color // Text color
                      }),
                      text: feature.get(layer.label.field)  // Assuming the attribute containing the label is 'name'
                    }) : undefined
                  });
                } else if (geometry.getType() === 'LineString') {
                  return new Style({

                    stroke: new Stroke({
                      color: layer.stroke,  // The color of the stroke. Can be in RGB, RGBA, hex format etc.
                      width: 2  // The width of the stroke.
                    })
                  });
                }
              }
            });
            layer.layer.set('layerID', layer.id);
            layer.layer.set('popup', layer.popup);
            layer.layer.set('layerTitle', layer.title);
            layer.layer.setVisible(layer.visible);
            this.map.addLayer(layer.layer);
          }
        })
      })
      this.map.addLayer(selectionLayer)
    },
    start(){
      this.addInteraction(this.selectedType);
    },

    addInteraction(type) {
      if (this.draw) {
        this.map.removeInteraction(this.draw);
        this.map.removeInteraction(this.modify);
      }
      if (type !== 'None') {
        this.draw = new Draw({
          source: this.vectorSource,
          type: type === 'MultiLine' ? 'MultiLineString' : type
        });
        this.draw.on('drawstart', this.clear);  // Add this line
        this.draw.on('drawend', this.onDrawEnd);
        this.map.addInteraction(this.draw);
        this.started = true;

        this.modify = new Modify({source: this.vectorSource});
        this.modify.on('modifyend', this.onDrawEnd);
        this.map.addInteraction(this.modify);
      }

    },
    clear() {
      this.vectorSource.clear();
    },


    onDrawEnd(event) {
      let  feature = null;
      if(event.features){
        feature = event.features.getArray()[0]
      } else {
        feature = event.feature
      }
      const geometry = feature.getGeometry().clone();

      const wktFormat = new WKT();
      if(geometry.getType() === "Point"){
        let transformedGeometry;
        transformedGeometry = new Point(to3D(transformToWGS84(geometry.getCoordinates()), this.is3D));
        this.model.form[this.model.component] = wktFormat.writeGeometry(transformedGeometry);
      } else {
        geometry.transform('EPSG:3857', 'EPSG:4326');
        this.model.form[this.model.component] = wktFormat.writeGeometry(geometry);
      }

      this.started = false;
      this.map.removeInteraction(this.draw);
    },


    setElement() {
      if (this.editMode) {
        const wktFormat = new WKT();

        const geometry = wktFormat.readGeometry(decodeHexewkbToWkt(this.itemValue));

        const feature = new Feature({
          geometry: geometry.transform('EPSG:4326', 'EPSG:3857')
        });

        this.vectorSource.addFeature(feature);

        this.modify = new Modify({source: this.vectorSource});
        this.modify.on('modifyend', this.onDrawEnd);
        this.map.addInteraction(this.modify);

        if (geometry.getType() === 'Point') {
          const center = geometry.getCoordinates();
          this.map.getView().setCenter(center);
        } else {
          const extent = this.vectorSource.getExtent();
          this.map.getView().fit(extent, {
            size: this.map.getSize(),
            padding: [21, 21, 21, 21]
          });
        }
      }
    },

    setBaseLayer(key) {
      localStorage.setItem('selectedBaseMapKey', key);
      this.baseKey = key;
      this.base.setSource(bases[key]);
      if(this.baseKey === 'iMap'){
        this.base.setVisible(false);
        this.iMapBase.setVisible(true);
      } else {
        this.base.setVisible(true);
        this.iMapBase.setVisible(true);
      }


    },
    toggleGalleryVisibility() {
      this.isGalleryVisible = !this.isGalleryVisible;
    },
    destroy() {
      if (this.map) {
        this.clear();
        // Remove all interactions
        this.map.getInteractions().forEach(interaction => {
          this.map.removeInteraction(interaction);
        });

        // Remove all layers
        this.map.getLayers().getArray().slice().forEach(layer => {
          this.map.removeLayer(layer);
        });

        // Unset the map's target to detach it from the DOM
        this.map.setTarget(null);

        // Dispose of the map to clean up resources
        this.map.dispose();

        // Nullify the map reference
        this.map = null;

        this.ready = false;
      }
    }
  },

  watch: {
    selectedType(newValue) {
      this.addInteraction(newValue);
    },
    itemValue(value, oldValue) {
      if (value && !oldValue) {
        this.setElement();
      }
    },
    do_render(value) {
      if (value) {

        if (!this.editMode) {
          this.initMap();
        } else {
          if (this.itemValue === null) {
            this.initMap();
          }
        }
      } else {
        this.destroy();
      }
    },
  }

}
