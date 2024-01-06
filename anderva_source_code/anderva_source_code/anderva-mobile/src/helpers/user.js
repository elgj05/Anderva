import {api} from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export const checkCurrentUser = () => {
  return api.get('auth/current-user').catch(console.error);
};

export const login = ({email, password}) => {
  return api
    .post('auth/login', {email, password})
    .then(res => {
      // console.warn('res', res);
      if (res && res.data && res.data.userData) {
        return Promise.all([
          AsyncStorage.setItem('accessToken', res.data.accessToken),
          AsyncStorage.setItem('userData', JSON.stringify(res.data.userData)),
        ]).then(() =>
          Promise.resolve({
            status: 'success',
            message: 'Success',
          }),
        );
      } else if (res && res.data && res.data.error) {
        return Promise.resolve({
          status: 'error',
          message: 'Kredencialet jane gabim [1]',
        });
      } else {
        return Promise.resolve({
          status: 'error',
          message: 'Gabim ne komunikim me serverin',
        });
      }
    })
    .catch(error => {
      if (error.response.status === 422 || error.response.status === 401) {
        return Promise.resolve({
          status: 'error',
          message: 'Kredencialet jane gabim',
        });
      } else {
        // console.error(error);
        return Promise.resolve({
          status: 'error',
          message: 'Gabim ne komunikim me serverin',
        });
      }
    });
};

export const register = ({name, email, password}) => {
  return api
    .post('auth/register', {name, email, password})
    .then(res => {
      // console.warn('res', res);
      if (res && res.data && res.data.userData) {
        return Promise.all([
          AsyncStorage.setItem('accessToken', res.data.accessToken),
          AsyncStorage.setItem('userData', JSON.stringify(res.data.userData)),
        ]).then(() =>
          Promise.resolve({
            status: 'success',
            message: 'Success',
          }),
        );
      } else if (res && res.data && res.data.error) {
        return Promise.resolve({
          status: 'error',
          message: 'Të dhënat janë gabim [1]',
        });
      } else {
        return Promise.resolve({
          status: 'error',
          message: 'Gabim ne komunikim me serverin!',
        });
      }
    })
    .catch(error => {
      if (error.response.status === 422 || error.response.status === 401) {
        return Promise.resolve({
          status: 'error',
          message: 'Të dhënat janë gabim',
        });
      } else if (error.response?.data?.error?.message) {
        return Promise.resolve({
          status: 'error',
          message: error.response?.data?.error?.message,
        });
      } else {
        // console.error(error.response.data.error.message);
        return Promise.resolve({
          status: 'error',
          message: 'Gabim ne regjistrim!',
        });
      }
    });
};

export const logout = () =>
  AsyncStorage.multiRemove(['accessToken', 'userData']);

export const getUserData = async () => {
  // get from local storage, json parsed
  const userData = await AsyncStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const isLoggedIn = () =>
  AsyncStorage.getItem('accessToken').then(d => !!d);

export const getToken = () => AsyncStorage.getItem('accessToken');
