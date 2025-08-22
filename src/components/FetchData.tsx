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
    
    if (!response.ok) {
      console.error(`HTTP ${response.status} error:`, responseData)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return responseData
  })
}
