
<template>
  <div id="locate">
    <a-tooltip placement="left">
      <template #title>
        <span>Таны байршил</span>
      </template>
      <button id="locate-btn">
             <span id="locate-icon">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 24 24"
                 style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><circle cx="12" cy="12" r="5" fill="#000000" data-original="#000000" class=""></circle><path
                d="M23 11h-1.051c-.47-4.717-4.232-8.479-8.949-8.949V1a1 1 0 1 0-2 0v1.051C6.283 2.521 2.521 6.283 2.051 11H1a1 1 0 1 0 0 2h1.051c.471 4.717 4.232 8.479 8.949 8.949V23a1 1 0 1 0 2 0v-1.051c4.717-.471 8.479-4.232 8.949-8.949H23a1 1 0 1 0 0-2zm-10.014 8.933C12.95 19.414 12.529 19 12 19s-.95.414-.986.933a8.007 8.007 0 0 1-6.946-6.946C4.587 12.95 5 12.528 5 12s-.413-.95-.933-.986a8.007 8.007 0 0 1 6.946-6.946c.037.518.458.932.987.932s.95-.414.986-.933a8.007 8.007 0 0 1 6.946 6.946c-.519.037-.932.459-.932.987s.413.95.933.986a8.01 8.01 0 0 1-6.947 6.947z"
                fill="#000000" data-original="#000000" class=""></path></g></svg>
             </span>

        <span id="loading-info" style="display:none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 16 16" fill="none" class="hds-flight-icon--animation-loading">

<g fill="#000000" fill-rule="evenodd" clip-rule="evenodd">

<path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2"/>

<path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"/>

</g>

</svg>
          </span>
      </button>
    </a-tooltip>


  </div>
</template>
<script>
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {transform} from "ol/proj";
import {Point} from "ol/geom";
import {Feature} from "ol";
const locationSource = new VectorSource();
export const locationLayer = new VectorLayer({
  source: locationSource,
  id:"LocateLayer",
  style: new Style({
    image: new CircleStyle({
      radius: 8,
      fill: new Fill({
        color: '#3399CC'
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 3
      })
    })
  })
});
export const initLocate = (map, overlay, content)=>{


  const locateIcon = document.getElementById('locate-icon');
  const loadingInfo = document.getElementById('loading-info');

  document.getElementById('locate-btn').addEventListener('click', () => {
    locateIcon.style.display = 'none';  // Hide locate icon
    loadingInfo.style.display = 'inline'; // Show loading info

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        locateIcon.style.display = 'inline';  // Show locate icon
        loadingInfo.style.display = 'none'; // Hide loading info

        const coords = transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857');

        map.getView().animate({
          center: coords,
          zoom: 15
        });

        // Add a point for the user's location
        const locationFeature = new Feature(new Point(coords));
        locationSource.clear();
        locationSource.addFeature(locationFeature);


        var ll = transform(coords, 'EPSG:3857', 'EPSG:4326');

        // Update the container with the new coordinates, rounded to a reasonable number of decimal places
        let locationTxt = 'DD '+ll[1].toFixed(5) + ',  ' + ll[0].toFixed(5);
        content.innerHTML = `<p>Таны байршил</p><code>${locationTxt}</code>`;

        overlay.setPosition(coords);
      }, (error) => {
        locateIcon.style.display = 'inline';  // Show locate icon
        loadingInfo.style.display = 'none'; // Hide loading info
        console.error('Geolocation Error: ', error);
        alert('Error occurred while fetching geolocation.');
      });
    } else {
      locateIcon.style.display = 'inline';  // Show locate icon
      loadingInfo.style.display = 'none'; // Hide loading info
      alert('Geolocation is not supported by this browser.');
    }
  });
}

</script>
