import {Alert} from 'react-native';
import {CommonActions} from '@react-navigation/routers';
import axios from 'axios';
import {navRef} from '@pages';
import {getToken} from '.';

const api = axios.create({
  baseURL: 'https://api.anderva.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    return getToken().then(accessToken => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
  },
  error => Promise.reject(error),
);

// ** Add request/response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    //     console.log('interceptor response error', error);

    //     // ** const { config, response: { status } } = error
    //     const {config, response} = error;
    //     // const originalRequest = config;

    //     // ** if (status === 401) {
    //     if (response && response.status === 401) {
    //       return handleUnauthorized();

    //       // if (!this.isAlreadyFetchingAccessToken) {
    //       //   this.isAlreadyFetchingAccessToken = true;
    //       //   // this.refreshToken().then(r => {
    //       //   // this.isAlreadyFetchingAccessToken = false;
    //       //   // ** Update accessToken in localStorage
    //       //   // this.setToken(r.data.accessToken);
    //       //   // this.setRefreshToken(r.data.refreshToken)
    //       //   // this.onAccessTokenFetched(r.data.accessToken);
    //       //   // });
    //       // }
    //       // const retryOriginalRequest = new Promise(resolve => {
    //       //   // this.addSubscriber(accessToken => {
    //       //   //   // ** Make sure to assign accessToken according to your response.
    //       //   //   // ** Check: https://pixinvent.ticksy.com/ticket/2413870
    //       //   //   // ** Change Authorization header
    //       //   //   originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    //       //   resolve(axios(originalRequest));
    //       //   // });
    //       // });
    //       // return retryOriginalRequest;
    //     }

    //     if (response && response.data && response.data.error) {
    //       // console.log('MIDDLEWARE ERROR', response);

    //       if (
    //         response.data.error.statusCode &&
    //         response.data.error.statusCode === 401
    //       ) {
    //         return handleUnauthorized();
    //       }

    //       // if (Array.isArray(response.data.error.details)) {
    //       //   response.data.error.details.forEach(element => {
    //       //     // toast.error(<ToastContentErrorDetails data={element} />, {
    //       //     //   transition: Slide,
    //       //     //   hideProgressBar: true,
    //       //     //   autoClose: 12000,
    //       //     // });
    //       //   });
    //       // }
    //     }
    // if (error.response && error.response.status !== 200) {
    //   // Alert.alert('Gabim në komunikim me server!');
    // }
    // console.warn('API Error', error);
    return Promise.reject(error);
  },
);

const handleUnauthorized = () => {
  console.error('Unauthorized user');
  navRef().dispatch(
    CommonActions.reset({
      index: 0,
      key: null,
      routes: [{name: 'GetStarted'}],
    }),
  );
};

export {api};
