const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function signup(data) {
  const response = await fetch(`${API_BASE_URL}/api/v1/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Signup failed' }))
    throw new Error(error.message || 'Signup failed')
  }

  return response.json()
}

export async function verifyEmail(data) {
  const response = await fetch(`${API_BASE_URL}/api/v1/verifyemail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Verification failed' }))
    throw new Error(error.message || 'Verification failed')
  }

  return response.json()
}

export async function login(data) {
  const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message || 'Login failed')
  }

  return response.json()
}

export async function logout(token) {
  const response = await fetch(`${API_BASE_URL}/api/v1/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Logout failed' }))
    throw new Error(error.message || 'Logout failed')
  }

  return response.json()
}
