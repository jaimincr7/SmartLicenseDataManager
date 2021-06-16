import axios from 'axios';
import { toast } from 'react-toastify';
import config from './config';

const request = axios.create({
  baseURL: config.baseApi, // url = base url + request url
  timeout: 5000,
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptors Customize based on your need
request.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    // config.headers["Authorization"] = 'Bearer ' + authToken;
    return config;
  },
  (error) => {
    alert(error);
    Promise.reject(error);
  }
);

// Response interceptors Customize based on your need
request.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data?.code && data?.code !== 200) {
      return Promise.reject(new Error(data.message || 'Error'));
    } else {
      return response;
    }
  },
  (error) => {
    // Log somewhere
    toast.error(error.response.data.body.errors);
    switch (error.response.status) {
      // Authorization Failed Response can add other status codes here to manage error Logging
      case 403:
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

export default request;
