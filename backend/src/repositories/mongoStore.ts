import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'
import type {
  CommentRecord,
  IssueStatus,
  ReportRecord,
  Store,
  TimelineEventRecord,
  UserRecord,
} from '../models/types.js'
import { hashPassword } from '../models/helpers.js'
import { seedIssues } from '../models/seedData.js'
import { CommentModel, ReportModel, TimelineModel, UserModel, VoteModel } from '../models/mongoSchemas.js'

function iso(value: Date | string | null | undefined) {
  if (!value) return null
  return new Date(value).toISOString()
}

type Lean = Record<string, unknown>

function mapUser(doc: Lean): UserRecord {
  return {
    id: String(doc._id),
    name: String(doc.name),
    email: String(doc.email),
    passwordHash: String(doc.passwordHash),
    role: doc.role === 'admin' ? 'admin' : 'citizen',
    location: String(doc.location ?? ''),
    createdAt: iso(doc.createdAt as Date | string | undefined) ?? new Date().toISOString(),
  }
}

function mapReport(doc: Lean): ReportRecord {
  return {
    id: String(doc._id),
    title: String(doc.title),
    description: String(doc.description),
    category: doc.category as ReportRecord['category'],
    location: String(doc.location),
    status: doc.status as ReportRecord['status'],
    reporterId: doc.reporterId ? String(doc.reporterId) : null,
    reporterName: String(doc.reporterName),
    image: String(doc.image ?? ''),
    verified: Boolean(doc.verified),
    upvotes: Number(doc.upvotes ?? 0),
    createdAt: iso(doc.createdAt as Date | string | undefined) ?? new Date().toISOString(),
    resolvedAt: iso((doc.resolvedAt as Date | string | null | undefined) ?? null),
  }
}

export class MongoStore implements Store {
  static async connect(databaseUrl: string) {
    await mongoose.connect(databaseUrl)
    const store = new MongoStore()
    await store.seedIfEmpty()
    return store
  }

  private async seedIfEmpty() {
    const count = await ReportModel.countDocuments()
    if (count > 0) return

    await this.createUser({
      name: 'KARM Admin',
      email: 'admin@karm.local',
      passwordHash: await hashPassword('admin123'),
      role: 'admin',
      location: 'Ahmedabad',
    })

    for (const issue of seedIssues) {
      await ReportModel.create({
        _id: issue.id,
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
        createdAt: new Date(issue.createdAt),
        resolvedAt: issue.status === 'Resolved' ? new Date(issue.createdAt) : null,
      })

      for (const comment of issue.comments) {
        await CommentModel.create({
          _id: randomUUID(),
          reportId: issue.id,
          authorId: null,
          authorName: comment.authorName,
          avatar: comment.avatar,
          text: comment.text,
          createdAt: new Date(comment.createdAt),
        })
      }

      for (const event of issue.timeline) {
        await TimelineModel.create({
          _id: randomUUID(),
          reportId: issue.id,
          label: event.label,
          detail: event.detail ?? null,
          timestamp: new Date(event.timestamp),
        })
      }
    }
  }

  async listUsers() {
    const rows = await UserModel.find().sort({ createdAt: 1 }).lean()
    return rows.map(row => mapUser(row as Lean))
  }

  async findUserByEmail(email: string) {
    const row = await UserModel.findOne({ email: email.toLowerCase() }).lean()
    return row ? mapUser(row as Lean) : null
  }

  async findUserById(id: string) {
    const row = await UserModel.findById(id).lean()
    return row ? mapUser(row as Lean) : null
  }

  async createUser(input: Omit<UserRecord, 'id' | 'createdAt'> & { id?: string }) {
    const row = await UserModel.create({
      _id: input.id ?? randomUUID(),
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      role: input.role,
      location: input.location,
    })
    return mapUser(row.toObject() as Lean)
  }

  async listReports() {
    const rows = await ReportModel.find().sort({ createdAt: -1 }).lean()
    return rows.map(row => mapReport(row as Lean))
  }

  async findReport(id: string) {
    const row = await ReportModel.findById(id).lean()
    return row ? mapReport(row as Lean) : null
  }

  async createReport(input: Omit<ReportRecord, 'id' | 'createdAt' | 'resolvedAt'> & { id?: string }) {
    const row = await ReportModel.create({
      _id: input.id ?? randomUUID(),
      title: input.title,
      description: input.description,
      category: input.category,
      location: input.location,
      status: input.status,
      reporterId: input.reporterId,
      reporterName: input.reporterName,
      image: input.image,
      verified: input.verified,
      upvotes: 0,
    })
    return mapReport(row.toObject() as Lean)
  }

  async updateReportStatus(id: string, status: IssueStatus) {
    const row = await ReportModel.findByIdAndUpdate(
      id,
      {
        status,
        resolvedAt: status === 'Resolved' ? new Date() : null,
        ...(status === 'Community Verified' ? { verified: true } : {}),
      },
      { new: true },
    ).lean()
    return row ? mapReport(row as Lean) : null
  }

  async listComments(reportId: string) {
    const rows = await CommentModel.find({ reportId }).sort({ createdAt: -1 }).lean()
    return rows.map(row => ({
      id: String(row._id),
      reportId: String(row.reportId),
      authorId: row.authorId ? String(row.authorId) : null,
      authorName: String(row.authorName),
      avatar: String(row.avatar ?? ''),
      text: String(row.text),
      createdAt: iso(row.createdAt as Date | string | undefined) ?? new Date().toISOString(),
    }))
  }

  async addComment(input: Omit<CommentRecord, 'id' | 'createdAt'> & { id?: string }) {
    const row = await CommentModel.create({
      _id: input.id ?? randomUUID(),
      reportId: input.reportId,
      authorId: input.authorId,
      authorName: input.authorName,
      avatar: input.avatar,
      text: input.text,
    })
    return {
      id: String(row._id),
      reportId: row.reportId,
      authorId: row.authorId ?? null,
      authorName: row.authorName,
      avatar: row.avatar,
      text: row.text,
      createdAt: iso(row.createdAt) ?? new Date().toISOString(),
    }
  }

  async listTimeline(reportId: string) {
    const rows = await TimelineModel.find({ reportId }).sort({ timestamp: 1 }).lean()
    return rows.map(row => ({
      id: String(row._id),
      reportId: String(row.reportId),
      label: String(row.label),
      detail: row.detail ? String(row.detail) : null,
      timestamp: iso(row.timestamp as Date | string | undefined) ?? new Date().toISOString(),
    }))
  }

  async addTimelineEvent(input: Omit<TimelineEventRecord, 'id'> & { id?: string }) {
    const row = await TimelineModel.create({
      _id: input.id ?? randomUUID(),
      reportId: input.reportId,
      label: input.label,
      detail: input.detail,
      timestamp: new Date(input.timestamp),
    })
    return {
      id: String(row._id),
      reportId: row.reportId,
      label: row.label,
      detail: row.detail ?? null,
      timestamp: iso(row.timestamp) ?? new Date().toISOString(),
    }
  }

  async hasVote(reportId: string, userId: string) {
    return Boolean(await VoteModel.exists({ reportId, userId }))
  }

  async addVote(reportId: string, userId: string) {
    try {
      await VoteModel.create({ reportId, userId })
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) return false
      throw error
    }
    await ReportModel.findByIdAndUpdate(reportId, { $inc: { upvotes: 1 } })
    return true
  }
}
