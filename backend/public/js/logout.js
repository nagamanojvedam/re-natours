import axios from 'axios';
import { showAlert } from './alerts';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v2/users/logout',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logging out...');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again!');
  }
};
