import axios from 'axios';
import ShowAlert, { showAlert } from './alerts';

//type is 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url = //hitting an appropiate endpoint depending on 'type' var
      type === 'data'
        ? '/api/v1/users/updateMe'
        : '/api/v1/users/updatePassword';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Sucessfully`);
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
