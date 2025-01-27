import { dia, ui, shapes } from '@clientio/rappid/rappid';

import RappidService from '../services/rappid.service';
import { SharedEvents } from './controller';
import { addCellTools } from './tools';
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '../theme';
import { stencilConfig } from './config/stencil.config';
import { ShapeTypesEnum } from './shapes/app.shapes';
import { PADDING_L } from '../theme';
import axios from '~/plugins/core/axios';
// Selection

export function setSelection(service: RappidService, selection: dia.Cell[]): void {
    const { paper, selection: previousSelection, eventBusService } = service;
    paper.removeTools();
    previousSelection.forEach(cell => {
        const cellView = cell.findView(paper);
        if (cellView) {
            cellView.vel.removeClass('selected');
        }
    });
    service.selection = selection;
    selection.forEach(cell => {
        const cellView = cell.findView(paper);
        if (cellView) {
            cellView.vel.addClass('selected');
            addCellTools(cellView);
        }
    });
    eventBusService.emit(SharedEvents.SELECTION_CHANGED, selection);
}

export function removeSelection(service: RappidService) {
    const { selection, graph } = service;
    if (selection.length === 0) return;
    graph.removeCells(selection);
}

// Zooming

export function zoomToFit(service: RappidService) {
    const { scroller } = service;
    scroller.zoomToFit({
        minScale: ZOOM_MIN,
        maxScale: ZOOM_MAX,
        scaleGrid: ZOOM_STEP,
        useModelGeometry: true,
        padding: PADDING_L
    });
}

export function zoomIn(service: RappidService) {
    const { scroller } = service;
    scroller.zoom(ZOOM_STEP, {
        min: ZOOM_MIN,
        max: ZOOM_MAX,
    });
}

export function zoomOut(service: RappidService) {
    const { scroller } = service;
    scroller.zoom(-ZOOM_STEP, {
        min: ZOOM_MIN,
        max: ZOOM_MAX,
    });
}

// Import / Export

export function exportToPNG(service: RappidService): void {
    const { paper } = service;
    paper.hideTools();
    // Dump all views that are not in the viewport
    paper.dumpViews();
    paper.toPNG((dataURL: string): void => {
        paper.showTools();
        openImageDownloadDialog(service, dataURL);
    }, {
        padding: 10,
        useComputedStyles: false
    });
}

export function openImageDownloadDialog(service: RappidService, dataURL: string, fileName: string = 'Rappid'): void {
    const { keyboard, controllers } = service;
    const { keyboard: keyboardCtrl } = controllers;
    keyboardCtrl.stopListening();
    const lightbox = new ui.Lightbox({
        image: dataURL,
        downloadable: true,
        fileName
    });
    lightbox.on('action:close', () => {
        keyboardCtrl.startListening();
    });
    lightbox.listenTo(keyboard, 'escape', () => {
        keyboardCtrl.startListening();
        lightbox.close();
    });
    lightbox.open();
}

export function importGraphFromJSON(service: RappidService, json: any): void {
    setSelection(service, []);
    const { graph, history } = service;
    const shapeTypes = Object.values(ShapeTypesEnum);
    history.reset();
    try {
        if (json.cells.some((cell: any) => !shapeTypes.includes(cell.type))) {
            throw new Error('Invalid JSON: Unknown Cell Type');
        }
        graph.fromJSON(json);
    } catch (e) {
        // Invalid JSON format
    }
}

// Stencil

// export function loadStencilShapes(service: RappidService): void {
//     const { stencil } = service;
//     // @ts-ignore
//     const stencilShapes = stencilConfig.shapes.map(shape => new shapes.stencil[shape.name](shape));
//     stencil.load(stencilShapes);
// }
export async function loadStencilShapes(service: RappidService): Promise<void> {
  const { stencil } = service;

  try {
    // Fetch steps from the API
    const response = await axios.get('/workflow/steps');
    const steps = response.data;

    // Map API steps to stencil format
    const apiShapes = steps.map((step: any) => {
      // Map sub-process step ports into ports configuration
      const ports = [
        { group: 'in' }, // Default "in" port
        ...step.sub_process_step_ports.map((port: any) => ({
          group: port.group,
          attrs: { portLabel: { text: port.attrs } }
        }))
      ];

      return {
        name: "Message", // Use the label for a unique name
        attrs: {
          label: { text: step.label },
          description: { text: step.description || 'No description available' },
          icon: { xlinkHref: step.icon || 'default-icon-path' },
          ports: { items: ports }, // Use mapped ports
          subject: {
            object_type: step.object_type,
            subject_type: step.subject_type,
            role_id: step.org_role_id,
            user_id: step.emp_id,
            is_read_only: step.is_read_only,
            is_signature_needed: step.is_signature_needed,
            is_subject_changeable: step.is_subject_changeable
          }
        }
      };
    });

    const staticShapes = stencilConfig.shapes;
    const firstStaticShapes = staticShapes.slice(0, -3); // All but the last 3 shapes
    const lastThreeStaticShapes = staticShapes.slice(-3); // The last 3 static shapes

    // Merge static shapes, API shapes, and last 3 static shapes
    const stencilShapes = [...firstStaticShapes, ...apiShapes, ...lastThreeStaticShapes];


    // Load shapes into the stencil
    // @ts-ignore
    const stencilInstances = stencilShapes.map(shape => new shapes.stencil[shape.name](shape));
    stencil.load(stencilInstances);

  } catch (error) {
    console.error('Error loading stencil shapes:', error);
  }
}
// Paper

export function updateLinksRouting(service: RappidService): void {
    const { paper, graph } = service;
    graph.getLinks().forEach(link => {
        const linkView = link.findView(paper) as dia.LinkView;
        if (linkView) {
            linkView.requestConnectionUpdate();
        }
    });
}

// History

export function undoAction(service: RappidService) {
    const { history } = service;
    history.undo();
}

export function redoAction(service: RappidService) {
    const { history } = service;
    history.redo();
}
