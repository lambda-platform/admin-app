import { defineAsyncComponent } from 'vue'
export const customElementList = [
  {
    element: "datetimeAutoFill",
    component: defineAsyncComponent(() => import("./datetimeAutoFill.vue")),
  },
  {
    element: "inputWithIcon",
    component: defineAsyncComponent(() => import("./inputWithIcon.vue")),
  },
  {
    element: "Point",
    component: defineAsyncComponent(() => import("./GIS/Point.vue")),
  },
  {
    element: "Point3D",
    component: defineAsyncComponent(() => import("./GIS/Point3D.vue")),
  },
  {
    element: "Polygon",
    component: defineAsyncComponent(() => import("./GIS/Polygon.vue")),
  },
  {
    element: "mapserver_layer",
    component: defineAsyncComponent(() => import("./GIS/mapserver_layer.vue")),
  },
  {
    element: "MultiPolygon",
    component: defineAsyncComponent(() => import("./GIS/MultiPolygon.vue")),
  },
  {
    element: "Line",
    component: defineAsyncComponent(() => import("./GIS/Line.vue")),
  },
  {
    element: "MultiLine",
    component: defineAsyncComponent(() => import("./GIS/MultiLine.vue")),
  },
  {
    element: "MapWithGeometry",
    component: defineAsyncComponent(() => import("./GIS/MapWithGeometry.vue")),
  },
  {
    element: "workflow",
    component: defineAsyncComponent(() =>
      import("../modules/workflow/form_grid_elements/form/workflow.vue")
    ),
  },
  {
    element: "process_status",
    component: defineAsyncComponent(() =>
      import("~/modules/workflow/form_grid_elements/form/process_status.vue")
    ),
  },
  {
    element: "process_status_changer",
    component: defineAsyncComponent(() =>
      import(
        "~/modules/workflow/form_grid_elements/form/process_status_changer.vue"
      )
    ),
  },
];
