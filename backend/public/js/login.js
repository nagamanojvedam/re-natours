import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v2/users/login',
      data: {
        email,
        password,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'You are Logged in successfully', 3);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message, 7);
  }
};
