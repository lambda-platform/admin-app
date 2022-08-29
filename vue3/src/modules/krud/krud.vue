<template>
    <component :is="renderTemplate(property.template)" v-bind="property"/>
</template>
<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'

const templates = {
    'canvas': defineAsyncComponent(() => import('./templates/canvas.vue')),
    'drawer': defineAsyncComponent(() => import('./templates/drawer.vue'))
    // edit:"edit",
    // create:"create",
    // list:"list",
}

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
            default: {}
        },

    },
    setup () {
        const renderTemplate = (template) => {
            if (templates.hasOwnProperty(template)) {
                return templates[template]
            } else {
                return templates.canvas
            }
        }
        return {
            renderTemplate
        }

    }

})
</script>
