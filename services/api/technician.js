const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  }
}

export async function getTechnicianJobs() {
  const response = await fetch(`${API_BASE_URL}/api/v2/technician/jobs`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch jobs' }))
    throw new Error(error.message || 'Failed to fetch jobs')
  }

  return response.json()
}

export async function getTechnicianJobById(id) {
  const response = await fetch(`${API_BASE_URL}/api/v2/technician/jobs/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch job' }))
    throw new Error(error.message || 'Failed to fetch job')
  }

  return response.json()
}

export async function updateJobStatus(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/v2/technician/jobs/status/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update job status' }))
    throw new Error(error.message || 'Failed to update job status')
  }

  return response.json()
}

export async function getNotifications(userId) {
  const response = await fetch(`${API_BASE_URL}/api/v2/notifications/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch notifications' }))
    throw new Error(error.message || 'Failed to fetch notifications')
  }

  return response.json()
}
