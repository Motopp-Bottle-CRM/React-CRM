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

export function fetchData(url: any, method: any, data = '', header: any) {
  return fetch(`${SERVER}${url}`, {
    method,
    headers: header,
<<<<<<< HEAD
    body: data
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json()
    } else {
      throw new Error("Response is not JSON")
    }
  })
=======
    body: data,
  }).then(async (response) => {
    const json = await response.json();
    if (!response.ok) {
      throw json; // will be caught in .catch()
    }
    return json;
  });
>>>>>>> origin/somayeh_sprint1_setup
}
