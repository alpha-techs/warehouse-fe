import type { ApiConfig } from 'src/api/Api'
import { Api } from 'src/api/Api'

const apiConfig: ApiConfig<null> = {
  baseUrl: 'http://localhost:8000/api/v1'
}
export const apiClient = new Api<null>(apiConfig)
