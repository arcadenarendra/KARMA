import type { Request, Response } from 'express'
import { ISSUE_CATEGORIES, ISSUE_STATUSES, type IssueCategory, type IssueStatus, type Store } from '../models/types.js'
import { daysUnresolved, initials } from '../models/helpers.js'
import { commentView, reportView } from '../views/serializers.js'
import type { AuthedRequest } from '../middleware/auth.js'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1566276423184-a8c13d2a88a1?w=800&h=450&fit=crop&auto=format'

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function asId(value: unknown): string {
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '')
}

async function hydrate(store: Store, reportId: string) {
  const report = await store.findReport(reportId)
  if (!report) return null
  const [comments, timeline] = await Promise.all([
    store.listComments(report.id),
    store.listTimeline(report.id),
  ])
  return reportView(report, comments, timeline)
}

export async function listReports(request: Request, response: Response) {
  const { store } = request as AuthedRequest
  const reports = await store.listReports()
  const payload = await Promise.all(reports.map(report => hydrate(store, report.id)))
  response.json(payload.filter(Boolean))
}

export async function getReport(request: Request, response: Response) {
  const { store } = request as AuthedRequest
  const report = await hydrate(store, asId(request.params.id))
  if (!report) {
    response.status(404).json({ message: 'Issue not found' })
    return
  }
  response.json(report)
}

export async function createReport(request: Request, response: Response) {
  const { store, user } = request as AuthedRequest
  const title = asString(request.body?.title)
  const description = asString(request.body?.description) || 'No description provided.'
  const category = asString(request.body?.category) as IssueCategory
  const location = asString(request.body?.location)
  const image = asString(request.body?.image) || DEFAULT_IMAGE
  const anonymous = Boolean(request.body?.anonymous)

  if (!title || !location || !ISSUE_CATEGORIES.includes(category)) {
    response.status(400).json({ message: 'Title, location, and a valid category are required' })
    return
  }

  const reporterName = anonymous || !user ? 'Anonymous' : user.name
  const report = await store.createReport({
    title,
    description,
    category,
    location,
    status: 'New',
    reporterId: anonymous ? null : user?.id ?? null,
    reporterName,
    image,
    verified: false,
    upvotes: 0,
  })

  await store.addTimelineEvent({
    reportId: report.id,
    label: 'Reported',
    detail: 'Issue submitted with a public tracking clock.',
    timestamp: report.createdAt,
  })

  response.status(201).json(await hydrate(store, report.id))
}

export async function upvoteReport(request: Request, response: Response) {
  const { store, user } = request as AuthedRequest
  if (!user) {
    response.status(401).json({ message: 'Sign in required to upvote' })
    return
  }

  const report = await store.findReport(asId(request.params.id))
  if (!report) {
    response.status(404).json({ message: 'Issue not found' })
    return
  }

  await store.addVote(report.id, user.id)
  const updated = await store.findReport(report.id)
  response.json({ upvotes: updated?.upvotes ?? report.upvotes })
}

export async function resolveReport(request: Request, response: Response) {
  const { store, user } = request as AuthedRequest
  const report = await store.findReport(asId(request.params.id))
  if (!report) {
    response.status(404).json({ message: 'Issue not found' })
    return
  }

  const isOwner = Boolean(user && report.reporterId && report.reporterId === user.id)
  const isAdmin = user?.role === 'admin'
  if (!isOwner && !isAdmin) {
    response.status(403).json({ message: 'Only the reporter or an admin can resolve this issue' })
    return
  }

  await store.updateReportStatus(report.id, 'Resolved')
  await store.addTimelineEvent({
    reportId: report.id,
    label: 'Resolved',
    detail: 'Marked as resolved.',
    timestamp: new Date().toISOString(),
  })

  response.json(await hydrate(store, report.id))
}

export async function updateStatus(request: Request, response: Response) {
  const { store } = request as AuthedRequest
  const status = asString(request.body?.status) as IssueStatus
  if (!ISSUE_STATUSES.includes(status)) {
    response.status(400).json({ message: 'Invalid status' })
    return
  }

  const report = await store.updateReportStatus(asId(request.params.id), status)
  if (!report) {
    response.status(404).json({ message: 'Issue not found' })
    return
  }

  await store.addTimelineEvent({
    reportId: report.id,
    label: status,
    detail: `Status updated to ${status}.`,
    timestamp: new Date().toISOString(),
  })

  response.json(await hydrate(store, report.id))
}

export async function addComment(request: Request, response: Response) {
  const { store, user } = request as AuthedRequest
  if (!user) {
    response.status(401).json({ message: 'Sign in required to comment' })
    return
  }

  const text = asString(request.body?.text)
  if (!text) {
    response.status(400).json({ message: 'Comment text is required' })
    return
  }

  const report = await store.findReport(asId(request.params.id))
  if (!report) {
    response.status(404).json({ message: 'Issue not found' })
    return
  }

  const comment = await store.addComment({
    reportId: report.id,
    authorId: user.id,
    authorName: user.name,
    avatar: initials(user.name),
    text,
  })

  response.status(201).json(commentView(comment))
}

export async function stats(request: Request, response: Response) {
  const { store } = request as AuthedRequest
  const reports = await store.listReports()
  const active = reports.filter(report => report.status !== 'Resolved')
  const resolved = reports.filter(report => report.status === 'Resolved')
  const byCategory = ISSUE_CATEGORIES.map(category => ({
    category,
    count: reports.filter(report => report.category === category).length,
  }))

  response.json({
    total: reports.length,
    active: active.length,
    resolved: resolved.length,
    upvotes: reports.reduce((sum, report) => sum + report.upvotes, 0),
      critical: reports.filter(report => report.status !== 'Resolved' && daysUnresolved(report.createdAt, report.resolvedAt) >= 30).length,
    byCategory,
  })
}
