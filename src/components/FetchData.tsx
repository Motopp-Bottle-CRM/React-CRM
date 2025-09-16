import { SERVER } from '../services/ApiUrls'

export const Header = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token'),
  org: localStorage.getItem('org')
}

export const Header1 = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token')
}
/* old function
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
} */


// Helper function to refresh token
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${SERVER}auth/refresh-token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken })
  })

  if (!response.ok) {
    throw new Error('Token refresh failed')
  }

  const data = await response.json()
  localStorage.setItem('Token', `Bearer ${data.access}`)
  if (data.refresh) {
    localStorage.setItem('refreshToken', data.refresh)
  }
  return data.access
}

//  updated function to handle unauthorized access with token refresh
export function fetchData(url: any, method: any, data: any, header: any) {
  return fetch(`${SERVER}${url}`, {
    method,
    headers: header,
    body: data
  }).then(async (response) => {
    // If token expired, try to refresh it
    if (response.status === 401) {
      try {
        const newAccessToken = await refreshToken()
        // Retry the original request with new token
        const newHeader = {
          ...header,
          Authorization: `Bearer ${newAccessToken}`
        }
        
        const retryResponse = await fetch(`${SERVER}${url}`, {
          method,
          headers: newHeader,
          body: data
        })
        
        if (retryResponse.ok) {
          const json = await retryResponse.json()
          return json
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // If refresh fails, logout user
        localStorage.removeItem('Token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('org')
        window.location.href = '/login'
        throw new Error('Session expired - please login again')
      }
    }

    if (response.status === 403) {
      // Auto logout for forbidden access
      localStorage.removeItem('Token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('org')
      window.location.href = '/login'
      throw new Error('Access denied - user logged out')
    }

    const json = await response.json()
    if (!response.ok) {
      throw json // will be caught in .catch()
    }
    return json
  })
}

// new logic handling problems with Edit
/*
 export function fetchData(url: string, method: string, data?: any, header?: any) {
  const options: RequestInit = {
    method,
    headers: header,
  };

  // only attach body for non-GET requests
  if (data && method !== 'GET') {
    options.body = data;
  }

  return fetch(`${SERVER}${url}`, options).then(async (response) => {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('Token');
      localStorage.removeItem('org');
      window.location.href = '/login';
      throw new Error("Unauthorized - user logged out");
    }

    const json = await response.json();
    if (!response.ok) {
      throw json;
    }
    return json;
  });
}

*/