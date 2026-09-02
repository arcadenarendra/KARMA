export type IssueStatus =
  | 'New'
  | 'Under Review'
  | 'Community Verified'
  | 'In Progress'
  | 'Resolved'
  | 'Awaiting Action'

export type IssueCategory =
  | 'Healthcare'
  | 'Education'
  | 'Municipal'
  | 'Public Safety'
  | 'Infrastructure'
  | 'Other'

export type UserRole = 'citizen' | 'admin'

export interface Comment {
  id: string
  author: string
  avatar: string
  text: string
  timestamp: string
}

export interface TimelineEvent {
  id: string
  label: string
  timestamp: string
  detail?: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: IssueCategory
  location: string
  daysUnresolved: number
  upvotes: number
  comments: number
  status: IssueStatus
  reporter: string
  reporterId: string | null
  reportedDate: string
  image: string
  verified: boolean
  trending: boolean
  comments_data: Comment[]
  timeline: TimelineEvent[]
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  location: string
  joinedDate: string
  avatar: string
}

export interface ReportStats {
  total: number
  active: number
  resolved: number
  upvotes: number
  critical: number
  byCategory: { category: IssueCategory; count: number }[]
}

export type Page =
  | 'home'
  | 'explore'
  | 'issue-detail'
  | 'report'
  | 'login'
  | 'signup'
  | 'profile'
  | 'admin'
  | 'faq'

export type NavigateFn = (page: Page, id?: string) => void
