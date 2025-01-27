import { mvc } from '@clientio/rappid/rappid';
import RappidService from '../services/rappid.service';

export enum SharedEvents {
    JSON_EDITOR_CHANGED = 'json-editor-changed',
    SELECTION_CHANGED = 'selection-changed',
    GRAPH_CHANGED = 'graph-changed',
    GRAPH_START_BATCH = 'graph-start-batch',
    GRAPH_STOP_BATCH = 'graph-stop-batch',
}

export abstract class Controller extends mvc.Listener<[RappidService]> {

    constructor(public readonly service: RappidService) {
        super(service);
        this.startListening();
    }

    abstract startListening(): void;
}
