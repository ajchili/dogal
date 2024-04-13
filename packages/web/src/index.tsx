import { createRoot } from 'react-dom/client';
import "./firebase.js";
import { Provider } from 'react-redux';
import { store } from './state/store.js';
import { Router } from './components/Router/Router.js';

const appElement = document.getElementById('app');

if (!appElement) {
    throw new Error("Unable to initialize app, missing root div!");
}

const root = createRoot(appElement);
root.render(<Provider store={store}><Router /></Provider>);