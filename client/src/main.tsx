import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { persistor, store } from './redux-store/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  alert('Root element not found!');
}
console.log('=====')
if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <App />
      </PersistGate>
    </Provider>
  );
} else {
  console.error("Root element not found. Make sure there's a <div id='root'></div> in your HTML.");
}
