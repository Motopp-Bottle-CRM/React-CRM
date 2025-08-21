import { SERVER } from '../services/ApiUrls'

export const Header = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token'),
  org: localStorage.getItem('org'),
}

export const Header1 = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token'),
}
/*
export function fetchData(url: any, method: any, data = '', header: any) {
  return fetch(`${SERVER}${url}`, {
    method,
    headers: header,
    body: data,
  }).then(async (response) => {
    const json = await response.json();
    if (!response.ok) {
      throw json; // will be caught in .catch()
    }
    return json;
  });
}*/

//  updated fuction to handle unauthorized access
export function fetchData(url: any, method: any, data = '', header: any) {
  return fetch(`${SERVER}${url}`, {
    method,
    headers: header,
    body: data,
  }).then(async (response) => {
    if (response.status === 401 || response.status === 403) {
      // Auto logout
      localStorage.removeItem('Token');
      localStorage.removeItem('org');
      window.location.href = '/login';
      throw new Error("Unauthorized - user logged out");
    }

    const json = await response.json();
    if (!response.ok) {
      throw json; // will be caught in .catch()
    }
    return json;
  });
}


