import { App } from "vue";
import krud from "./krud.vue";

/**
 * Initialize Krud component
 * @param app vue instance
 */
export function installKrud(app: App<Element>) {
    app.component("krud", krud);
}
