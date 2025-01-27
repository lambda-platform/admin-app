
import { reactive, readonly } from 'vue';

const state = reactive({
  listeners: {} // Changed from events to listeners for clarity
});

const emit = (event, payload) => {
  if (state.listeners[event]) {
    state.listeners[event].forEach(callback => callback(payload)); // Invoke each callback
  }
};

const on = (event, callback) => {
  if (!state.listeners[event]) {
    state.listeners[event] = [];
  }
  state.listeners[event].push(callback);
};

const off = (event, callback) => {
  if (state.listeners[event]) {
    const index = state.listeners[event].indexOf(callback);
    if (index > -1) {
      state.listeners[event].splice(index, 1);
    }
  }
};

export const EventBus = readonly({ emit, on, off });
