import type { CommentRecord, PublicComment, PublicReport, PublicUser, ReportRecord, TimelineEventRecord, UserRecord } from '../models/types.js'
import { daysUnresolved, formatDate, formatDateTime, initials } from '../models/helpers.js'

export function userView(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    joinedDate: formatDate(user.createdAt),
    avatar: initials(user.name),
  }
}

export function commentView(comment: CommentRecord): PublicComment {
  return {
    id: comment.id,
    author: comment.authorName,
    avatar: comment.avatar,
    text: comment.text,
    timestamp: formatDateTime(comment.createdAt),
  }
}

export function timelineView(event: TimelineEventRecord) {
  return {
    id: event.id,
    label: event.label,
    timestamp: formatDateTime(event.timestamp),
    detail: event.detail ?? undefined,
  }
}

export function reportView(
  report: ReportRecord,
  comments: CommentRecord[],
  timeline: TimelineEventRecord[],
): PublicReport {
  const unresolved = daysUnresolved(report.createdAt, report.resolvedAt)
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    category: report.category,
    location: report.location,
    daysUnresolved: unresolved,
    upvotes: report.upvotes,
    comments: comments.length,
    status: report.status,
    reporter: report.reporterName,
    reporterId: report.reporterId,
    reportedDate: formatDate(report.createdAt),
    image: report.image,
    verified: report.verified,
    trending: report.upvotes >= 200 && report.status !== 'Resolved',
    comments_data: comments.map(commentView),
    timeline: timeline.map(timelineView),
  }
}
