import { Workbox } from 'workbox-window';
import { showErrorNotification, showWarningNotification } from './notifications';

const serviceWorkerRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    showWarningNotification('Service Worker not supported in the browser');
    return;
  }

  const wb = new Workbox('./service-worker.bundle.js');

  try {
    await wb.register();
  } catch (error) {
    showErrorNotification(`Failed to register service worker: ${error.message}`);
  }
};

export default serviceWorkerRegister;
