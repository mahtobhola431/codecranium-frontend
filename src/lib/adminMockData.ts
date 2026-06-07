// ─── Platform-wide admin data ───────────────────────────────────────────────

export const PLATFORM_STATS = {
  totalStudents: 50420,
  totalRevenue: 184320,
  publishedCourses: 8,
  newSignupsThisMonth: 2341,
  activeSubscriptions: 8240,
  avgRating: 4.78,
  monthlyGrowthPct: 12.4,
  revenueGrowthPct: 18.2,
}

export const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 12400, students: 1420 },
  { month: 'Feb', revenue: 13200, students: 1580 },
  { month: 'Mar', revenue: 15100, students: 1720 },
  { month: 'Apr', revenue: 14800, students: 1690 },
  { month: 'May', revenue: 16500, students: 1890 },
  { month: 'Jun', revenue: 17200, students: 1980 },
  { month: 'Jul', revenue: 15900, students: 1820 },
  { month: 'Aug', revenue: 18400, students: 2100 },
  { month: 'Sep', revenue: 19100, students: 2180 },
  { month: 'Oct', revenue: 17800, students: 2030 },
  { month: 'Nov', revenue: 20200, students: 2310 },
  { month: 'Dec', revenue: 23800, students: 2720 },
]

export type CourseStatus = 'published' | 'draft' | 'archived'

export interface AdminCourse {
  id: string
  title: string
  category: string
  instructor: string
  students: number
  revenue: number
  rating: number
  status: CourseStatus
  lastUpdated: string
  gradient: string
}

export const ADMIN_COURSES: AdminCourse[] = [
  { id: 'c1', title: 'JavaScript Fundamentals', category: 'JavaScript', instructor: 'Sarah Chen', students: 18450, revenue: 0, rating: 4.8, status: 'published', lastUpdated: '2025-03-12', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'c2', title: 'React Mastery', category: 'React', instructor: 'Sarah Chen', students: 24100, revenue: 118090, rating: 4.9, status: 'published', lastUpdated: '2025-04-20', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'c3', title: 'Python for Data Science', category: 'Python', instructor: 'Priya Nair', students: 31200, revenue: 121680, rating: 4.7, status: 'published', lastUpdated: '2025-02-28', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'c4', title: 'TypeScript Deep Dive', category: 'TypeScript', instructor: 'Sarah Chen', students: 12300, revenue: 54120, rating: 4.8, status: 'published', lastUpdated: '2025-01-10', gradient: 'from-blue-600 to-violet-500' },
  { id: 'c5', title: 'Node.js Backend Development', category: 'Node.js', instructor: 'Leo Vasquez', students: 9800, revenue: 48020, rating: 4.7, status: 'published', lastUpdated: '2025-03-05', gradient: 'from-green-500 to-emerald-600' },
  { id: 'c6', title: 'CSS Architecture & Design', category: 'CSS', instructor: 'Sarah Chen', students: 8900, revenue: 0, rating: 4.6, status: 'published', lastUpdated: '2024-12-15', gradient: 'from-pink-500 to-rose-500' },
  { id: 'c7', title: 'Go for Backend Engineers', category: 'Go', instructor: 'Marcus Webb', students: 5400, revenue: 29160, rating: 4.9, status: 'published', lastUpdated: '2025-04-01', gradient: 'from-teal-400 to-cyan-600' },
  { id: 'c8', title: 'Rust Systems Programming', category: 'Rust', instructor: 'Marcus Webb', students: 4100, revenue: 24190, rating: 4.8, status: 'published', lastUpdated: '2025-02-10', gradient: 'from-orange-500 to-red-500' },
  { id: 'c9', title: 'Full-Stack Next.js', category: 'React', instructor: 'Leo Vasquez', students: 0, revenue: 0, rating: 0, status: 'draft', lastUpdated: '2025-05-30', gradient: 'from-violet-500 to-indigo-500' },
]

export type PlanType = 'Free' | 'Pro' | 'Team'
export type StudentStatus = 'active' | 'inactive' | 'banned'

export interface AdminStudent {
  id: string
  name: string
  email: string
  joined: string
  courses: number
  xp: number
  plan: PlanType
  status: StudentStatus
  lastActive: string
}

export const ADMIN_STUDENTS: AdminStudent[] = [
  { id: 's1', name: 'Alex Rivera', email: 'alex@example.com', joined: '2024-12-15', courses: 3, xp: 4200, plan: 'Pro', status: 'active', lastActive: '2025-06-06' },
  { id: 's2', name: 'Jamie Wu', email: 'jamie@devmail.io', joined: '2025-01-03', courses: 5, xp: 8740, plan: 'Pro', status: 'active', lastActive: '2025-06-07' },
  { id: 's3', name: 'Dev Patel', email: 'dev@techco.com', joined: '2024-11-20', courses: 2, xp: 2100, plan: 'Free', status: 'active', lastActive: '2025-05-28' },
  { id: 's4', name: 'Mia Torres', email: 'mia@startup.io', joined: '2025-02-14', courses: 4, xp: 6300, plan: 'Team', status: 'active', lastActive: '2025-06-05' },
  { id: 's5', name: 'Sam Okafor', email: 'sam@example.com', joined: '2025-03-01', courses: 1, xp: 950, plan: 'Free', status: 'active', lastActive: '2025-06-01' },
  { id: 's6', name: 'Lena Fischer', email: 'lena@company.de', joined: '2024-10-08', courses: 6, xp: 12400, plan: 'Pro', status: 'active', lastActive: '2025-06-07' },
  { id: 's7', name: 'Ryo Tanaka', email: 'ryo@design.jp', joined: '2025-01-22', courses: 2, xp: 1800, plan: 'Free', status: 'inactive', lastActive: '2025-04-10' },
  { id: 's8', name: 'Amara Diallo', email: 'amara@ngcorp.com', joined: '2025-04-05', courses: 3, xp: 3100, plan: 'Team', status: 'active', lastActive: '2025-06-06' },
  { id: 's9', name: 'Carlos Mendez', email: 'carlos@mx.dev', joined: '2024-09-14', courses: 7, xp: 15200, plan: 'Pro', status: 'active', lastActive: '2025-06-07' },
  { id: 's10', name: 'Priya Shah', email: 'priya@ml.ai', joined: '2025-05-18', courses: 1, xp: 420, plan: 'Free', status: 'active', lastActive: '2025-06-04' },
  { id: 's11', name: 'Finn Larsen', email: 'finn@no.tech', joined: '2025-02-28', courses: 4, xp: 5600, plan: 'Pro', status: 'active', lastActive: '2025-06-03' },
  { id: 's12', name: 'Zara Ahmed', email: 'zara@uk.io', joined: '2025-03-15', courses: 2, xp: 2400, plan: 'Free', status: 'active', lastActive: '2025-05-22' },
  { id: 's13', name: 'Noah Kim', email: 'noah@kr.dev', joined: '2024-12-01', courses: 5, xp: 7800, plan: 'Pro', status: 'active', lastActive: '2025-06-06' },
  { id: 's14', name: 'Isla MacDonald', email: 'isla@scot.io', joined: '2025-04-20', courses: 1, xp: 580, plan: 'Free', status: 'active', lastActive: '2025-05-30' },
  { id: 's15', name: 'Viktor Petrov', email: 'viktor@ru.dev', joined: '2025-01-10', courses: 3, xp: 3900, plan: 'Pro', status: 'banned', lastActive: '2025-03-14' },
]

export type CommentStatus = 'pending' | 'approved' | 'rejected'

export interface ModComment {
  id: string
  author: string
  email: string
  courseTitle: string
  lessonTitle: string
  content: string
  postedAt: string
  status: CommentStatus
  flagReason?: string
}

export const MOD_COMMENTS: ModComment[] = [
  { id: 'mc1', author: 'Viktor Petrov', email: 'viktor@ru.dev', courseTitle: 'JavaScript Fundamentals', lessonTitle: 'Closures Explained', content: 'This course is garbage, totally wrong explanation of closures. Do not waste your money.', postedAt: '2025-03-13', status: 'pending', flagReason: 'Spam / abusive language' },
  { id: 'mc2', author: 'Unknown User', email: 'spam@fake.xyz', courseTitle: 'React Mastery', lessonTitle: 'useState Patterns', content: 'Buy cheap React courses at htt p://sp am-site.xyz — 90% off!', postedAt: '2025-06-05', status: 'pending', flagReason: 'Spam link detected' },
  { id: 'mc3', author: 'Alex Rivera', email: 'alex@example.com', courseTitle: 'React Mastery', lessonTitle: 'useEffect Mastery', content: 'Finally understood the dependency array! The animation showing renders was perfect.', postedAt: '2025-06-04', status: 'pending' },
  { id: 'mc4', author: 'Ryo Tanaka', email: 'ryo@design.jp', courseTitle: 'CSS Architecture & Design', lessonTitle: 'Flexbox Complete Guide', content: 'Great lesson. Would love a dark mode design example next.', postedAt: '2025-06-02', status: 'approved' },
  { id: 'mc5', author: 'Carlos Mendez', email: 'carlos@mx.dev', courseTitle: 'Go for Backend Engineers', lessonTitle: 'A Tour of Go', content: 'Goroutines click way better here than in the official Go tour. Amazing.', postedAt: '2025-06-01', status: 'approved' },
]

export const ACTIVITY_FEED = [
  { id: 'a1', type: 'signup', text: 'Priya Shah signed up (Free plan)', time: '2 hours ago' },
  { id: 'a2', type: 'upgrade', text: 'Finn Larsen upgraded to Pro', time: '4 hours ago' },
  { id: 'a3', type: 'complete', text: 'Lena Fischer completed React Mastery', time: '6 hours ago' },
  { id: 'a4', type: 'enroll', text: 'Amara Diallo enrolled in Go for Backend Engineers', time: '8 hours ago' },
  { id: 'a5', type: 'signup', text: 'Jamie Wu signed up (Pro plan)', time: '12 hours ago' },
  { id: 'a6', type: 'flag', text: 'Comment flagged in JavaScript Fundamentals', time: '14 hours ago' },
  { id: 'a7', type: 'complete', text: 'Carlos Mendez completed TypeScript Deep Dive', time: '1 day ago' },
  { id: 'a8', type: 'enroll', text: 'Noah Kim enrolled in Rust Systems Programming', time: '1 day ago' },
]

// ─── Instructor-specific data (Sarah Chen) ───────────────────────────────────

export const INSTRUCTOR_PROFILE = {
  id: 'i1',
  name: 'Sarah Chen',
  email: 'sarah@codecranium.com',
  avatar: '',
  bio: 'Senior frontend engineer with 10+ years building production React apps at scale.',
  joinedAt: '2024-08-01',
  totalStudents: 54750,
  totalRevenue: 89420,
  avgRating: 4.85,
  payoutAccount: 'sarah_chen@paypal.me',
}

export const INSTRUCTOR_MONTHLY_EARNINGS = [
  { month: 'Jan', earnings: 2400, students: 320 },
  { month: 'Feb', earnings: 2800, students: 380 },
  { month: 'Mar', earnings: 3200, students: 430 },
  { month: 'Apr', earnings: 3100, students: 415 },
  { month: 'May', earnings: 3600, students: 490 },
  { month: 'Jun', earnings: 4100, students: 560 },
  { month: 'Jul', earnings: 3800, students: 520 },
  { month: 'Aug', earnings: 4400, students: 600 },
  { month: 'Sep', earnings: 4700, students: 640 },
  { month: 'Oct', earnings: 4200, students: 570 },
  { month: 'Nov', earnings: 5100, students: 700 },
  { month: 'Dec', earnings: 6200, students: 850 },
]

export const INSTRUCTOR_COURSE_ANALYTICS = [
  { courseId: 'c1', title: 'JavaScript Fundamentals', students: 18450, completionRate: 72, rating: 4.8, revenue: 0, reviewCount: 2341, gradient: 'from-yellow-500 to-orange-500', price: 0 },
  { courseId: 'c2', title: 'React Mastery', students: 24100, completionRate: 65, rating: 4.9, revenue: 49, reviewCount: 3102, gradient: 'from-cyan-500 to-blue-500', price: 49 },
  { courseId: 'c4', title: 'TypeScript Deep Dive', students: 12300, completionRate: 58, rating: 4.8, revenue: 44, reviewCount: 1456, gradient: 'from-blue-600 to-violet-500', price: 44 },
]

export const INSTRUCTOR_STUDENTS_SAMPLE = [
  { name: 'Alex Rivera', course: 'React Mastery', progress: 84, joined: '2025-01-15', xp: 4200 },
  { name: 'Lena Fischer', course: 'React Mastery', progress: 100, joined: '2024-11-20', xp: 12400 },
  { name: 'Jamie Wu', course: 'TypeScript Deep Dive', progress: 62, joined: '2025-02-03', xp: 8740 },
  { name: 'Carlos Mendez', course: 'TypeScript Deep Dive', progress: 100, joined: '2024-09-14', xp: 15200 },
  { name: 'Mia Torres', course: 'JavaScript Fundamentals', progress: 45, joined: '2025-03-01', xp: 6300 },
  { name: 'Noah Kim', course: 'React Mastery', progress: 73, joined: '2024-12-01', xp: 7800 },
]

export const PAYOUT_HISTORY = [
  { id: 'p1', month: 'May 2025', amount: 5100, status: 'paid', paidOn: '2025-06-01' },
  { id: 'p2', month: 'Apr 2025', amount: 4200, status: 'paid', paidOn: '2025-05-01' },
  { id: 'p3', month: 'Mar 2025', amount: 3600, status: 'paid', paidOn: '2025-04-01' },
  { id: 'p4', month: 'Feb 2025', amount: 3200, status: 'paid', paidOn: '2025-03-01' },
  { id: 'p5', month: 'Jan 2025', amount: 2800, status: 'paid', paidOn: '2025-02-01' },
]
