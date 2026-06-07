import type { Course, Lesson, LearningPath, Comment } from '@/types'

const INSTRUCTOR_SARAH = {
  id: 'i1', name: 'Sarah Chen', avatar: '',
  bio: 'Senior frontend engineer with 10+ years building production React apps at scale.',
  courses: 8, students: 45000,
}
const INSTRUCTOR_MARCUS = {
  id: 'i2', name: 'Marcus Webb', avatar: '',
  bio: 'Systems programmer and open-source contributor. Loves Go, Rust, and distributed systems.',
  courses: 5, students: 28000,
}
const INSTRUCTOR_PRIYA = {
  id: 'i3', name: 'Priya Nair', avatar: '',
  bio: 'Data scientist turned educator. Makes Python and ML approachable for everyone.',
  courses: 6, students: 62000,
}
const INSTRUCTOR_LEO = {
  id: 'i4', name: 'Leo Vasquez', avatar: '',
  bio: 'Full-stack engineer specializing in Node.js microservices and API design.',
  courses: 4, students: 19000,
}

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    slug: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Master the core language: closures, prototypes, async/await, and the event loop explained from first principles.',
    longDescription: 'This course takes you from absolute beginner to confident JavaScript developer. You\'ll understand not just how to use JavaScript, but why it works the way it does — closures, the prototype chain, the event loop, and more.',
    category: 'javascript',
    difficulty: 'beginner',
    duration: 480,
    lessonCount: 42,
    rating: 4.8,
    reviewCount: 2341,
    students: 18450,
    price: 0,
    gradient: 'from-yellow-500 to-orange-500',
    instructor: INSTRUCTOR_SARAH,
    tags: ['javascript', 'web', 'es6', 'async'],
    whatYouLearn: [
      'Understand scope, closures, and the prototype chain',
      'Write clean async code with Promises and async/await',
      'Master the event loop and how JavaScript runs',
      'Build interactive UIs with DOM manipulation',
      'Handle errors gracefully with try/catch and custom errors',
      'Use modern ES6+ features confidently',
    ],
    sections: [
      {
        id: 's1', title: 'Getting Started',
        lessons: [
          { id: 'l1', slug: 'what-is-javascript', title: 'What is JavaScript?', duration: 8, type: 'article', isPreview: true },
          { id: 'l2', slug: 'variables-and-types', title: 'Variables & Data Types', duration: 12, type: 'article', isPreview: true },
          { id: 'l3', slug: 'operators-and-expressions', title: 'Operators & Expressions', duration: 10, type: 'challenge', isPreview: false },
        ],
      },
      {
        id: 's2', title: 'Functions & Scope',
        lessons: [
          { id: 'l4', slug: 'functions-deep-dive', title: 'Functions Deep Dive', duration: 20, type: 'article', isPreview: false },
          { id: 'l5', slug: 'closures', title: 'Closures Explained', duration: 18, type: 'article', isPreview: false, codeLanguage: 'javascript', starterCode: '// What does this function return?\nfunction makeCounter() {\n  let count = 0\n  return function() {\n    return ++count\n  }\n}\n\nconst counter = makeCounter()\nconsole.log(counter()) // ?' },
          { id: 'l6', slug: 'scope-quiz', title: 'Scope Quiz', duration: 10, type: 'quiz', isPreview: false },
        ],
      },
      {
        id: 's3', title: 'Async JavaScript',
        lessons: [
          { id: 'l7', slug: 'event-loop', title: 'The Event Loop', duration: 22, type: 'article', isPreview: false },
          { id: 'l8', slug: 'promises', title: 'Promises & Chaining', duration: 25, type: 'article', isPreview: false },
          { id: 'l9', slug: 'async-await', title: 'async/await in Practice', duration: 20, type: 'challenge', isPreview: false },
        ],
      },
    ],
    lastUpdated: '2025-03-12',
    codeLanguage: 'javascript',
  },
  {
    id: 'c2',
    slug: 'react-mastery',
    title: 'React Mastery',
    description: 'Build production-grade React apps: hooks, context, performance, testing, and the new React 19 patterns.',
    longDescription: 'Go beyond tutorials. Learn to build fast, maintainable React applications the way senior engineers do — with proper state architecture, performance optimization, and a testing mindset.',
    category: 'react',
    difficulty: 'intermediate',
    duration: 720,
    lessonCount: 58,
    rating: 4.9,
    reviewCount: 3102,
    students: 24100,
    price: 49,
    gradient: 'from-cyan-500 to-blue-500',
    instructor: INSTRUCTOR_SARAH,
    tags: ['react', 'hooks', 'typescript', 'testing'],
    whatYouLearn: [
      'Master all React hooks and build custom ones',
      'Design scalable state with Zustand and Context',
      'Optimize renders with useMemo, useCallback, and Suspense',
      'Write tests with React Testing Library and Vitest',
      'Use React 19 Actions and the new use() API',
      'Build accessible components from scratch',
    ],
    sections: [
      {
        id: 's1', title: 'React Foundations',
        lessons: [
          { id: 'l1', slug: 'thinking-in-react', title: 'Thinking in React', duration: 15, type: 'article', isPreview: true },
          { id: 'l2', slug: 'jsx-and-rendering', title: 'JSX & Rendering', duration: 12, type: 'article', isPreview: true },
        ],
      },
      {
        id: 's2', title: 'Hooks In Depth',
        lessons: [
          { id: 'l3', slug: 'use-state-patterns', title: 'useState Patterns', duration: 20, type: 'article', isPreview: false },
          { id: 'l4', slug: 'use-effect-mastery', title: 'useEffect Mastery', duration: 25, type: 'challenge', isPreview: false },
          { id: 'l5', slug: 'custom-hooks', title: 'Building Custom Hooks', duration: 30, type: 'challenge', isPreview: false },
        ],
      },
    ],
    lastUpdated: '2025-04-20',
    codeLanguage: 'typescript',
  },
  {
    id: 'c3',
    slug: 'python-for-data-science',
    title: 'Python for Data Science',
    description: 'NumPy, Pandas, Matplotlib, and Scikit-learn — the full data science toolkit from data wrangling to model deployment.',
    longDescription: 'Learn Python through the lens of real data problems. You\'ll go from data cleaning and visualization to training machine learning models, all on real-world datasets.',
    category: 'python',
    difficulty: 'beginner',
    duration: 600,
    lessonCount: 48,
    rating: 4.7,
    reviewCount: 1890,
    students: 31200,
    price: 39,
    gradient: 'from-blue-500 to-indigo-500',
    instructor: INSTRUCTOR_PRIYA,
    tags: ['python', 'data-science', 'ml', 'pandas'],
    whatYouLearn: [
      'Write clean, idiomatic Python code',
      'Manipulate data with Pandas like a pro',
      'Visualize data with Matplotlib and Seaborn',
      'Train and evaluate machine learning models',
      'Work with real datasets from Kaggle',
      'Deploy a model as a REST API',
    ],
    sections: [
      {
        id: 's1', title: 'Python Essentials',
        lessons: [
          { id: 'l1', slug: 'python-basics', title: 'Python Basics', duration: 15, type: 'article', isPreview: true },
          { id: 'l2', slug: 'lists-and-dicts', title: 'Lists & Dictionaries', duration: 12, type: 'challenge', isPreview: true },
        ],
      },
      {
        id: 's2', title: 'Data Wrangling',
        lessons: [
          { id: 'l3', slug: 'pandas-intro', title: 'Intro to Pandas', duration: 25, type: 'article', isPreview: false },
          { id: 'l4', slug: 'data-cleaning', title: 'Data Cleaning Techniques', duration: 30, type: 'challenge', isPreview: false },
        ],
      },
    ],
    lastUpdated: '2025-02-28',
    codeLanguage: 'python',
  },
  {
    id: 'c4',
    slug: 'typescript-deep-dive',
    title: 'TypeScript Deep Dive',
    description: 'Type-level programming, generics, conditional types, and advanced patterns that make TypeScript truly powerful.',
    longDescription: 'Stop fighting TypeScript and start leveraging it. This course covers the type system in depth — generics, mapped types, template literal types, and the patterns used in large codebases.',
    category: 'typescript',
    difficulty: 'intermediate',
    duration: 540,
    lessonCount: 45,
    rating: 4.8,
    reviewCount: 1456,
    students: 12300,
    price: 44,
    gradient: 'from-blue-600 to-violet-500',
    instructor: INSTRUCTOR_SARAH,
    tags: ['typescript', 'type-system', 'generics'],
    whatYouLearn: [
      'Master generics and constraint patterns',
      'Write utility types from scratch',
      'Use conditional and mapped types',
      'Type complex async patterns correctly',
      'Configure tsconfig for strict mode',
      'Integrate TypeScript into any project',
    ],
    sections: [
      {
        id: 's1', title: 'Type System Foundations',
        lessons: [
          { id: 'l1', slug: 'why-typescript', title: 'Why TypeScript?', duration: 10, type: 'article', isPreview: true },
          { id: 'l2', slug: 'basic-types', title: 'Basic Types & Inference', duration: 18, type: 'article', isPreview: true },
        ],
      },
    ],
    lastUpdated: '2025-01-10',
    codeLanguage: 'typescript',
  },
  {
    id: 'c5',
    slug: 'nodejs-backend',
    title: 'Node.js Backend Development',
    description: 'Build production-ready REST APIs and microservices with Node.js, Express, Prisma, and PostgreSQL.',
    longDescription: 'Learn backend engineering the right way: clean architecture, proper error handling, authentication, rate limiting, and database design — all with Node.js and TypeScript.',
    category: 'nodejs',
    difficulty: 'intermediate',
    duration: 660,
    lessonCount: 52,
    rating: 4.7,
    reviewCount: 987,
    students: 9800,
    price: 49,
    gradient: 'from-green-500 to-emerald-600',
    instructor: INSTRUCTOR_LEO,
    tags: ['nodejs', 'express', 'prisma', 'postgresql', 'api'],
    whatYouLearn: [
      'Design RESTful APIs with Express and TypeScript',
      'Model data with Prisma and PostgreSQL',
      'Implement JWT authentication and refresh tokens',
      'Add rate limiting, logging, and error handling',
      'Write integration tests with supertest',
      'Deploy to production with Docker',
    ],
    sections: [
      {
        id: 's1', title: 'Node.js Internals',
        lessons: [
          { id: 'l1', slug: 'node-event-loop', title: 'Node.js Event Loop', duration: 20, type: 'article', isPreview: true },
          { id: 'l2', slug: 'modules-and-npm', title: 'Modules & npm', duration: 15, type: 'article', isPreview: false },
        ],
      },
    ],
    lastUpdated: '2025-03-05',
    codeLanguage: 'typescript',
  },
  {
    id: 'c6',
    slug: 'css-architecture',
    title: 'CSS Architecture & Design',
    description: 'Modern CSS from layout fundamentals to design systems — Grid, Flexbox, animations, and component styling.',
    longDescription: 'CSS is underrated and undervalued. This course will make you the engineer who other engineers ask for design help — from layout systems to design tokens to animation.',
    category: 'css',
    difficulty: 'beginner',
    duration: 360,
    lessonCount: 32,
    rating: 4.6,
    reviewCount: 743,
    students: 8900,
    price: 0,
    gradient: 'from-pink-500 to-rose-500',
    instructor: INSTRUCTOR_SARAH,
    tags: ['css', 'design', 'flexbox', 'grid', 'animations'],
    whatYouLearn: [
      'Master Flexbox and CSS Grid completely',
      'Build responsive layouts without media query hacks',
      'Create smooth animations with keyframes and transitions',
      'Design and implement a component library',
      'Use CSS custom properties (variables) effectively',
      'Write maintainable CSS at scale',
    ],
    sections: [
      {
        id: 's1', title: 'Layout Fundamentals',
        lessons: [
          { id: 'l1', slug: 'box-model', title: 'The Box Model', duration: 12, type: 'article', isPreview: true },
          { id: 'l2', slug: 'flexbox-complete', title: 'Flexbox Complete Guide', duration: 25, type: 'challenge', isPreview: true },
        ],
      },
    ],
    lastUpdated: '2024-12-15',
    codeLanguage: 'javascript',
  },
  {
    id: 'c7',
    slug: 'go-backend',
    title: 'Go for Backend Engineers',
    description: 'Goroutines, channels, HTTP servers, and building high-performance APIs in Go from scratch.',
    longDescription: 'Go is the language of the cloud. This course teaches you to write idiomatic Go — concurrency patterns, the standard library, and building production-grade services.',
    category: 'go',
    difficulty: 'advanced',
    duration: 720,
    lessonCount: 56,
    rating: 4.9,
    reviewCount: 612,
    students: 5400,
    price: 54,
    gradient: 'from-teal-400 to-cyan-600',
    instructor: INSTRUCTOR_MARCUS,
    tags: ['go', 'golang', 'concurrency', 'microservices'],
    whatYouLearn: [
      'Write idiomatic, clean Go code',
      'Master goroutines, channels, and the sync package',
      'Build HTTP servers with the standard library',
      'Design and implement gRPC services',
      'Write comprehensive tests and benchmarks',
      'Profile and optimize Go programs',
    ],
    sections: [
      {
        id: 's1', title: 'Go Fundamentals',
        lessons: [
          { id: 'l1', slug: 'go-tour', title: 'A Tour of Go', duration: 20, type: 'article', isPreview: true },
          { id: 'l2', slug: 'types-and-interfaces', title: 'Types & Interfaces', duration: 25, type: 'article', isPreview: false },
        ],
      },
    ],
    lastUpdated: '2025-04-01',
    codeLanguage: 'go',
  },
  {
    id: 'c8',
    slug: 'rust-systems-programming',
    title: 'Rust Systems Programming',
    description: 'Ownership, borrowing, lifetimes, and systems-level programming — understand why Rust is the future of safe systems code.',
    longDescription: 'Rust is the most loved language for a reason. This course demystifies the borrow checker, teaches you to think in terms of ownership, and shows you how to write blazing fast, memory-safe code.',
    category: 'rust',
    difficulty: 'advanced',
    duration: 840,
    lessonCount: 62,
    rating: 4.8,
    reviewCount: 489,
    students: 4100,
    price: 59,
    gradient: 'from-orange-500 to-red-500',
    instructor: INSTRUCTOR_MARCUS,
    tags: ['rust', 'systems', 'ownership', 'wasm'],
    whatYouLearn: [
      'Master ownership, borrowing, and lifetimes',
      'Write safe concurrent code without data races',
      'Use traits and generics effectively',
      'Build CLI tools and system utilities',
      'Compile Rust to WebAssembly',
      'Understand unsafe Rust and when to use it',
    ],
    sections: [
      {
        id: 's1', title: 'Ownership & Borrowing',
        lessons: [
          { id: 'l1', slug: 'ownership-intro', title: 'The Ownership Model', duration: 25, type: 'article', isPreview: true },
          { id: 'l2', slug: 'borrowing', title: 'References & Borrowing', duration: 22, type: 'article', isPreview: false },
        ],
      },
    ],
    lastUpdated: '2025-02-10',
    codeLanguage: 'rust',
  },
]

export const MOCK_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'lp1',
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Go from zero to shipping production React apps. HTML → CSS → JavaScript → TypeScript → React.',
    courseIds: ['c6', 'c1', 'c4', 'c2'],
    difficulty: 'beginner',
    totalHours: 66,
    icon: '⚡',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'lp2',
    slug: 'backend-engineer',
    title: 'Backend Engineer',
    description: 'Build production APIs and services. Node.js → Go → databases → distributed systems.',
    courseIds: ['c5', 'c7'],
    difficulty: 'intermediate',
    totalHours: 46,
    icon: '⚙️',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: 'lp3',
    slug: 'systems-programmer',
    title: 'Systems Programmer',
    description: 'Low-level mastery. Go + Rust for performance-critical applications and infrastructure tooling.',
    courseIds: ['c7', 'c8'],
    difficulty: 'advanced',
    totalHours: 26,
    icon: '🦀',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'lp4',
    slug: 'full-stack',
    title: 'Full-Stack Developer',
    description: 'Master both sides. Frontend with React + TypeScript, backend with Node.js — ship complete products.',
    courseIds: ['c1', 'c2', 'c4', 'c5'],
    difficulty: 'intermediate',
    totalHours: 84,
    icon: '🚀',
    gradient: 'from-blue-500 to-violet-500',
  },
]

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'cm1',
    author: 'Alex Rivera',
    avatar: '',
    content: 'The closure explanation finally clicked for me after watching this. I\'ve read about it 10 times before but this framing is perfect.',
    createdAt: '2025-04-15',
    likes: 34,
    replies: [
      {
        id: 'cm1r1',
        author: 'Sarah Chen',
        avatar: '',
        content: 'So glad it clicked! The mental model is everything with closures.',
        createdAt: '2025-04-15',
        likes: 8,
      },
    ],
  },
  {
    id: 'cm2',
    author: 'Jamie Wu',
    avatar: '',
    content: 'The code challenges are genuinely hard in the best way. I tried to cheat and skip ahead and regretted it.',
    createdAt: '2025-04-10',
    likes: 21,
  },
  {
    id: 'cm3',
    author: 'Dev Patel',
    avatar: '',
    content: 'Best investment I\'ve made in my career. Got a senior role offer after finishing this path.',
    createdAt: '2025-03-28',
    likes: 67,
  },
]

export const CATEGORY_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  react: 'React',
  python: 'Python',
  typescript: 'TypeScript',
  nodejs: 'Node.js',
  css: 'CSS',
  rust: 'Rust',
  go: 'Go',
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function getCourseBySlug(slug: string): Course | undefined {
  return MOCK_COURSES.find((c) => c.slug === slug)
}

export function getLessonBySlug(course: Course, slug: string): Lesson | undefined {
  for (const section of course.sections) {
    const lesson = section.lessons.find((l) => l.slug === slug)
    if (lesson) return lesson
  }
}
