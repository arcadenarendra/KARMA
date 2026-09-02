import type { Issue, ReportStats, User } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

function getToken() {
  return localStorage.getItem('karm_token')
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('karm_token', token)
  else localStorage.removeItem('karm_token')
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(typeof data.message === 'string' ? data.message : `Request failed (${response.status})`)
  }
  return data as T
}

export const api = {
  getIssues: () => request<Issue[]>('/reports'),
  getIssueById: (id: string) => request<Issue>(`/reports/${id}`),
  getStats: () => request<ReportStats>('/reports/stats'),
  submitReport: (body: {
    title: string
    description: string
    category: string
    location: string
    image?: string
    anonymous: boolean
  }) => request<Issue>('/reports', { method: 'POST', body: JSON.stringify(body) }),
  upvoteIssue: (id: string) => request<{ upvotes: number }>(`/reports/${id}/upvote`, { method: 'POST' }),
  resolveIssue: (id: string) => request<Issue>(`/reports/${id}/resolve`, { method: 'POST' }),
  updateStatus: (id: string, status: string) =>
    request<Issue>(`/reports/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addComment: (id: string, text: string) =>
    request<Issue['comments_data'][number]>(`/reports/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),
  register: (body: { name: string; email: string; password: string; location?: string }) =>
    request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request<User>('/auth/me'),
}
