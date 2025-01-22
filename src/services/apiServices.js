/* eslint-disable no-useless-catch */
import { TIMEOUT } from '../config/constants';

export const ajax = async (enpoint, method = 'GET', uploadData = null) => {
  try {
    const fetchRequest = uploadData
      ? await fetch(enpoint, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : await fetch(enpoint, { method: method });

    const response = await Promise.race([fetchRequest, timeout()]);
    if (!response.ok) throw new Error('Failed to fetch data from API');
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const timeout = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after five seconds`));
    }, TIMEOUT.LONG);
  });
};
