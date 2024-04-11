import { createRoot } from 'react-dom/client';

const appElement = document.getElementById('app');

if (!appElement) {
    throw new Error("Unable to initialize app, missing root div!");
}

const root = createRoot(appElement);
root.render(<h1>Hello, world</h1>);
