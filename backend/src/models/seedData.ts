import type { IssueCategory, IssueStatus } from '../models/types.js'

export type SeedIssue = {
  id: string
  title: string
  description: string
  category: IssueCategory
  location: string
  status: IssueStatus
  reporterName: string
  image: string
  verified: boolean
  createdAt: string
  votes: number
  comments: { authorName: string; avatar: string; text: string; createdAt: string }[]
  timeline: { label: string; detail?: string; timestamp: string }[]
}

export const seedIssues: SeedIssue[] = [
  {
    id: '1',
    title: 'Broken Streetlights on SG Highway',
    description: 'Multiple streetlights have been non-functional for the last several weeks, making the stretch dangerous for pedestrians and motorists after dark.',
    category: 'Infrastructure',
    location: 'SG Highway, Ahmedabad',
    status: 'Awaiting Action',
    reporterName: 'Anonymous',
    image: 'https://images.unsplash.com/photo-1566276423184-a8c13d2a88a1?w=800&h=450&fit=crop&auto=format',
    verified: true,
    createdAt: '2026-08-02T09:14:00.000Z',
    votes: 248,
    comments: [
      { authorName: 'Priya M.', avatar: 'PM', text: 'I walk this route every night. It is genuinely terrifying.', createdAt: '2026-08-16T10:00:00.000Z' },
      { authorName: 'Rohan K.', avatar: 'RK', text: 'Already raised a complaint with the municipal corporation. No response yet.', createdAt: '2026-08-14T10:00:00.000Z' },
    ],
    timeline: [
      { label: 'Reported', detail: 'Issue submitted with photographic evidence.', timestamp: '2026-08-02T09:14:00.000Z' },
      { label: 'Community Verified', detail: 'Independent reports confirmed the issue.', timestamp: '2026-08-06T11:00:00.000Z' },
      { label: 'Forwarded to Municipal Corp.', detail: 'Escalated to Ahmedabad Municipal Corporation.', timestamp: '2026-08-08T10:00:00.000Z' },
    ],
  },
  {
    id: '2',
    title: 'Severe Waterlogging on Relief Road After Rain',
    description: 'The main drainage system on Relief Road is blocked. After rain, the road floods and becomes impassable for pedestrians.',
    category: 'Municipal',
    location: 'Relief Road, Ahmedabad',
    status: 'Under Review',
    reporterName: 'Meera S.',
    image: 'https://images.unsplash.com/photo-1761252987116-a3e993bd23e9?w=800&h=450&fit=crop&auto=format',
    verified: true,
    createdAt: '2026-07-16T08:00:00.000Z',
    votes: 412,
    comments: [
      { authorName: 'Suresh P.', avatar: 'SP', text: 'My car engine died here last week. This is causing real financial harm.', createdAt: '2026-08-17T10:00:00.000Z' },
    ],
    timeline: [
      { label: 'Reported', timestamp: '2026-07-16T08:00:00.000Z' },
      { label: 'Under Review', detail: 'Municipal drainage team assigned.', timestamp: '2026-07-25T09:00:00.000Z' },
    ],
  },
  {
    id: '3',
    title: 'Open Garbage Dump Near Residential School',
    description: 'An illegal garbage dump has formed adjacent to Sunrise Primary School. The smell and hygiene risk is severe for children every day.',
    category: 'Public Safety',
    location: 'Bopal, Ahmedabad',
    status: 'In Progress',
    reporterName: 'Kavitha N.',
    image: 'https://images.unsplash.com/photo-1602262442764-c14f8db98045?w=800&h=450&fit=crop&auto=format',
    verified: true,
    createdAt: '2026-06-28T11:30:00.000Z',
    votes: 631,
    comments: [
      { authorName: 'Parent (Anon)', avatar: 'PA', text: 'My child has been falling sick repeatedly. This is unacceptable near a school.', createdAt: '2026-08-18T10:00:00.000Z' },
    ],
    timeline: [
      { label: 'Reported', timestamp: '2026-06-28T11:30:00.000Z' },
      { label: 'In Progress', detail: 'Cleanup team dispatched.', timestamp: '2026-07-10T09:00:00.000Z' },
    ],
  },
  {
    id: '4',
    title: 'Pothole Cluster Causing Accidents on Ring Road',
    description: 'A stretch of approximately 400 metres has developed severe potholes following monsoon rains. Two motorcycle accidents have already occurred.',
    category: 'Infrastructure',
    location: 'Ring Road, Surat',
    status: 'New',
    reporterName: 'Anonymous',
    image: 'https://images.unsplash.com/photo-1741996951192-f4762170f3cb?w=800&h=450&fit=crop&auto=format',
    verified: false,
    createdAt: '2026-08-10T07:45:00.000Z',
    votes: 143,
    comments: [],
    timeline: [{ label: 'Reported', timestamp: '2026-08-10T07:45:00.000Z' }],
  },
  {
    id: '5',
    title: 'Non-functional Water Supply in Ward 14',
    description: 'Residents of Ward 14 have had no piped water supply for several consecutive days. Standby tankers arrive irregularly.',
    category: 'Municipal',
    location: 'Ward 14, Rajkot',
    status: 'Community Verified',
    reporterName: 'Harish T.',
    image: 'https://images.unsplash.com/photo-1546173974-49aab15604d5?w=800&h=450&fit=crop&auto=format',
    verified: true,
    createdAt: '2026-08-13T09:00:00.000Z',
    votes: 89,
    comments: [],
    timeline: [
      { label: 'Reported', timestamp: '2026-08-13T09:00:00.000Z' },
      { label: 'Community Verified', timestamp: '2026-08-14T16:00:00.000Z' },
    ],
  },
  {
    id: '6',
    title: 'Overcrowded Government Hospital Turning Away Patients',
    description: 'District Hospital is operating far beyond capacity. Patients are being turned away daily and ICU beds have a multi-day waiting list.',
    category: 'Healthcare',
    location: 'District Hospital, Vadodara',
    status: 'Awaiting Action',
    reporterName: 'Dr. Anita R.',
    image: 'https://images.unsplash.com/photo-1758654860024-9e352f70d1f9?w=800&h=450&fit=crop&auto=format',
    verified: true,
    createdAt: '2026-07-09T12:00:00.000Z',
    votes: 884,
    comments: [],
    timeline: [
      { label: 'Reported', timestamp: '2026-07-09T12:00:00.000Z' },
      { label: 'Under Review', timestamp: '2026-07-15T10:00:00.000Z' },
    ],
  },
  {
    id: '7',
    title: 'Government School Building Declared Unsafe',
    description: 'Structural cracks have appeared in the main building of Government Primary School No. 7. No alternative arrangement has been made for students.',
    category: 'Education',
    location: 'Gandhinagar',
    status: 'Under Review',
    reporterName: 'Anonymous',
    image: 'https://images.unsplash.com/photo-1694415847950-973e7dcca94d?w=800&h=450&fit=crop&auto=format',
    verified: true,
    createdAt: '2026-07-27T10:00:00.000Z',
    votes: 312,
    comments: [],
    timeline: [
      { label: 'Reported', timestamp: '2026-07-27T10:00:00.000Z' },
      { label: 'Under Review', timestamp: '2026-08-02T10:00:00.000Z' },
    ],
  },
  {
    id: '8',
    title: 'Aggressive Street Dogs in Satellite Area',
    description: 'A pack of aggressive street dogs has been terrorising residents. Multiple bite incidents were reported and municipal control has not responded.',
    category: 'Public Safety',
    location: 'Satellite, Ahmedabad',
    status: 'Awaiting Action',
    reporterName: 'Riya B.',
    image: 'https://images.unsplash.com/photo-1769868088411-96727d665c58?w=800&h=450&fit=crop&auto=format',
    verified: false,
    createdAt: '2026-08-05T10:00:00.000Z',
    votes: 197,
    comments: [],
    timeline: [
      { label: 'Reported', timestamp: '2026-08-05T10:00:00.000Z' },
      { label: 'Community Verified', timestamp: '2026-08-07T10:00:00.000Z' },
    ],
  },
]
