import { dia } from '@clientio/rappid/rappid';

import RappidService from '../../services/rappid.service';
import { Controller } from '../controller';
import * as actions from '../actions';

export class KeyboardController extends Controller {

    startListening() {

        const { keyboard } = this.service;

        this.listenTo(keyboard, {
            'escape': onEscape,
            'delete backspace': onDelete,
            'ctrl+0': onCtrlZero,
            'ctrl+plus': onCtrlPlus,
            'ctrl+minus': onCtrlMinus,
            'ctrl+z': onCtrlZ,
            'ctrl+y': onCtrlY,
            'ctrl+e': onCtrlE,
        });
    }
}

function onEscape(service: RappidService): void {
    actions.setSelection(service, []);
}

function onDelete(service: RappidService): void {
    actions.removeSelection(service);
}

function onCtrlPlus(service: RappidService,  evt: dia.Event): void {
    evt.preventDefault();
    actions.zoomIn(service);
}

function onCtrlMinus(service: RappidService, evt: dia.Event): void {
    evt.preventDefault();
    actions.zoomOut(service);
}

function onCtrlZero(service: RappidService): void {
    actions.zoomToFit(service);
}

function onCtrlZ(service: RappidService): void {
    actions.undoAction(service);
}

function onCtrlY(service: RappidService): void {
    actions.redoAction(service);
}

function onCtrlE(service: RappidService): void {
    actions.exportToPNG(service);
}
