/* @vite-ignore */
import MapView from '@arcgis/core/views/MapView'
import WebMap from '@arcgis/core/webmap'
import Basemap from '@arcgis/core/Basemap'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'

export const baseMaps = [
  new Basemap({
    baseLayers: [new WebTileLayer({
      urlTemplate: 'https://{subDomain}.google.com/vt/lyrs=m&x={col}&y={row}&z={level}',
      subDomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    })],
    title: 'googleStreets',
    id: 'googleStreets',
    thumbnailUrl: '/GIS/images/baseMaps/googleStreets.jpg'
  }),
  new Basemap({
    baseLayers: [new WebTileLayer({
      urlTemplate: 'https://{subDomain}.google.com/vt/lyrs=s,h&x={col}&y={row}&z={level}',
      subDomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    })],
    title: 'googleSatellite',
    id: 'googleSatellite',

    thumbnailUrl: '/GIS/images/baseMaps/googleSatellite.jpg'
  }),
  new Basemap({
    baseLayers: [new WebTileLayer({
      urlTemplate: 'https://{subDomain}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{level}/{row}/{col}',
      subDomains: ['server', 'services']
    })],
    title: 'imagery',
    id: 'imagery',
    thumbnailUrl: '/GIS/images/baseMaps/tempimagery.jpg'
  }),
  new Basemap({
    baseLayers: [new WebTileLayer({
      urlTemplate: 'https://{subDomain}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{level}/{row}/{col}',
      subDomains: ['server', 'services']
    })],
    title: 'Topographic',
    id: 'Topographic',
    thumbnailUrl: '/GIS/images/baseMaps/topo_map_2.jpg'
  }),
  new Basemap({
    baseLayers: [new WebTileLayer({
      urlTemplate: 'https://{subDomain}.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{level}/{row}/{col}',
      subDomains: ['server', 'services']
    })],
    title: 'dark_gray_canvas',
    id: 'dark_gray_canvas',
    thumbnailUrl: '/GIS/images/baseMaps/dark_gray.png'
  }),
  new Basemap({
    baseLayers: [new WebTileLayer({
      urlTemplate: 'https://{subDomain}.tile.openstreetmap.org/{level}/{col}/{row}.png',
      subDomains: ['a', 'b', 'c']
    })],
    title: 'OpenStreetMap',
    id: 'OpenStreetMap',
    thumbnailUrl: '/GIS/images/baseMaps/openstreet.jpg'
  }),
]

export const webmap = new WebMap({
  basemap: baseMaps[0],
})
export const view = new MapView({
  container: 'viewDiv',
  map: webmap,
  center: [106.918084, 47.918771],
  zoom: 11,
})

export const initialize = (container) => {
  view.container = container;
}
