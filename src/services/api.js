const BASE_URL = 'https://dummyjson.com'

export async function apiRequest(path, options = {}) {
  const { token, headers, body, ...rest } = options

  const isFormData = body instanceof FormData

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data?.message ?? data?.error
    throw new Error(message || 'Unexpected server error')
  }

  return data
}

