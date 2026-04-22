const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  }
}

// Technician APIs
export async function getTechnicians() {
  const response = await fetch(`${API_BASE_URL}/api/v2/technicians`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch technicians' }))
    throw new Error(error.message || 'Failed to fetch technicians')
  }

  return response.json()
}

export async function getPendingTechnicians() {
  const response = await fetch(`${API_BASE_URL}/api/v2/technicians/pending`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch pending technicians' }))
    throw new Error(error.message || 'Failed to fetch pending technicians')
  }

  return response.json()
}

export async function getTechnicianById(id) {
  const response = await fetch(`${API_BASE_URL}/api/v2/technicians/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch technician' }))
    throw new Error(error.message || 'Failed to fetch technician')
  }

  return response.json()
}

export async function approveTechnician(id) {
  const response = await fetch(`${API_BASE_URL}/api/v2/technicians/approve/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to approve technician' }))
    throw new Error(error.message || 'Failed to approve technician')
  }

  return response.json()
}

// Job APIs
export async function getAllJobs() {
  const response = await fetch(`${API_BASE_URL}/api/v2/alljobs`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch jobs' }))
    throw new Error(error.message || 'Failed to fetch jobs')
  }

  return response.json()
}

export async function getJobById(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/v2/jobs/${jobId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch job' }))
    throw new Error(error.message || 'Failed to fetch job')
  }

  return response.json()
}

export async function assignJob(jobId, data) {
  const response = await fetch(`${API_BASE_URL}/api/v2/jobs/assign/${jobId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to assign job' }))
    throw new Error(error.message || 'Failed to assign job')
  }

  return response.json()
}

// Notification APIs
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
