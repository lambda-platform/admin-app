import {WKB, WKT} from 'ol/format';
import {TileImage} from 'ol/source';

export const decodeHexewkbToWkt = (hexewkb) => {
    const wkbFormat = new WKB();
    const wktFormat = new WKT();

    // Step 1: Decode HEXEWKB to binary
    const binary = new Uint8Array(hexewkb.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));

    // Step 2: Read the binary into a geometry object
    const geometry = wkbFormat.readGeometry(binary);

    // Step 3: Convert the geometry to WKT format
    return wktFormat.writeGeometry(geometry);
}
export const to3D = (coord, is3D) => {
    if (coord.length === 3 || !is3D) return coord;
    return [...coord, 0];
}


export const bases = {
    googleLayerRoadmap: new TileImage({url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"}),
    googleLayerSatellite: new TileImage({url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"}),
    googleLayerRoadNames: new TileImage({url: "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"}),
    osm: new TileImage({url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),
    otm: new TileImage({url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png"}),

    esriLayerStreet: new TileImage({url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"}),
    esriLayerTopo: new TileImage({url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"}),
    iMap: new TileImage({url: "https://cloudgis.mn/map01/Tilemap/demo/{z}/{x}/{y}.png?mskey=12345"}),
}
var templateRe = /\{ *([\w_-]+) *\}/g;

export function template(str, data) {
    return str.replace(templateRe, function (str, key) {
        var value = data[key];

        if (value === undefined) {
          value = "-";

        } else if (typeof value === 'function') {
            value = value(data);
        }
        return value;
    });
}
export function convertToRGBA(color, opacity) {
  // Create a canvas element dynamically
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Try to set the color and use the canvas to convert it
  ctx.fillStyle = color;

  // Apply the color by drawing on the canvas
  ctx.fillRect(0, 0, 1, 1); // Draw a tiny rectangle to apply the color

  // Extract the RGBA values from the canvas
  const data = ctx.getImageData(0, 0, 1, 1).data;

  // Construct the RGBA string
  return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${opacity ? opacity : (data[3] / 255).toFixed(2)})`;
}
