import notyfService from '../services/notyfService';

/**
 * Display success notification
 * @param {string} message - Notification message
 */
export const showSuccessNotification = (message) => {
  notyfService.showSuccess(message);
};

/**
 * Display information notification
 * @param {string} message - Notification message
 */
export const showWarningNotification = (message) => {
  notyfService.showWarning(message);
};

/**
 * Display error notification
 * @param {string} message - Notification message
 */
export const showErrorNotification = (message) => {
  notyfService.showError(message);
};
