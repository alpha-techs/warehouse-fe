import type { ApiConfig } from 'src/api/Api'
import { Api } from 'src/api/Api'

const customFetch = (...fetchParams: Parameters<typeof fetch>) => {
  const [input, init] = fetchParams
  const { headers } = init || {}
  const customHeaders = {
    'Accept': 'application/json',
  }
  const newHeaders = {
    ...headers,
    ...customHeaders,
  }
  const newInit = {
    ...init,
    headers: newHeaders,
  }
  return fetch(input, newInit)
}
const apiConfig: ApiConfig<null> = {
  baseUrl: import.meta.env.VITE_APP_API_URL,
  customFetch,
}
export const apiClient = new Api<null>(apiConfig)
