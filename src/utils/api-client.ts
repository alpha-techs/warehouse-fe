import type { ApiConfig, AuthTokens } from 'src/api/Api'
import { Api } from 'src/api/Api'

type SecurityContext = AuthTokens | null

type UnauthorizedHandler = (context: { response: Response }) => void | Promise<void>

let unauthorizedHandler: UnauthorizedHandler | null = null
let isHandlingUnauthorized = false

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler
}

const triggerUnauthorized = (response: Response) => {
  if (!unauthorizedHandler || isHandlingUnauthorized) {
    return
  }

  isHandlingUnauthorized = true
  Promise.resolve(unauthorizedHandler({ response }))
    .catch((error) => {
      console.error('未認証エラー処理に失敗しました', error)
    })
    .finally(() => {
      isHandlingUnauthorized = false
    })
}

const customFetch = async (...fetchParams: Parameters<typeof fetch>) => {
  const [input, init] = fetchParams
  const { headers } = init || {}
  const customHeaders = {
    Accept: 'application/json',
  }
  const newHeaders = {
    ...headers,
    ...customHeaders,
  }
  const newInit = {
    ...init,
    headers: newHeaders,
  }

  const response = await fetch(input, newInit)

  if (response.status === 401) {
    triggerUnauthorized(response.clone())
  }

  return response
}
const securityWorker: ApiConfig<SecurityContext>['securityWorker'] = (tokens) => {
  if (!tokens?.accessToken) {
    return {}
  }

  return {
    headers: {
      Authorization: `${tokens.tokenType || 'Bearer'} ${tokens.accessToken}`,
    },
  }
}

const apiConfig: ApiConfig<SecurityContext> = {
  baseUrl: import.meta.env.VITE_APP_API_URL,
  customFetch,
  securityWorker,
}
export const apiClient = new Api<SecurityContext>(apiConfig)
