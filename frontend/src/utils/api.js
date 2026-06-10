import API_BASE from './config'

const BASE = API_BASE + '/api'

const getHeaders = (admin = false) => {
  const token = admin
    ? localStorage.getItem('moxie_admin_token')
    : localStorage.getItem('moxie_user_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

export const api = {
  get: (url, admin = false) =>
    fetch(BASE + url, { headers: getHeaders(admin) }).then(r => r.json()),

  post: (url, body, admin = false) =>
    fetch(BASE + url, {
      method: 'POST',
      headers: getHeaders(admin),
      body: JSON.stringify(body)
    }).then(r => r.json()),

  put: (url, body, admin = false) =>
    fetch(BASE + url, {
      method: 'PUT',
      headers: getHeaders(admin),
      body: JSON.stringify(body)
    }).then(r => r.json()),

  delete: (url, admin = false) =>
    fetch(BASE + url, { method: 'DELETE', headers: getHeaders(admin) }).then(r => r.json())
}

export default api
