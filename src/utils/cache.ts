export function setCache<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getCache<T>(key: string): T | null {
  const value = localStorage.getItem(key)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function removeCache(key: string) {
  localStorage.removeItem(key)
}
