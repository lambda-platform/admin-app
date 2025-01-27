import { watch, onMounted } from 'vue';

export default function useCellInteraction() {
    const addCellListener = (cell, assignFormFieldsFn) => {
        cell.on('change', assignFormFieldsFn);
    };

    const removeCellListener = (cell) => {
        cell.off('all');
    };

    const setupCellInteraction = (cell, assignFormFieldsFn) => {
        watch(() => cell, (newCell, oldCell) => {
            if (oldCell) {
                removeCellListener(oldCell);
            }
            if (newCell) {
                addCellListener(newCell, assignFormFieldsFn);
                assignFormFieldsFn();
            }
        }, { deep: false });

        onMounted(() => {
            if (cell) {
                addCellListener(cell, assignFormFieldsFn);
                assignFormFieldsFn();
            }
        });
    };

    return { setupCellInteraction };
}
