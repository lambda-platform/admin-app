import { App } from "vue";
import Krud from "./Krud.vue";

/**
 * Initialize Krud component
 * @param app vue instance
 */
export function installKrud(app: App<Element>) {
    app.component("krud", Krud);
}
