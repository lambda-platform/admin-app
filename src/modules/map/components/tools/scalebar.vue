<template>
  <div id="scale-bar"></div>
</template>
<script >
import {ScaleLine} from "ol/control";

export class CustomScaleLine extends ScaleLine {
  updateElement_() {

    super.updateElement_();


    if (this.renderedHTML_ && this.element) {
      this.renderedHTML_ = this.renderedHTML_.replace(' km', ' км').replace(' m', ' м');

      this.element.childNodes[0].innerHTML = this.renderedHTML_;
    }
  }
}

export const initScaleBar = (map)=>{
  var scaleBar = new CustomScaleLine({
    target: document.getElementById('scale-bar'),
  });
  map.addControl(scaleBar);
}

</script>
