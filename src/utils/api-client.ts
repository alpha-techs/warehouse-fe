import type { ApiConfig } from 'src/api/Api'
import { Api } from 'src/api/Api'

const apiConfig: ApiConfig<null> = {
  baseUrl: import.meta.env.VITE_APP_API_URL,
}
export const apiClient = new Api<null>(apiConfig)
