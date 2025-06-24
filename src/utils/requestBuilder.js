import {base_url} from './env';
import EncryptedStorage from 'react-native-encrypted-storage';
// get api call function

import axios from 'axios';

export const get = async (url, useToken = false) => {
  try {
    // Initialize headers object
    const headers = {};

    // Check if token should be used
    if (useToken) {
      const userInfo = JSON.parse(await EncryptedStorage.getItem('userData'));

      // Check if userInfo is defined and has a token
      if (userInfo && userInfo.token) {
        const userToken = userInfo.token;
        headers.Authorization = `Bearer ${userToken}`;
      } else {
        throw new Error('User token not found');
      }
    }

    // Include headers in the axios request
    const {data} = await axios.get(`${base_url}${url}`, {headers});
    return {status: data.statusCode, response: data.response};
  } catch (error) {
    const status = error.response?.status || 500;
    const response = error.response?.data?.response || 'An error occurred';
    return {status, response};
  }
};

// patch api call function
export const patch = async (url, body, token = true, name) => {
  try {
    let headers = new Headers();
    headers.append('x-encrypted-key', tenantId);
    headers.append('Content-Type', 'application/json');
    if (token == true) {
      let authToken = await EncryptedStorage.getItem('userInfo');
      authToken = JSON.parse(authToken).token;
      headers.append('Authorization', `Bearer ${authToken}`);
    }

    let requestOptions = {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    };
    let response = await fetch(`${base_url}${url}`, requestOptions);

    if (response.status == 200) {
      let json = await response.json();

      return {response: json, status: response.status};
    } else {
      return {status: response.status, response};
    }
  } catch (error) {
    console.log(name, ' :', error);
  }
};

export const post = async (url, body, useToken = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (useToken) {
      const userInfo = JSON.parse(await EncryptedStorage.getItem('userData'));
      if (userInfo && userInfo.token) {
        const userToken = userInfo.token;
        headers.Authorization = `Bearer ${userToken}`;
        console.log(useToken);
      } else {
        throw new Error('User token not found');
      }
    }

    const {data} = await axios.post(`${base_url}${url}`, body, {headers});

    return {
      status: data.statusCode,
      response: data.response,
    };
  } catch (error) {
    console.error('Error sending data:', error);

    const status = error.response?.status || 500;
    const response = error.response?.data?.response || 'An error occurred';

    return {status, response};
  }
};

export const put = async (url, body, useToken = true) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (useToken) {
      const userInfo = JSON.parse(await EncryptedStorage.getItem('userData'));
      if (userInfo && userInfo.token) {
        const userToken = userInfo.token;
        headers.Authorization = `Bearer ${userToken}`;
      } else {
        throw new Error('User token not found');
      }
    }

    const {data} = await axios.put(`${base_url}${url}`, body, {headers});

    return {
      status: data.statusCode,
      response: data.response,
    };
  } catch (error) {
    console.error('Error updating data:', error);

    const status = error.response?.status || 500;
    const response = error.response?.data?.response || 'An error occurred';

    return {status, response};
  }
};

export const deleteApi = async (url, body, useToken = true) => {
  try {
    // Initialize headers object
    const headers = {
      'Content-Type': 'application/json',
    };

    // Check if token should be used
    if (useToken) {
      const userInfo = JSON.parse(await EncryptedStorage.getItem('userData'));
      // Check if userInfo is defined and has a token
      if (userInfo) {
        const userToken = userInfo.token;
        headers.Authorization = `Bearer ${userToken}`;
      } else {
        throw new Error('User token not found');
      }
    }

    const response = await axios.delete(`${base_url}${url}`, {
      headers,
      data: body,
    });

    // Handle the response
    if (response.status === 200) {
      const json = response.data;
      return {status: response.status, response: json};
    } else {
      return {status: response.status, response: response.data};
    }
  } catch (error) {
    console.log('Error:', error);

    const status = error.response?.status || 500; // Default to 500 if status is not available
    const response = error.response?.data?.response || 'An error occurred';
    return {status, response};
  }
};

export const uploadMediaToServer = async mediaArray => {
  const formData = new FormData();

  mediaArray.forEach(media => {
    formData.append('media', {
      uri: media.uri,
      type: media.type,
      name: media.fileName,
    });
  });

  try {
    const {data} = await axios.post(
      `${base_url}api/v1/user/profile/upload`,
      // `http://192.168.188.88:3000/api/v1/user/profile/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return {status: data.statusCode, response: data.response};
  } catch (error) {
    // Log detailed error information
    console.error('Error uploading media:', {
      message: error.message,
      response: error.response?.data || 'No response data',
      status: error.response?.status || 'No status code',
      headers: error.response?.headers || 'No headers',
    });

    // Optionally, return a structured error response
    return {
      status: error.response?.status || 500,
      response:
        error.response?.data || 'An error occurred while uploading media',
    };
  }
};
