import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v2/users/signup',
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'You are successfully signed up! Please check your email for details.',
        3,
      );
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 7);
  }
};
