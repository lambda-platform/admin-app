import {WKB, WKT} from 'ol/format';
import {TileImage} from 'ol/source';

function isHexewkb(string) {
  // Check if the string only contains hexadecimal characters and has an even length
  return /^[0-9a-fA-F]+$/.test(string) && string.length % 2 === 0;
}

function isWkt(string) {
  // Check if the string contains common WKT keywords
  const wktKeywords = ['POINT', 'LINESTRING', 'MULTILINESTRING', 'POLYGON', 'MULTIPOLYGON', 'GEOMETRYCOLLECTION'];
  const upperString = string.toUpperCase().trim();

  return wktKeywords.some(keyword => upperString.startsWith(keyword));
}

export function checkStringFormat(string) {
  if (isHexewkb(string)) {
    return 'hexewkb';
  } else if (isWkt(string)) {
    return 'wkt';
  } else {
    return 'unknown';
  }
}

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
