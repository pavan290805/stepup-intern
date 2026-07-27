import { StudentProfile, JobApplication, CuratorJob, ChatMessage } from "../types";

export const INITIAL_PROFILE: StudentProfile = {
  personalInfo: {
    name: "SANGU ALEKHYA REDDY",
    email: "alekhyareddy1350@gmail.com",
    title: "Computer Science Engineering Student",
    phone: "+91 9160999989",
    location: "Hyderabad, India",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", // Sleek classy female student avatar
    premiumStatus: true,
    linkedin: "linkedin.com/in/sangu-alekhya-reddy13500/",
    github: "github.com/alekhyareddy135",
    portfolio: "alekhyareddy.dev"
  },
  education: [
    {
      school: "KL University",
      degree: "Bachelor of Technology",
      field: "Computer Science Engineering",
      duration: "2024 - 2028",
      gpa: "CGPA: 9.81 / 10.0"
    },
    {
      school: "EXCELLENCIA Junior College",
      degree: "Senior Secondary Education (TSBIE)",
      field: "MPC",
      duration: "2022 - 2024",
      gpa: "96.8%"
    },
    {
      school: "Surya The Global School",
      degree: "Secondary Education (CBSE)",
      field: "General",
      duration: "Graduated 2022",
      gpa: "88.0%"
    }
  ],
  skills: [
    "Java",
    "Python",
    "C",
    "JavaScript",
    "React",
    "Node.js",
    "Flask",
    "HTML5",
    "CSS3",
    "SQL (MySQL)",
    "MongoDB",
    "Data Structures & Algorithms (DSA)",
    "Object-Oriented Programming (OOPs)",
    "Database Management Systems (DBMS)",
    "Operating Systems (OS)",
    "Git",
    "GitHub",
    "Version Control Pipelines"
  ],
  projects: [
    {
      title: "SocialScope – AI Social Media Impact Analysis Platform",
      description: "Engineered a scalable full-stack web engine designed to ingest text entries and analyze real-time sentiment weights (Positive, Negative, Neutral) leveraging NLP libraries. Constructed dynamic dashboard visual interfaces using React and designed application web APIs with Flask to handle background risk analytics pipeline streams. Configured data collections inside MongoDB to maintain historical text streams and scale retrieval queries efficiently.",
      technologies: ["Python", "Flask", "MongoDB", "NLTK", "React"],
      link: "https://github.com/alekhyareddy135/socialscope",
      date: "2025"
    },
    {
      title: "Book Recommendation System",
      description: "Designed a performance-optimized web ecosystem generating tailored book recommendations aligned directly with historic reader interest matrices and search patterns. Integrated UI layout configurations in React and established operational Node.js/Express API pathways to map query indexes smoothly into SQL tables.",
      technologies: ["React", "Node.js", "Express", "MySQL"],
      link: "https://github.com/alekhyareddy135/book-recommender",
      date: "2024"
    },
    {
      title: "E-Waste Management System",
      description: "Built an interactive environmental compliance web app facilitating electronic waste recycling management, pickup logistics scheduling, and regional center tracking mappings. Streamlined transaction scheduling workflows on the server, boosting processing speeds and application responsiveness under simulated system requests.",
      technologies: ["React", "Node.js", "MongoDB"],
      link: "https://github.com/alekhyareddy135/e-waste-management",
      date: "2024"
    }
  ],
  certifications: [
    {
      name: "Certified MongoDB Associate DBA",
      issuer: "MongoDB Academy",
      date: "2025",
      credentialId: "MDB-DBA-9812A"
    },
    {
      name: "Certified MongoDB Python Developer",
      issuer: "MongoDB Academy",
      date: "2024",
      credentialId: "MDB-PY-4235P"
    }
  ],
  achievements: [
    {
      title: "Opensource-2025 (Red Hat)",
      description: "Actively participated in an open-source development event, refining shared technical codebase versions, resolving logic errors, and mastering collaborative Git workflows.",
      date: "2025"
    }
  ],
  experience: [
    {
      role: "Google AI-ML & Java Full Stack Virtual Intern",
      company: "AICTE-Edu skills",
      duration: "Present",
      description: "Actively trained on state-of-the-art Artificial Intelligence, Machine Learning pipelines, and server-side Java Full Stack development suites to deploy smart applications."
    }
  ],
  resumeText: `SANGU ALEKHYA REDDY
Hyderabad, India | +91 9160999989 | alekhyareddy1350@gmail.com
LinkedIn: linkedin.com/in/sangu-alekhya-reddy13500/ • GitHub: github.com/alekhyareddy135

TECHNICAL SKILLS
 Programming Languages: Java, Python, C, JavaScript
 Web Technologies & Frameworks: React, Node.js, Flask, HTML5, CSS3
 Databases & Cloud Stack: SQL (MySQL), MongoDB (Certified Associate DBA)
 Core Computer Science: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOPs), Database Management Systems (DBMS), Operating Systems (OS)
 Tools & DevOps: Git, GitHub, Version Control Pipelines

ACADEMIC PROJECTS
SocialScope – AI Social Media Impact Analysis Platform
Python, Flask, MongoDB, NLTK, React
• Engineered a scalable full-stack web engine designed to ingest text entries and analyze real-time sentiment weights (Positive, Negative, Neutral) leveraging NLP libraries.
• Constructed dynamic dashboard visual interfaces using React and designed application web APIs with Flask to handle background risk analytics pipeline streams.
• Configured data collections inside MongoDB to maintain historical text streams and scale retrieval queries efficiently.

Book Recommendation System
React, Node.js, Express, MySQL
• Designed a performance-optimized web ecosystem generating tailored book recommendations aligned directly with historic reader interest matrices and search patterns.
• Integrated UI layout configurations in React and established operational Node.js/Express API pathways to map query indexes smoothly into SQL tables.

E-Waste Management System
React, Node.js, MongoDB
• Built an interactive environmental compliance web app facilitating electronic waste recycling management, pickup logistics scheduling, and regional center tracking mappings.
• Streamlined transaction scheduling workflows on the server, boosting processing speeds and application responsiveness under simulated system requests.

EDUCATION
KL University | Bachelor of Technology in Computer Science Engineering
Hyderabad, India | 2024 – 2028 (Expected)
• Academic Standing: Cumulative Grade Point Average (CGPA) of 9.81 / 10.0

EXCELLENCIA Junior College | Senior Secondary Education (TSBIE)
Hyderabad, India | 2022 – 2024
• Academic Score: Board Aggregate Percentage of 96.8%

Surya The Global School | Secondary Education (CBSE)
Hyderabad, India | Graduated 2022
• Academic Score: Aggregate Percentage of 88.0%

HACKATHONS & CERTIFICATIONS
• Opensource-2025 (Red Hat): Actively participated in an open-source development event, refining shared technical codebase versions, resolving logic errors, and mastering collaborative Git workflows.
• Certified MongoDB Python Developer — Credentials validated via MongoDB Academy
• Certified MongoDB Associate DBA — Database management authentication specialized in production administration

INTERNSHIPS
• Google AI-ML & Java Full Stack Virtual Intern (AICTE-Edu skills)`
};

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    company: "Google Inc.",
    role: "UX Research Intern",
    location: "Mountain View (Remote)",
    salary: "$35 - $45/hr",
    stage: "Applied",
    dateApplied: "2026-06-01",
    notes: "Applied via internal student portal referral. First stage submission of resume.",
    link: "https://careers.google.com/jobs"
  },
  {
    id: "app-2",
    company: "Spotify",
    role: "Backend Engineer",
    location: "Stockholm (Hybrid)",
    salary: "$3,200/mo",
    stage: "Shortlisted",
    dateApplied: "2026-05-18",
    notes: "Passed tech screen! Code challenge evaluated successfully. Shortlisted for panel round.",
    link: "https://spotify.com/careers"
  },
  {
    id: "app-3",
    company: "Figma",
    role: "Product Designer",
    location: "San Francisco (On-site)",
    salary: "$40 - $55/hr",
    stage: "Under Review",
    dateApplied: "2026-05-28",
    notes: "Portfolio and initial mockups are currently reviewed by the Design Lead.",
    link: "https://figma.com/careers"
  },
  {
    id: "app-4",
    company: "OpenAI",
    role: "Frontend Software Engineer Intern",
    location: "San Francisco (On-site)",
    salary: "$60 - $80/hr",
    stage: "Interview Scheduled",
    dateApplied: "2026-05-24",
    notes: "Technical round scheduled for next Friday. Focus on data visualization & React performance.",
    link: "https://openai.com/careers"
  }
];

export const CURATED_JOB_BOARD: CuratorJob[] = [
  {
    id: "job-1",
    title: "UX Research Intern",
    company: "Google Inc.",
    logoUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=64",
    bgLogo: "bg-red-50",
    location: "Mountain View (Remote)",
    duration: "Summer 2024",
    salary: "$35 - $45/hr",
    type: "Full-time",
    tags: ["Full-time", "Paid", "Summer 2024"],
    link: "https://careers.google.com",
    isNew: true
  },
  {
    id: "job-2",
    title: "Backend Engineer",
    company: "Spotify",
    logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?auto=format&fit=crop&q=80&w=64",
    bgLogo: "bg-green-50",
    location: "Stockholm (Hybrid)",
    duration: "6 Months",
    equity: "Equity",
    salary: "$3,200/mo",
    type: "6 Months",
    tags: ["6 Months", "Equity"],
    link: "https://spotify.com"
  },
  {
    id: "job-3",
    title: "Product Designer",
    company: "Figma",
    logoUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=64",
    bgLogo: "bg-purple-50",
    location: "San Francisco (On-site)",
    salary: "$40 - $55/hr",
    type: "Full-time",
    tags: ["Full-time", "Top Tier"],
    link: "https://figma.com/careers"
  },
  {
    id: "job-4",
    title: "AI Safety Engineer Intern",
    company: "Anthropic",
    logoUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=64",
    bgLogo: "bg-amber-50",
    location: "San Francisco (Hybrid)",
    salary: "$65 - $80/hr",
    type: "Internship",
    tags: ["Paid", "Research", "Fall 2024"],
    link: "https://anthropic.com"
  },
  {
    id: "job-5",
    title: "Frontend Engineering Associate",
    company: "Tailwind Labs",
    logoUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=64",
    bgLogo: "bg-cyan-50",
    location: "Remote (Global)",
    salary: "$80k - $110k/yr",
    type: "Full-time",
    tags: ["Remote", "Creator Economy", "CSS Expert"],
    link: "https://tailwindcss.com"
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "chat-1",
    role: "assistant",
    content: "Hey John! I noticed you haven't updated your skills in a while. Should we audit your latest projects?",
    timestamp: "2026-06-15T09:12:00Z"
  },
  {
    id: "chat-2",
    role: "user",
    content: "Yes, let's analyze my 'Mern Stack' projects and see if there are missing industry keywords.",
    timestamp: "2026-06-15T09:13:00Z"
  },
  {
    id: "chat-3",
    role: "assistant",
    content: "Excellent! Let's examine your core MERN skills. In your profile, you possess strong foundations in **React.js**, **Express.js**, **Node.js**, and **MongoDB**.\n\nTo make your resume shine, I recommend adding keywords like **Declarative State Management**, **NoSQL Database Modeling**, **Asynchronous Routing**, and **REST API Secure Integration**. Would you like me to draft bullet points for your 'Interactive E-Commerce Dashboard' incorporating these terms?",
    timestamp: "2026-06-15T09:14:00Z"
  }
];
