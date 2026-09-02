export const ISSUE_STATUSES = [
  'New',
  'Under Review',
  'Community Verified',
  'In Progress',
  'Resolved',
  'Awaiting Action',
] as const

export const ISSUE_CATEGORIES = [
  'Healthcare',
  'Education',
  'Municipal',
  'Public Safety',
  'Infrastructure',
  'Other',
] as const

export type IssueStatus = (typeof ISSUE_STATUSES)[number]
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]
export type UserRole = 'citizen' | 'admin'

export type UserRecord = {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  location: string
  createdAt: string
}

export type TimelineEventRecord = {
  id: string
  reportId: string
  label: string
  detail: string | null
  timestamp: string
}

export type CommentRecord = {
  id: string
  reportId: string
  authorId: string | null
  authorName: string
  avatar: string
  text: string
  createdAt: string
}

export type ReportRecord = {
  id: string
  title: string
  description: string
  category: IssueCategory
  location: string
  status: IssueStatus
  reporterId: string | null
  reporterName: string
  image: string
  verified: boolean
  upvotes: number
  createdAt: string
  resolvedAt: string | null
}

export type VoteRecord = {
  reportId: string
  userId: string
}

export type PublicUser = {
  id: string
  name: string
  email: string
  role: UserRole
  location: string
  joinedDate: string
  avatar: string
}

export type PublicComment = {
  id: string
  author: string
  avatar: string
  text: string
  timestamp: string
}

export type PublicTimelineEvent = {
  id: string
  label: string
  timestamp: string
  detail?: string
}

export type PublicReport = {
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
  comments_data: PublicComment[]
  timeline: PublicTimelineEvent[]
}

export type Store = {
  listUsers(): Promise<UserRecord[]>
  findUserByEmail(email: string): Promise<UserRecord | null>
  findUserById(id: string): Promise<UserRecord | null>
  createUser(input: Omit<UserRecord, 'id' | 'createdAt'> & { id?: string }): Promise<UserRecord>
  listReports(): Promise<ReportRecord[]>
  findReport(id: string): Promise<ReportRecord | null>
  createReport(input: Omit<ReportRecord, 'id' | 'createdAt' | 'resolvedAt'> & { id?: string }): Promise<ReportRecord>
  updateReportStatus(id: string, status: IssueStatus): Promise<ReportRecord | null>
  listComments(reportId: string): Promise<CommentRecord[]>
  addComment(input: Omit<CommentRecord, 'id' | 'createdAt'> & { id?: string }): Promise<CommentRecord>
  listTimeline(reportId: string): Promise<TimelineEventRecord[]>
  addTimelineEvent(input: Omit<TimelineEventRecord, 'id'> & { id?: string }): Promise<TimelineEventRecord>
  hasVote(reportId: string, userId: string): Promise<boolean>
  addVote(reportId: string, userId: string): Promise<boolean>
}
