import { ObjectDirective } from 'vue';
import { SharedEvents } from '../rappid/controller';

const BATCH_NAME = 'inspector-input';

const batchDirective = {
    mounted(element, binding) {
        const { eventBusService } = binding.value;
        const onFocus = () => {
            eventBusService.emit(SharedEvents.GRAPH_START_BATCH, BATCH_NAME);
        };

        const onFocusOut = () => {
            eventBusService.emit(SharedEvents.GRAPH_STOP_BATCH, BATCH_NAME);
        };

        element.addEventListener('focus', onFocus);
        element.addEventListener('focusout', onFocusOut);

        element._onFocus = onFocus;
        element._onFocusOut = onFocusOut;
    },
    unmounted(element) {
        if (element._onFocus) {
            element.removeEventListener('focus', element._onFocus);
        }
        if (element._onFocusOut) {
            element.removeEventListener('focusout', element._onFocusOut);
        }
    }
};


export default batchDirective;
