import { App } from "vue";
import Dataform from "./Dataform.vue";
import "./bootstrap"
/**
 * Initialize DataForm component
 * @param app vue instance
 */
export function installDataForm(app: App<Element>) {
    app.component("dataform", Dataform);
}
