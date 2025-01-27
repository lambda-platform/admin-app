<template>
  <div id="measure">
    <a-tooltip placement="left">
      <template #title>
        <span>Талбайн хэмжих</span>
      </template>
      <button @click="startMeasure('area')" class="">
        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24">
          <path
              d="M21 8h1V5h-3v1.006L5 2.461V1H2v3h1v6H1v8h2v2H2v3h3v-1h14v1h3v-3h-1v-2h2v-8h-2zm-1-2h1v1h-1zM3 2h1v1H3zm1 2h1v-.502l14 3.545V8h1v2H4zm0 18H3v-1h1zm17 0h-1v-1h1zm-1-2h-1v1H5v-1H4v-2h16zm2-9v6h-1v-3h-1v3h-1v-2h-1v2h-1v-5h-1v5h-1v-2h-1v2h-1v-3h-1v3h-1v-2h-1v2H9v-5H8v5H7v-2H6v2H5v-3H4v3H2v-6z"/>

        </svg>
      </button>
    </a-tooltip>
    <a-tooltip placement="left">
      <template #title>
        <span>Урт хэмжих</span>
      </template>
      <button @click="startMeasure('length')">
        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24">
          <path
              d="M1 20h22v-8H1zm1-7h20v6h-1v-3h-1v3h-1v-2h-1v2h-1v-5h-1v5h-1v-2h-1v2h-1v-3h-1v3h-1v-2h-1v2H9v-5H8v5H7v-2H6v2H5v-3H4v3H2zm18-9v1H4V4H1v3h3V6h16v1h3V4zM3 6H2V5h1zm19 0h-1V5h1z"/>

        </svg>
      </button>
    </a-tooltip>


  </div>
</template>
<script>

import {Circle as CircleStyle, Fill, Stroke, Style} from "ol/style";
import Overlay from "ol/Overlay";

import VectorLayer from "ol/layer/Vector";
import {Draw} from "ol/interaction";
import {unByKey} from "ol/Observable";
import {Vector as VectorSource} from 'ol/source';

import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';

import {getLength, getArea} from "ol/sphere";
/**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
let sketch;

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
let helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
let helpTooltip;

/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
let measureTooltipElement;

/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
let measureTooltip;

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
const continuePolygonMsg = 'Олон өнцөгтийг үргэлжлүүлэн зурахын тулд товшино уу';

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
const continueLineMsg = 'Үргэлжлүүлэн зурахын тулд товшино уу';

/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
const pointerMoveHandler = function (evt) {
  if (evt.dragging) {
    return;
  }
  if(helpTooltipElement){
    /** @type {string} */
    let helpMsg = 'Хэмжих цэгүүдээ сонгоно уу';

    if (sketch) {
      const geom = sketch.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = continuePolygonMsg;
      } else if (geom instanceof LineString) {
        helpMsg = continueLineMsg;
      }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    helpTooltipElement.classList.remove('hidden');
  }

};


let measureDraw; // global so we can remove it later

/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
const formatLength = function (line) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'км';
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'м';
  }
  return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
const formatArea = function (polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'км<sup>2</sup>';
  } else {
    output = Math.round(area * 100) / 100 + ' ' + 'м<sup>2</sup>';
  }
  return output;
};

const style = new Style({
  fill: new Fill({
    color: 'rgba(33,128,253, 0.3)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
});
function createMeasureTooltip(map) {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center',
    stopEvent: false,
    insertFirst: false,
  });
  map.addOverlay(measureTooltip);
}

/**
 * Creates a new help tooltip
 */
function createHelpTooltip(map) {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'ol-tooltip hidden';
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left',
  });
  map.addOverlay(helpTooltip);
}
const source = new VectorSource();
export  const measureLayer = new VectorLayer({
  source: source,
  id:"measure",
  style: {
    'fill-color': 'rgba(33,128,253, 0.3)',
    'stroke-color': '#ffcc33',
    'stroke-width': 2,
    'circle-radius': 7,
    'circle-fill-color': '#ffcc33',
  },
});

export const initMeasure = (map)=>{
  map.on('pointermove', pointerMoveHandler);

  map.getViewport().addEventListener('mouseout',  ()=> {
    if(helpTooltipElement){
      helpTooltipElement.classList.add('hidden');
    }
  });
}

export const startMeasure = (map, type)=>{


  if (measureDraw) {
    measureDraw.setActive(false);
    map.removeInteraction(measureDraw);
    measureDraw = null;

    console.log("After Removal:", map.getInteractions().getArray());
  }
  const dtype = type === 'area' ? 'Polygon' : 'LineString';
  measureDraw = new Draw({
    source: source,
    type: dtype,
    style: function (feature) {
      const geometryType = feature.getGeometry().getType();
      if (geometryType === dtype || geometryType === 'Point') {
        return style;
      }
    },
  });

  map.addInteraction(measureDraw);


  createMeasureTooltip(map);
  createHelpTooltip(map);
  let listener;
  measureDraw.on('drawstart', (evt) => {
    // set sketch
    sketch = evt.feature;


    let tooltipCoord = evt.coordinate;

    listener = sketch.getGeometry().on('change', function (evt) {
      const geom = evt.target;
      let output;
      if (geom instanceof Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  });

  measureDraw.on('drawend', () => {

    measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    measureTooltip.setOffset([0, -7]);
    // unset sketch
    sketch = null;
    // unset tooltip so that a new one can be created
    measureTooltipElement = null;
    createMeasureTooltip(map);
    unByKey(listener);



    measureDraw.setActive(false);
    map.removeInteraction(measureDraw);
    map.removeInteraction(measureDraw);
    measureDraw = null;

    if (helpTooltipElement) {
      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      helpTooltipElement = null;
    }



  });



}
export default {
  emits:["startMeasure"],
  methods:{
    startMeasure(type){
      this.$emit("startMeasure", type)
    }
  }
}
</script>
