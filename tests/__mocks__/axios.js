'use strict';


const axios = jest.createMockFromModule('axios');

/** Simulate RESTApi server behavior. Sort of...
 * */
axios.create.mockImplementation((config) => {
  const client = {
    get: jest.fn().mockImplementation((url) => {
      const _url = new URL(url, config.baseURL);

      // console.log(`Send GET to <<${_url}>>`);

      const [, resource, id] = _url.pathname.split("/");
      const result = axios.__testData[resource].find(item => item.id == id);

      return new Promise((resolve, reject) => resolve({data: result, status: 200}));
    }),
    post: jest.fn().mockImplementation((url, data) => {
      const _url = new URL(url, config.baseURL);

      // console.log(`Send POST to <<${_url}>>`);
      // console.log({data});

      return new Promise((resolve, reject) => resolve({data: data, status: 201}));
    }),
    defaults: {headers: config.headers},
    baseURL: config.baseURL
  };

  return client;
});

axios.__loadTestData = (testData) => axios.__testData = {...testData};

module.exports = axios;
