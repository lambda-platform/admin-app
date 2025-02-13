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
import Modify from 'ol/interaction/Modify';
import {transform, fromLonLat} from 'ol/proj';
import {Feature} from "ol";
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import {createXYZ} from 'ol/tilegrid';
import MVT from 'ol/format/MVT';
import {applyStyle} from 'ol-mapbox-style';
import {decodeHexewkbToWkt, checkStringFormat, to3D, bases} from "./utils"

import basemapToggle from "./components/basemapToggle.vue";
import basemapGallery from "./components/basemapGallery.vue";
import starter from "./components/starter.vue";
import {convertToRGBA, template} from "~/modules/map/utils";
import axios from "~/plugins/core/axios";
import Overlay from "ol/Overlay";
import {base_url} from "~/consts/const";

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

const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.4)'
  }),
  stroke: new Stroke({
    color: 'blue',
    width: 1.5
  })
});

const highlightStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(10,226,246,0.8)',
    width: 2,
  }),
  fill: new Fill({
    color: 'rgba(8,227,248,0.7)',
  }),
});

const lineHighlightStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(10,226,246,0.8)',
    width: 3,
  }),
});

// Selection
const vectorTileLayerSource = new VectorTileSource({
  format: new MVT(),
  url: 'https://imap.mn/06826032-4372-11ec-81d3-0242ac130003/{z}/{x}/{y}.pbf',
  tileGrid: createXYZ({maxZoom: 19}),
  tilePixelRatio: 16
});

const source = new VectorSource({wrapX: false});

const highlightSource = new VectorSource();

const selectionLayer = new VectorLayer({
  source: highlightSource,

  style: function (feature) {
    let geometry = feature.getGeometry();

    if (geometry.getType() === 'LineString') {
      return lineHighlightStyle;
    } else {
      return highlightStyle;
    }
  },
});

window.selectionLayerID = null
window.selectionFeatureID = null
window.selectedLayer = null

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

const overlay = new Overlay({
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

export default {
  components: {
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
      mapID: this.meta.mapID ? this.meta.mapID : '91a9eaac-3e0c-40a1-a9bb-09a1ed70d9f8',
      categories: [],
      map: null,
      pointLayer: null,
      layerVisible: true,
      zoom: 16,
      bases: bases,
      baseKey,
      base: new TileLayer({
        source: bases[baseKey],
      }),
      iMapBase: new VectorTileLayer({
        source: vectorTileLayerSource,
        style: 'https://imap.mn/06826032-4372-11ec-81d3-0242ac130003/style.json'
      }),
      isGalleryVisible: false,
      ready: false,
      draw: null,
      modify: null,
      is3D: false,
      selectedType: this.meta.selectedType ? this.meta.selectedType : 'Point',
      vectorSource: source,
      started: false,
    }
  },

  mounted() {
    if (!this.meta.hidden && this.do_render) {
      this.fetchMapLayers();
    }
  },

  methods: {
    fetchMapLayers() {
      axios.get(`/mapserver/api/map/${this.mapID}`)
        .then(response => {
          this.categories = response.data.categories;
          this.initMap();
        })
        .catch(error => {
          this.error = error.response ? error.response.data.message : 'An unknown error occurred';
        });
    },

    initMap() {
      const container = this.$refs.popup;
      const content = this.$refs.popupContent;
      const closer = this.$refs.popupCloser;

      overlay.setElement(container)

      closer.onclick = () => {
        overlay.setPosition(undefined);
        closer.blur();
        this.clearSelection();
        return false;
      };

      this.map = new Map({
        layers: [],
        target: this.$refs.map,
        view: new View({
          center: fromLonLat([106.8723, 47.8838]),
          zoom: this.zoom,
          maxZoom: 19,
        }),
        overlays: [overlay],
      });

      if (this.itemValue) {
        this.setElement();
      }

      applyStyle(this.iMapBase, 'https://imap.mn/06826032-4372-11ec-81d3-0242ac130003/style.json').then(() => {
        if (this.baseKey === "iMap") {
          this.base.setVisible(false);
          this.iMapBase.setVisible(true)
        } else {
          this.iMapBase.setVisible(false);
          this.base.setVisible(true);
        }
        this.map.addLayer(this.iMapBase);
        this.map.addLayer(this.base);
        this.map.addLayer(selectionLayer)
        this.map.addLayer(vector);

        this.renderLayers();
      })

      this.ready = true;

      this.map.once('rendercomplete', () => {
        this.map.on('singleclick', (e) => this.showInfo(e, content));
      });
    },

    showInfo(event, content) {
      let index = 0;

      this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if (index === 0 && layer) {

          if (layer.values_.id !== "highlight" && feature.getType && layer.values_.layerID) {
            this.clearSelection();
            const properties = feature.getProperties();
            const coordinate = event.coordinate;

            // Clear previous content
            while (content.firstChild) {
              content.removeChild(content.firstChild);
            }

            // Create and append new content
            const layerTitle = document.createElement('p');
            layerTitle.textContent = layer.get("layerTitle");
            content.appendChild(layerTitle);

            const infoParagraph = document.createElement('p');
            if (layer.values_.popup) {
              infoParagraph.innerHTML = template(layer.values_.popup.template, properties);  // Using innerHTML for templated content
            } else {
              infoParagraph.textContent = `Нэр: ${properties.name ? properties.name : properties.id}`;
            }
            content.appendChild(infoParagraph);

            overlay.setPosition(coordinate);

            const featureType = feature.getType();

            if (featureType === "Polygon" || featureType === "LineString") {
              window.selectedLayer = layer;
              window.selectionLayerID = layer.values_.layerID;
              window.selectionFeatureID = feature.getId();
            }
          } else {
            this.clearSelection();
          }
        }
        index++;
      });
    },

    clearSelection() {
      window.selectionLayerID = null;
      window.selectionFeatureID = null;

      if(window.selectedLayer){
        window.selectedLayer.changed();
        window.selectedLayer = null;
      }

      overlay.setPosition(undefined);
    },

    changeLayerVisible(catIndex, layerID) {
      let layerIndex = this.categories[catIndex].layers.findIndex(l => l.id === layerID);
      if (layerIndex >= 0) {
        this.categories[catIndex].layers[layerIndex].is_visible = !this.categories[catIndex].layers[layerIndex].is_visible;
        this.categories[catIndex].layers[layerIndex].layer.setVisible(this.categories[catIndex].layers[layerIndex].is_visible);
      }
    },

    changeLayerUniqueVisible(catIndex, layer, uniqueValueInfo) {
      let layerIndex = this.categories[catIndex].layers.findIndex(l => l.url === layer.url);
      if (layerIndex >= 0) {
        let uniqueIndex = this.categories[catIndex].layers[layerIndex].legends.findIndex(u => u.unique_value === uniqueValueInfo.unique_value)
        if (uniqueIndex >= 0) {
          this.categories[catIndex].layers[layerIndex].legends[uniqueIndex].unique_visible = !this.categories[catIndex].layers[layerIndex].legends[uniqueIndex].unique_visible;
          this.categories[catIndex].layers[layerIndex].layer.changed();
        }
      }
    },

    renderLayers() {
      this.categories.forEach((cat, catIndex) => {
        cat.layers.forEach((layer, layerIndex) => {
          if (layer.geometry_type === "Point" || layer.geometry_type === "Polygon" || layer.geometry_type === "LineString") {
            if (layer.legends && layer.legends.length > 0) {
              let fill_color = null

              if (layer.geometry_type === "Polygon") {
                fill_color = convertToRGBA(layer.legends[0].fill_color, 0.5)
              }

              this.categories[catIndex].layers[layerIndex].layer = new VectorTileLayer({
                declutter: true,

                source: new VectorTileSource({
                  format: new MVT(),
                  url: `${base_url}/tiles/${layer.id}/{z}/{x}/{y}.pbf`
                }),
                style: (feature) => {
                  let geometry = feature.getGeometry();

                  if (geometry.getType() === 'Point') {
                    let iconSrc = layer.legends[0].marker;

                    if (layer.unique_value_field && layer.legends.length > 1) {

                      let value = feature.get(layer.unique_value_field);
                      if (value) {
                        let index = layer.legends.findIndex(u => u.unique_value.toString() === value.toString());

                        if (index >= 0) {
                          if (this.categories[catIndex].layers[layerIndex].legends[index].unique_visible) {
                            if (index >= 0) {
                              iconSrc = layer.legends[index].marker;
                            }
                            // if (feature.get('tp_number') % 2 === 0) {
                            //   iconSrc = '/laika-risk-map/images/zurchil.svg';
                            // }
                          } else {
                            return null;
                          }
                        }

                      }
                    }

                    return new Style({
                      image: new Icon({
                        src: `https://otorchin.gov.mn${iconSrc}`,
                        scale: 25 / Math.max(25, 25),
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction', // 'fraction' or 'pixels'
                        anchorYUnits: 'fraction' // 'fraction' or 'pixels'
                      })
                    });
                  } else if (geometry.getType() === 'Polygon') {
                    if (window.selectionLayerID === layer.id && window.selectionFeatureID === feature.getId()) {
                      return highlightStyle
                    } else {
                      return new Style({
                        fill: new Fill({
                          color: fill_color
                        }),
                        stroke: new Stroke({
                          color: layer.legends[0].stroke_color,  // The color of the stroke. Can be in RGB, RGBA, hex format etc.
                          width: 1  // The width of the stroke.
                        }),
                        text: layer.label && layer.label.color ? new Text({
                          font: layer.label.font,
                          fill: new Fill({
                            color: layer.label.color // Text color
                          }),
                          text: feature.get(layer.label.field)  // Assuming the attribute containing the label is 'name'
                        }) : undefined
                      });
                    }
                  } else if (geometry.getType() === 'LineString') {
                    if (window.selectionLayerID === layer.id && window.selectionFeatureID === feature.getId()) {
                      return lineHighlightStyle
                    } else {
                      return new Style({
                        stroke: new Stroke({
                          color: layer.legends[0].fill_color,  // The color of the stroke. Can be in RGB, RGBA, hex format etc.
                          width: 2  // The width of the stroke.
                        })
                      });
                    }
                  }
                }
              });
              this.categories[catIndex].layers[layerIndex].layer.set('layerID', layer.id);
              this.categories[catIndex].layers[layerIndex].layer.set('popup', {
                template: layer.popup_template
              });
              this.categories[catIndex].layers[layerIndex].layer.set('layerTitle', layer.layer_title);
              this.categories[catIndex].layers[layerIndex].layer.setVisible(layer.is_visible);

              this.map.addLayer(this.categories[catIndex].layers[layerIndex].layer);
            }
          }
        })
      })
    },

    start() {
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
      let feature = null;

      if (event.features) {
        feature = event.features.getArray()[0]
      } else {
        feature = event.feature
      }

      const geometry = feature.getGeometry().clone();
      const wktFormat = new WKT();

      if (geometry.getType() === "Point") {
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
      this.clear();
      if (this.editMode) {
        const wktFormat = new WKT();

        const geometry = wktFormat.readGeometry(checkStringFormat(this.itemValue) === "hexewkb" ? decodeHexewkbToWkt(this.itemValue) : this.itemValue);

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
      if (this.baseKey === 'iMap') {
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
