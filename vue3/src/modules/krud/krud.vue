<template>
    <Canvas v-bind="property"></Canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Canvas from "./template/Canvas.vue"
export default defineComponent({
    props: {
        template: {
            type: String,
            required: false,
            default: 'canvas'
        },
        property: {
            type: Object,
            required: true,
            default: {

            }
        },

    },
    components: {
        Canvas
    },
    setup() {

        return {

        }

    }

});
</script>
