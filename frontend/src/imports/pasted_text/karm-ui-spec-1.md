Create a modern, production-ready responsive web application UI for **KARM — Knowledge | Action | Responsibility | Movement**, a public civic issue reporting and accountability platform.

KARM allows citizens to report real-world civic problems, attach evidence, receive community upvotes, publicly track how long an issue remains unresolved, and see transparent resolution updates.

The core product loop is:

**REPORT → AMPLIFY → TRACK → RESOLVE**

The website should feel like a **modern social platform combined with a civic accountability dashboard**. It should appeal especially to younger users and Gen Z, so avoid making it look like a traditional government portal or a boring complaint-management system.

### 1. Overall Visual Theme

Use a consistent premium dark-tech civic theme.

**Primary background**

* Very dark navy/charcoal: approximately #080B12 or similar
* Slightly lighter dark surfaces for cards and panels
* Subtle dark grid pattern in the background

**Primary accent**

* Bright cyan/teal similar to the existing KARM identity
* Use it for buttons, active states, icons, borders, links and important metrics

**Urgency accent**

* Use red only for genuinely urgent/unresolved states
* Timer can transition visually from cyan/green → amber → red as the issue remains unresolved

**Typography**

* Modern condensed/display heading style for major headings
* Clean sans-serif for body text and UI
* Strong hierarchy with large headings and short readable text
* Avoid excessive paragraphs

**Design language**

* Dark glass/solid cards
* Thin cyan borders
* Soft cyan glow used sparingly
* Rounded corners, but not overly playful
* Subtle shadows
* Minimal animations/micro-interactions
* Clean icons
* Strong visual hierarchy
* Professional but energetic

Do NOT make the entire interface neon. The cyan should act as an accent, not cover the whole interface.

### 2. Brand / Logo

Create a simple, recognisable **KARM logo** based around the wordmark "KARM".

Keep the logo minimal and modern.

Use:
**KARM**
with the tagline:
**Every action counts. Every issue is seen.**

The logo should work on:

* Desktop navbar
* Mobile navbar
* Login/signup screens
* Report pages

Do not use a complicated symbol that makes the brand look like a gaming product.

### 3. Main Navigation

Create a clean responsive navbar.

Left:

* KARM logo

Centre/left navigation:

* Home
* Explore
* Report an Issue

Right:

* Search
* Notifications
* User profile/avatar

Primary CTA:
**Report an Issue**

The navbar should remain simple and should not contain too many menu items.

On mobile, convert it into a compact navigation with a hamburger menu and a prominent report button.

### 4. Home / Public Feed

Design the main KARM feed as the most important page.

The page should immediately communicate:

**What problems are happening around people right now?**

Top section:

* Search bar: "Search civic issues..."
* Category filters
* Location/filter control
* Sort options such as:

  * Trending
  * Most Upvoted
  * Recently Reported
  * Longest Unresolved

Categories:

* Healthcare
* Education
* Municipal
* Public Safety
* Infrastructure
* Other

Use a social-feed style layout inspired by modern community platforms, but with a more serious civic purpose.

Each issue card should contain:

* Issue title
* Short description
* Category
* Location
* Evidence thumbnail
* Reporter status such as Anonymous
* Upvote button and count
* Comment count
* Share button
* Verification/status indicator
* **Days Unresolved** timer
* Current status

Example:

**Broken streetlights on Main Road**

Infrastructure · Ahmedabad

"Multiple streetlights have been non-functional for the last several weeks..."

[Evidence image]

▲ 248
💬 42

**17 DAYS UNRESOLVED**

Status: Awaiting Action

Make the unresolved timer visually prominent because this is one of KARM's core differentiators.

### 5. Issue Card Design

Make issue cards highly visual.

Do not create large blocks of text.

Prioritise:

**Evidence → Title → Timer → Community activity → Status**

The evidence image should be large enough to understand the problem immediately.

Use visual status indicators:

* Active / New
* Under Review
* Community Verified
* In Progress
* Resolved

Resolved issues should look visually different but still remain accessible.

### 6. Featured / Trending Issues

At the top of the feed, include a compact section:

**Issues gaining attention**

Display 3–4 horizontally scrollable cards with:

* Evidence image
* Short title
* Upvotes
* Days unresolved
* Category

This should feel similar to a modern social platform rather than a government dashboard.

### 7. Report an Issue Page

Create a simple, focused reporting experience.

Heading:

**Report an Issue**

Subheading:

**Make the problem visible.**

Form fields:

* Issue title
* Description
* Category
* Location
* Upload evidence
* Optional additional information

Evidence upload should support:

* Images
* Short videos

Include a privacy message:

**Your privacy matters. Uploaded evidence is automatically stripped of GPS and device metadata before storage.**

Include an optional:

**Report anonymously**

toggle.

Primary button:

**Submit Report**

Keep this page simple. Do not overwhelm the user with unnecessary fields.

### 8. Issue Detail Page

When a user opens an issue, create a detailed public issue page.

Top:

* Issue title
* Category
* Location
* Status
* Reported date
* Evidence

Large visual timer:

**17 DAYS UNRESOLVED**

Add a short message:

**This issue remains unresolved.**

Then show:

**Community Activity**

* Upvotes
* Comments
* Shares

**Issue Timeline**

Example:

Reported
↓
Community attention increased
↓
Verified
↓
Forwarded / Under Review
↓
Action Started
↓
Resolved

Each timeline event should have a timestamp.

If resolved, show:

**Resolved**
and display the resolution timestamp and authority update.

This transparency is essential to the KARM concept.

### 9. Community Interaction

Allow users to:

* Upvote
* Comment
* Share
* Follow an issue

Comments should be clean and social-platform-like.

Show useful comments prominently.

Avoid creating complicated social features such as private messaging, stories, reels, groups, etc.

KARM is about civic problems and accountability, not becoming another generic social network.

### 10. Explore Page

Create an Explore page where users can discover issues.

Use:

* Category cards
* Trending issues
* Most unresolved
* Recently reported
* Nearby issues
* Most upvoted

Use visual evidence thumbnails rather than text-heavy lists.

Include a simple filter bar.

### 11. User Profile

Create a minimal user profile.

Show:

* Profile avatar
* Username
* Reports submitted
* Issues followed
* Issues resolved through their reports

Tabs:

* My Reports
* Following
* Activity

If the user reports anonymously, do not expose personal information publicly.

### 12. Notifications

Create a simple notification panel for:

* Someone upvoted your report
* Someone commented
* Your issue was verified
* Status changed
* Issue resolved

Keep it simple and useful.

### 13. Admin / Authority Dashboard

Create a separate dashboard interface for authorities/admins.

Do NOT mix this heavily into the citizen interface.

Dashboard should show:

**Civic Issue Overview**

Metrics:

* Total Reports
* Active Issues
* Under Review
* In Progress
* Resolved
* Critical Unresolved

Main section:

**Priority Issues**

Sort by:

* Upvotes
* Days unresolved
* Severity
* Category

Each issue should show:

Issue
Category
Location
Upvotes
Days Unresolved
Status
Action

Include simple charts only where useful.

The purpose of the dashboard is to provide authorities with a prioritised list of real civic issues rather than hundreds of disconnected complaints.

### 14. Evidence-First Design

A major design principle of KARM should be:

**Show the problem before explaining the problem.**

Whenever possible:

* Use evidence images
* Use clear issue titles
* Use large unresolved timers
* Use visual status indicators
* Keep descriptions short

Avoid pages filled with long paragraphs.

The PDF describes KARM as giving citizens a visible dashboard so reports do not disappear into a "black box", while authorities receive a community-vetted list of issues.

### 15. Empty States

Create simple useful empty states.

Example:

**No issues found**

"Try changing your filters or search for another civic issue."

For a new user:

**Your reports will appear here.**

### 16. Authentication

Create simple:

* Login
* Sign Up
* Forgot Password

Authentication should be minimal.

Allow users to understand that they can participate while protecting their identity.

### 17. Responsive Design

Design for:

* Desktop: 1440px
* Tablet: 1024px
* Mobile: 390px

Use a consistent responsive grid.

Desktop:

* Main feed centred
* Optional right sidebar for trending/categories
* Maximum content width around 1200–1280px

Mobile:

* Single-column feed
* Large evidence images
* Sticky/compact navigation
* Easy thumb-friendly upvote/report interactions
* Horizontally scrollable category chips

### 18. UI Components

Create reusable components and a consistent design system:

* Navbar
* Buttons
* Issue cards
* Evidence cards
* Category chips
* Status badges
* Timer component
* Upvote component
* Comment component
* Search bar
* Filter chips
* Dropdowns
* Modal
* Toast notifications
* Profile menu
* Dashboard metric cards
* Timeline
* Form fields
* Upload component

Create variants for:

* Default
* Hover
* Active
* Disabled
* Loading
* Error
* Resolved

### 19. Motion / Interaction

Use subtle Framer Motion-style interactions.

Examples:

* Card hover elevation
* Smooth upvote interaction
* Timer transition
* Status update animation
* Page transitions
* Upload progress
* Notification appearance

Keep animations fast and subtle.

Do not use excessive glowing animations or distracting effects.

### 20. Important Product Principle

KARM should visually communicate this idea:

**A problem should not disappear just because people stop talking about it.**

The most important visual element is the **public "Days Unresolved" clock**.

The KARM loop is:

**1. REPORT**
Citizen reports a real problem with evidence.

**2. AMPLIFY**
Community upvotes and comments to increase visibility.

**3. TRACK**
The public timer shows how long the issue remains unresolved.

**4. RESOLVE**
Authorities update the issue and publicly record the resolution.

This four-step loop is the central product experience described in the project.

### 21. Keep the MVP Basic

Do not add unnecessary features.

Do NOT add:

* Cryptocurrency
* AI chatbot
* Complex recommendation engines
* Private messaging
* Stories
* Reels
* Gamification
* Complex maps
* Excessive analytics
* Unnecessary animations
* Large government-style forms

Focus on the core MVP:

**Report → Evidence → Upvote → Track → Resolve**

The project documentation specifically positions the MVP around anonymous reporting, upvoting, and basic moderation.

### 22. Final Figma AI Output

Generate a complete, coherent website design with connected screens and reusable components.

Prioritise these screens:

1. Home / Public Feed
2. Explore
3. Issue Detail
4. Report an Issue
5. Login
6. Sign Up
7. User Profile
8. Notifications
9. Admin Dashboard

Use realistic sample civic issues and evidence imagery so the prototype feels like a real product.

The final result should look like a **premium civic-tech social platform**, not a generic dashboard and not a traditional government website.

The visual identity should remain consistent with the existing KARM presentation:
**dark navy + cyan/teal + white + restrained red urgency accents + subtle grid + clean modern cards.**

Overall feeling:

**Modern. Trustworthy. Urgent. Transparent. Community-driven. Evidence-first.**

Primary brand message:

**KARM**
**Every action counts. Every issue is seen.**
