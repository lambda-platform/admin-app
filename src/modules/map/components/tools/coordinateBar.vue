<template>
  <div id="coordinate-bar" class="ol-unselectable"></div>
</template>
<script>
import {transform} from 'ol/proj';
export const initCoordinate = (map)=>{
  map.on('pointermove', (e)=> {
    // Get the coordinates of the event
    var coordinate = e.coordinate;

    // Transform from the current projection (e.g., EPSG:3857) to EPSG:4326 (latitude/longitude)
    var ll = transform(coordinate, 'EPSG:3857', 'EPSG:4326');

    // Update the container with the new coordinates, rounded to a reasonable number of decimal places
    document.getElementById('coordinate-bar').innerHTML = 'DD '+ll[1].toFixed(5) + ',  ' + ll[0].toFixed(5);

  });
}
</script>
