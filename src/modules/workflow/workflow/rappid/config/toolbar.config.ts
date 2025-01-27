import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '../../theme';

export const toolbarConfig = {
    tools: [
        {
            type: 'undo',
            name: 'undo',
            group: 'undo-redo',
            attrs: {
                button: {
                    'data-tooltip': 'Үйлдэл буцаах <i>(Ctrl+Z)</i>',
                    'data-tooltip-position': 'top',
                    'type': 'button'
                }
            }
        },
        {
            type: 'redo',
            name: 'redo',
            group: 'undo-redo',
            attrs: {
                button: {
                    'data-tooltip': 'Дахин хийх <i>(Ctrl+Y)</i>',
                    'data-tooltip-position': 'top',
                    'type': 'button'
                }
            }
        },
        {
            type: 'zoom-in',
            name: 'zoom-in',
            group: 'zoom',
            max: ZOOM_MAX,
            step: ZOOM_STEP,
            attrs: {
                button: {
                    'data-tooltip': 'Томруулах <i>(Ctrl+Plus)</i>',
                    'data-tooltip-position': 'top',
                    'type': 'button'
                }
            }
        },
        {
            type: 'zoom-out',
            name: 'zoom-out',
            group: 'zoom',
            min: ZOOM_MIN,
            step: ZOOM_STEP,
            attrs: {
                button: {
                    'data-tooltip': 'Багасгах <i>(Ctrl+Minus)</i>',
                    'data-tooltip-position': 'top',
                    'type': 'button'
                }
            }
        },
        {
            type: 'zoom-to-fit',
            name: 'zoom-to-fit',
            group: 'zoom',
            max: ZOOM_MAX,
            min: ZOOM_MIN,
            step: ZOOM_STEP,
            useModelGeometry: true,
            attrs: {
                button: {
                    'data-tooltip': 'Үйлдэлрүү очих <i>(Ctrl+0)</i>',
                    'data-tooltip-position': 'top',
                    'type': 'button'
                }
            }
        },
        {
            type: 'button',
            name: 'png',
            group: 'export',
            text: 'Зураг татах',
            attrs: {
                button: {
                    id: 'btn-png',
                    'data-tooltip': 'Зураг татах <i>(Ctrl+E)</i>',
                    'data-tooltip-position': 'top',
                    'type': 'button'
                }
            }
        }
    ]
};
