import { Notyf } from 'notyf';

class NotyfService {
  constructor() {
    this.notyf = new Notyf({
      duration: 3000,
      ripple: true,
      position: {
        x: 'left',
        y: 'top',
      },
      types: [
        {
          type: 'success',
          background: 'rgba(255, 195, 0, 0.95)',
          icon: {
            className: 'material-icons',
            tagName: 'i',
            text: 'check_circle',
            color: 'rgb(255, 255, 255)',
          },
        },
        {
          type: 'error',
          background: 'indianred',
          icon: {
            className: 'material-icons',
            tagName: 'i',
            text: 'error',
            color: 'rgb(255, 255, 255)',
          },
        },
        {
          type: 'warning',
          background: 'rgba(255, 138, 95, 0.95)',
          icon: {
            className: 'material-icons',
            tagName: 'i',
            text: 'warning',
            color: 'rgb(255, 255, 255)',
          },
        },
      ],
    });
  }

  showSuccess(message) {
    this.notyf.success(message);
  }

  showError(message) {
    this.notyf.error(message);
  }

  showWarning(message) {
    this.notyf.open({
      type: 'warning',
      message,
    });
  }
}

export default new NotyfService();
