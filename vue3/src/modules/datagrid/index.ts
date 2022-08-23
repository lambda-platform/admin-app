import { App } from "vue";
import DataGrid from "./Datagrid.vue";

/**
 * Initialize DataGrid component
 * @param app vue instance
 */
export function installDataGrid(app: App<Element>) {
    app.component("datagrid", DataGrid);
}
