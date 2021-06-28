const axios = require('axios');

const service = axios.create({
  timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

class Request {
  static get(url, params) {
    return new Promise((resolve, reject) => {
      service
        .get(url, {
          params,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static post(url, data) {
    return new Promise((resolve, reject) => {
      service
        .post(url, {
          data,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = Request;
