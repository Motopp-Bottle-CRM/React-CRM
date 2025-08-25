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
  const headers: Record<string, string | null> = {
    ...header,
  }
  const token = localStorage.getItem('Token')
  const org = localStorage.getItem('org')
  if (token && !headers['Authorization']) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  }
  if (org && !headers['org']) headers['org'] = org

  const fetchOptions: RequestInit = {
    method,
    headers: headers as HeadersInit,
  }
  const upperMethod = String(method || '').toUpperCase()
  if (data !== '' && upperMethod !== 'GET' && upperMethod !== 'HEAD') {
    ;(fetchOptions as any).body = data
  }

  return fetch(`${SERVER}${url}`, fetchOptions).then(async (response) => {
    const contentType = response.headers.get("content-type")
    let responseData
    
    if (contentType && contentType.indexOf("application/json") !== -1) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
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


