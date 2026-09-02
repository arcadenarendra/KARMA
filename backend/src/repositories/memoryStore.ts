import { randomUUID } from 'node:crypto'
import type {
  CommentRecord,
  IssueStatus,
  ReportRecord,
  Store,
  TimelineEventRecord,
  UserRecord,
  VoteRecord,
} from '../models/types.js'
import { hashPassword } from '../models/helpers.js'
import { seedIssues } from '../models/seedData.js'

export class MemoryStore implements Store {
  private users: UserRecord[] = []
  private reports: ReportRecord[] = []
  private comments: CommentRecord[] = []
  private timeline: TimelineEventRecord[] = []
  private votes: VoteRecord[] = []

  async seed() {
    const admin = await this.createUser({
      name: 'KARM Admin',
      email: 'admin@karm.local',
      passwordHash: await hashPassword('admin123'),
      role: 'admin',
      location: 'Ahmedabad',
    })

    for (const issue of seedIssues) {
      this.reports.push({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        location: issue.location,
        status: issue.status,
        reporterId: null,
        reporterName: issue.reporterName,
        image: issue.image,
        verified: issue.verified,
        upvotes: issue.votes,
        createdAt: issue.createdAt,
        resolvedAt: issue.status === 'Resolved' ? issue.createdAt : null,
      })

      for (const comment of issue.comments) {
        this.comments.push({
          id: randomUUID(),
          reportId: issue.id,
          authorId: null,
          authorName: comment.authorName,
          avatar: comment.avatar,
          text: comment.text,
          createdAt: comment.createdAt,
        })
      }

      for (const event of issue.timeline) {
        this.timeline.push({
          id: randomUUID(),
          reportId: issue.id,
          label: event.label,
          detail: event.detail ?? null,
          timestamp: event.timestamp,
        })
      }

    }

    return admin
  }

  async listUsers() {
    return [...this.users]
  }

  async findUserByEmail(email: string) {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase()) ?? null
  }

  async findUserById(id: string) {
    return this.users.find(user => user.id === id) ?? null
  }

  async createUser(input: Omit<UserRecord, 'id' | 'createdAt'> & { id?: string }) {
    const user: UserRecord = {
      id: input.id ?? randomUUID(),
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      role: input.role,
      location: input.location,
      createdAt: new Date().toISOString(),
    }
    this.users.push(user)
    return user
  }

  async listReports() {
    return [...this.reports].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  }

  async findReport(id: string) {
    return this.reports.find(report => report.id === id) ?? null
  }

  async createReport(input: Omit<ReportRecord, 'id' | 'createdAt' | 'resolvedAt'> & { id?: string }) {
    const report: ReportRecord = {
      ...input,
      id: input.id ?? randomUUID(),
      upvotes: 0,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    }
    this.reports.unshift(report)
    return report
  }

  async updateReportStatus(id: string, status: IssueStatus) {
    const report = await this.findReport(id)
    if (!report) return null
    report.status = status
    report.resolvedAt = status === 'Resolved' ? new Date().toISOString() : null
    if (status === 'Community Verified') report.verified = true
    return report
  }

  async listComments(reportId: string) {
    return this.comments
      .filter(comment => comment.reportId === reportId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  }

  async addComment(input: Omit<CommentRecord, 'id' | 'createdAt'> & { id?: string }) {
    const comment: CommentRecord = {
      ...input,
      id: input.id ?? randomUUID(),
      createdAt: new Date().toISOString(),
    }
    this.comments.unshift(comment)
    return comment
  }

  async listTimeline(reportId: string) {
    return this.timeline
      .filter(event => event.reportId === reportId)
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
  }

  async addTimelineEvent(input: Omit<TimelineEventRecord, 'id'> & { id?: string }) {
    const event: TimelineEventRecord = { ...input, id: input.id ?? randomUUID() }
    this.timeline.push(event)
    return event
  }

  async hasVote(reportId: string, userId: string) {
    return this.votes.some(vote => vote.reportId === reportId && vote.userId === userId)
  }

  async addVote(reportId: string, userId: string) {
    const report = await this.findReport(reportId)
    if (!report) return false
    if (await this.hasVote(reportId, userId)) return false
    this.votes.push({ reportId, userId })
    report.upvotes += 1
    return true
  }
}
