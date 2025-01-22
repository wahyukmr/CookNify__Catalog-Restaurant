import { Workbox } from 'workbox-window';
import { showWarningNotification } from './notifications';

const serviceWorkerRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    showWarningNotification('Service Worker not supported in the browser');
    return;
  }

  const wb = new Workbox('./service-worker.bundle.js');

  try {
    await wb.register();
    console.log('Service worker registered');
  } catch (error) {
    console.log('Failed to register service worker', error.message);
  }
};

export default serviceWorkerRegister;
