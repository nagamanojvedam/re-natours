import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v2/users/updateMy${type === 'data' ? 'Data' : 'Password'}`,
      data,
    });

    if (res.data.status === 'success')
      showAlert('success', `${type.toUpperCase()} updated successfully`);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
