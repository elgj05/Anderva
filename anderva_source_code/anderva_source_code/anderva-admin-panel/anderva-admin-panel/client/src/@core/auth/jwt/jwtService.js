import { Fragment } from 'react'
import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'
import baseUrl from '@configs/api'
import { toast, Slide } from 'react-toastify'

const ToastContentError = ({ data }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        {/* <Avatar size='sm' color='success' icon={<Coffee size={12} />} /> */}
        <h6 className='toast-title font-weight-bold'>Error {data.statusCode}: {data.name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <h6>Server Message:</h6>
      <b>{data.message}</b>
    </div>
  </Fragment>
)

const ToastContentErrorDetails = ({ data }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        {/* <Avatar size='sm' color='success' icon={<Coffee size={12} />} /> */}
        <h6 className='toast-title font-weight-bold'>Error {data.code}: {data.path}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <h6>Server Message:</h6>
      <b>{data.message}</b>
    </div>
  </Fragment>
)

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const accessToken = this.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        
        // add baseUrl to endpoints
        if(config.url.indexOf(baseUrl)!==0){
          config.url = baseUrl + config.url
        }
        
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        // ** if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken().then(r => {
              this.isAlreadyFetchingAccessToken = false

              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken)
              // this.setRefreshToken(r.data.refreshToken)

              this.onAccessTokenFetched(r.data.accessToken)
            })
          }
          const retryOriginalRequest = new Promise(resolve => {
            this.addSubscriber(accessToken => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              resolve(this.axios(originalRequest))
            })
          })
          return retryOriginalRequest
        }

        if(response && response.data && response.data.error){
          console.log("MIDDLEWARE ERROR", response)
          toast.error(
            <ToastContentError data={response.data.error} />,
            { transition: Slide, hideProgressBar: true, autoClose: 12000 }
          )

          if(Array.isArray(response.data.error.details)){
            response.data.error.details.forEach(element => {
              toast.error(
                <ToastContentErrorDetails data={element} />,
                { transition: Slide, hideProgressBar: true, autoClose: 12000 }
              )
            });
          }
        }

        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  logout(...args) {
    return axios.get(this.jwtConfig.logoutEndpoint, ...args)
  }

  refreshToken() {
    return axios.get(this.jwtConfig.refreshEndpoint, {})
  }
}
