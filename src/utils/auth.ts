import { TOKEN_CACHE_KEY } from '@/constants/cache'
import { getCache, removeCache, setCache } from '@/utils/cache'

export function getToken() {
  return getCache<string>(TOKEN_CACHE_KEY)
}

export function setToken(token: string) {
  setCache(TOKEN_CACHE_KEY, token)
}

export function clearToken() {
  removeCache(TOKEN_CACHE_KEY)
}
