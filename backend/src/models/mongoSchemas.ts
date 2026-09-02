import mongoose from 'mongoose'
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from './types.js'

export const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['citizen', 'admin'] },
    location: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const reportSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ISSUE_CATEGORIES },
    location: { type: String, required: true },
    status: { type: String, required: true, enum: ISSUE_STATUSES },
    reporterId: { type: String, default: null },
    reporterName: { type: String, required: true },
    image: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    upvotes: { type: Number, default: 0 },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const commentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    reportId: { type: String, required: true, index: true },
    authorId: { type: String, default: null },
    authorName: { type: String, required: true },
    avatar: { type: String, default: '' },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const timelineSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  reportId: { type: String, required: true, index: true },
  label: { type: String, required: true },
  detail: { type: String, default: null },
  timestamp: { type: Date, required: true },
})

export const voteSchema = new mongoose.Schema({
  reportId: { type: String, required: true },
  userId: { type: String, required: true },
})

voteSchema.index({ reportId: 1, userId: 1 }, { unique: true })
reportSchema.index({ status: 1, category: 1, createdAt: -1 })

export const UserModel = mongoose.models.User ?? mongoose.model('User', userSchema)
export const ReportModel = mongoose.models.Report ?? mongoose.model('Report', reportSchema)
export const CommentModel = mongoose.models.Comment ?? mongoose.model('Comment', commentSchema)
export const TimelineModel = mongoose.models.TimelineEvent ?? mongoose.model('TimelineEvent', timelineSchema)
export const VoteModel = mongoose.models.Vote ?? mongoose.model('Vote', voteSchema)
