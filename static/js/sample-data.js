/**
 * SSM Connect - Realistic Sample Data
 * SSM Institute of Engineering and Technology (SSMIET)
 * Academic Year 2026-2027 (Odd Semester)
 * All data is realistic sample data for demonstration.
 */

window.SSM_SAMPLE_DATA = {
  collegeConfig: {
    name: "SSM Institute of Engineering and Technology",
    shortName: "SSM Connect",
    motto: "Illuminating Minds, Empowering Future Leaders",
    academicYear: "2026 - 2027 (Odd Semester)",
    code: "SSM-9221",
    affiliation: "Affiliated to Anna University | Approved by AICTE | Accredited with 'A+' Grade by NAAC",
    address: "SSM Nagar, NH-209, Dindigul - Palani Highway, Tamil Nadu 624002",
    helpline: "+91 (0451) 2448800 / 2448899",
    emergencyEmail: "emergency@ssm.edu.in",
    contactEmail: "contact@ssm.edu.in",
    website: "https://www.ssm.edu.in"
  },

  users: [
    {
      id: "u_ceo",
      name: "Dr. K. Senthil Kumar",
      role: "ceo",
      roleLabel: "Chief Executive Officer",
      email: "ceo@ssm.edu.in",
      password: "Password123!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      department: "Executive Management",
      designation: "CEO & Managing Trustee",
      phone: "+91 98421 11001",
      canPublishCollegeWide: true
    },
    {
      id: "u_principal",
      name: "Dr. R. Chandrasekaran",
      role: "principal",
      roleLabel: "Principal",
      email: "principal@ssm.edu.in",
      password: "Password123!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      department: "Office of the Principal",
      designation: "Principal & Professor of Mechanical Engg",
      phone: "+91 98421 22002",
      canPublishCollegeWide: true
    },
    {
      id: "u_fac_cse",
      name: "Prof. Priya Sharma",
      role: "faculty",
      roleLabel: "Faculty Member",
      email: "priya.sharma@ssm.edu.in",
      password: "Password123!",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      department: "CSE",
      departmentName: "Computer Science & Engineering",
      designation: "Associate Professor & Class Advisor",
      assignedClasses: ["CSE-3A", "CSE-3B", "CSE-4A"],
      subjects: ["CS8591 - Computer Networks", "CS8501 - Theory of Computation"],
      canPublishCollegeWide: false
    },
    {
      id: "u_fac_ece",
      name: "Dr. M. Natarajan",
      role: "faculty",
      roleLabel: "Faculty Member",
      email: "m.natarajan@ssm.edu.in",
      password: "Password123!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      department: "ECE",
      departmentName: "Electronics & Communication Engineering",
      designation: "Professor & Head of Research",
      assignedClasses: ["ECE-2A", "ECE-3A"],
      subjects: ["EC8352 - Signals and Systems"],
      canPublishCollegeWide: false
    },
    {
      id: "u_stud_1",
      name: "Aravind Swaminathan",
      role: "student",
      roleLabel: "Student",
      registerNo: "713821104001",
      email: "aravind.713821104001@student.ssm.edu.in",
      password: "Password123!",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      department: "CSE",
      departmentName: "Computer Science & Engineering",
      degree: "B.E. Computer Science & Engineering",
      semester: 5,
      year: "3rd Year",
      section: "A",
      classCode: "CSE-3A",
      batch: "2024-2028",
      bloodGroup: "O+",
      advisor: "Prof. Priya Sharma"
    },
    {
      id: "u_stud_2",
      name: "Kavitha Ramesh",
      role: "student",
      roleLabel: "Student",
      registerNo: "713821104015",
      email: "kavitha.713821104015@student.ssm.edu.in",
      password: "Password123!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      department: "CSE",
      departmentName: "Computer Science & Engineering",
      degree: "B.E. Computer Science & Engineering",
      semester: 5,
      year: "3rd Year",
      section: "B",
      classCode: "CSE-3B",
      batch: "2024-2028",
      bloodGroup: "B+",
      advisor: "Prof. Priya Sharma"
    },
    {
      id: "u_stud_3",
      name: "Deepak Vignesh",
      role: "student",
      roleLabel: "Student",
      registerNo: "713822106022",
      email: "deepak.713822106022@student.ssm.edu.in",
      password: "Password123!",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      department: "ECE",
      departmentName: "Electronics & Communication Engineering",
      degree: "B.E. Electronics & Communication",
      semester: 3,
      year: "2nd Year",
      section: "A",
      classCode: "ECE-2A",
      batch: "2025-2029",
      bloodGroup: "A+",
      advisor: "Dr. M. Natarajan"
    }
  ],

  departments: [
    { code: "CSE", name: "Computer Science & Engineering", hod: "Dr. S. Karthikeyan", facultyCount: 28, studentCount: 480, icon: "cpu" },
    { code: "ECE", name: "Electronics & Communication Engineering", hod: "Dr. V. Gomathi", facultyCount: 24, studentCount: 420, icon: "radio" },
    { code: "EEE", name: "Electrical & Electronics Engineering", hod: "Dr. K. Balaji", facultyCount: 18, studentCount: 260, icon: "zap" },
    { code: "MECH", name: "Mechanical Engineering", hod: "Dr. T. Murugan", facultyCount: 22, studentCount: 310, icon: "tool" },
    { code: "CIVIL", name: "Civil Engineering", hod: "Dr. R. Meenakshi", facultyCount: 15, studentCount: 210, icon: "home" },
    { code: "AI&DS", name: "Artificial Intelligence & Data Science", hod: "Dr. P. Sundaram", facultyCount: 16, studentCount: 240, icon: "brain" },
    { code: "MBA", name: "Master of Business Administration", hod: "Dr. N. Rajesh", facultyCount: 12, studentCount: 120, icon: "briefcase" }
  ],

  classes: [
    { code: "CSE-1A", dept: "CSE", year: 1, semester: 1, section: "A", room: "MB-101", strength: 60, advisor: "Dr. Anitha K." },
    { code: "CSE-2A", dept: "CSE", year: 2, semester: 3, section: "A", room: "MB-202", strength: 58, advisor: "Prof. Rajesh V." },
    { code: "CSE-3A", dept: "CSE", year: 3, semester: 5, section: "A", room: "MB-303", strength: 62, advisor: "Prof. Priya Sharma" },
    { code: "CSE-3B", dept: "CSE", year: 3, semester: 5, section: "B", room: "MB-304", strength: 60, advisor: "Prof. Priya Sharma" },
    { code: "CSE-4A", dept: "CSE", year: 4, semester: 7, section: "A", room: "MB-401", strength: 56, advisor: "Dr. S. Karthikeyan" },
    { code: "ECE-2A", dept: "ECE", year: 2, semester: 3, section: "A", room: "TB-201", strength: 55, advisor: "Dr. M. Natarajan" },
    { code: "ECE-3A", dept: "ECE", year: 3, semester: 5, section: "A", room: "TB-302", strength: 54, advisor: "Prof. Suganya R." },
    { code: "EEE-3A", dept: "EEE", year: 3, semester: 5, section: "A", room: "TB-104", strength: 48, advisor: "Dr. K. Balaji" },
    { code: "MECH-3A", dept: "MECH", year: 3, semester: 5, section: "A", room: "RB-201", strength: 52, advisor: "Dr. T. Murugan" }
  ],

  classrooms: [
    {
      id: "rm_1",
      number: "MB-303",
      block: "Main Academic Block (Babbage Hall)",
      floor: "3rd Floor",
      type: "Smart Classroom",
      capacity: 70,
      facilities: ["Interactive 4K Smart Board", "Ceiling Dual Projector", "High-Speed Wi-Fi 6", "Central AC", "Collar Mic Audio"],
      status: "In-Session",
      currentSession: "CS8591 - Computer Networks (CSE-3A)",
      facultyInCharge: "Prof. Priya Sharma",
      nextAvailable: "11:30 AM"
    },
    {
      id: "rm_2",
      number: "MB-304",
      block: "Main Academic Block",
      floor: "3rd Floor",
      type: "Lecture Hall",
      capacity: 65,
      facilities: ["HD Projector", "Whiteboard", "Wi-Fi", "Audio PA System"],
      status: "Available",
      currentSession: "None",
      facultyInCharge: "Department Staff",
      nextAvailable: "Now"
    },
    {
      id: "rm_3",
      number: "CS-LAB-2",
      block: "Turing Computer Block",
      floor: "2nd Floor",
      type: "Advanced Computer Lab",
      capacity: 65,
      facilities: ["65 High-End i7 Workstations", "Gigabit LAN", "Dual Projectors", "24x7 Air Conditioned", "Ubuntu & Windows 11 Dual Boot"],
      status: "In-Session",
      currentSession: "Networks & OS Laboratory (CSE-3B)",
      facultyInCharge: "Mr. R. Dinesh Kumar",
      nextAvailable: "01:15 PM"
    },
    {
      id: "rm_4",
      number: "TB-201",
      block: "Tesla Technology Block",
      floor: "2nd Floor",
      type: "Smart Classroom",
      capacity: 60,
      facilities: ["Smart Podium", "Dual Display", "Wi-Fi", "AC"],
      status: "Available",
      currentSession: "Free Slot",
      facultyInCharge: "Dr. M. Natarajan",
      nextAvailable: "Now"
    },
    {
      id: "rm_5",
      number: "AUD-MAIN",
      block: "Dr. APJ Abdul Kalam Auditorium",
      floor: "Ground Floor",
      type: "Central Auditorium",
      capacity: 1200,
      facilities: ["Stage Lighting", "Surround Sound JBL System", "Dual LED Video Walls (20x10 ft)", "Centralized Chiller AC", "Green Rooms"],
      status: "Reserved for Exam",
      currentSession: "Anna University Practical & CAT-1 Setup",
      facultyInCharge: "Estate Officer & Exam Cell",
      nextAvailable: "Tomorrow 09:00 AM"
    },
    {
      id: "rm_6",
      number: "SEM-HALL-A",
      block: "Vikram Sarabhai Seminar Complex",
      floor: "1st Floor",
      type: "Air Conditioned Seminar Hall",
      capacity: 250,
      facilities: ["Teleconferencing Video Suite", "Wireless Microphones", "Live Stream Ready", "Stage Podium", "Acoustic Paneling"],
      status: "Available",
      currentSession: "Preparations for AI Seminar",
      facultyInCharge: "CSE Dept Coordinator",
      nextAvailable: "Now"
    },
    {
      id: "rm_7",
      number: "MB-202",
      block: "Main Academic Block",
      floor: "2nd Floor",
      type: "Lecture Hall",
      capacity: 65,
      facilities: ["Projector", "Wi-Fi", "Whiteboard"],
      status: "Maintenance",
      currentSession: "Projector Bulb & Audio System Upgrade",
      facultyInCharge: "Campus Maintenance Team",
      nextAvailable: "02:00 PM Today"
    }
  ],

  announcements: [
    {
      id: "ann_01",
      title: "URGENT: Continuous Assessment Test 1 (CAT-1) Timetable & Hall Allocations Released",
      message: "The Continuous Assessment Test 1 (CAT-1) for all 2nd, 3rd, and 4th-year B.E. / B.Tech students will commence on Monday, 03rd November 2026. Hall tickets and seating charts are available in SSM Connect under the Internal Exams section. Morning sessions run from 09:30 AM to 11:00 AM, and afternoon sessions run from 01:45 PM to 03:15 PM. Students must report 15 minutes before the bell with college ID cards and Anna University calculators. Smart watches and mobile devices are strictly barred.",
      category: "Urgent",
      priority: "high",
      authorId: "u_principal",
      authorName: "Dr. R. Chandrasekaran",
      authorRole: "Principal",
      authorDepartment: "Office of the Principal",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      date: "2026-10-30T09:00:00Z",
      audience: "college_wide",
      audienceLabel: "All College (Faculty & Students)",
      department: "All",
      semester: "All",
      classCode: "All",
      status: "published",
      attachment: {
        name: "CAT1_Schedule_Nov2026_Official.pdf",
        size: "1.4 MB",
        type: "pdf"
      },
      pinned: true,
      viewsCount: 1420
    },
    {
      id: "ann_02",
      title: "Strategic Vision 2030: Research Grant Allocation & Innovation Incubation Hub Launch",
      message: "SSM Management is delighted to announce a dedicated seed research fund of ₹50 Lakhs for multidisciplinary student-faculty joint ventures in AI, Robotics, Renewable Energy, and Smart Mobility. Interested faculty and final year project teams may submit their concept notes to the Dean of R&D on or before November 20th, 2026. The new Innovation Incubation Hub will be inaugurated next month in the Technology Tower.",
      category: "Academic",
      priority: "normal",
      authorId: "u_ceo",
      authorName: "Dr. K. Senthil Kumar",
      authorRole: "CEO",
      authorDepartment: "Executive Management",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      date: "2026-10-29T14:30:00Z",
      audience: "college_wide",
      audienceLabel: "All College",
      department: "All",
      semester: "All",
      classCode: "All",
      status: "published",
      attachment: {
        name: "SSM_Seed_Grant_Guidelines_2026.pdf",
        size: "860 KB",
        type: "pdf"
      },
      pinned: false,
      viewsCount: 980
    },
    {
      id: "ann_03",
      title: "Class Cancellation & Room Relocation: CS8591 Computer Networks on 31st Oct",
      message: "Attention 3rd Year CSE Section A (CSE-3A): Tomorrow's (Friday) Period 2 Computer Networks lecture is rescheduled to Saturday morning Period 1 due to the Anna University inspection. Additionally, today's afternoon tutorial class will meet in Turing Lab 2 (CS-LAB-2) instead of MB-303. Please bring your routing simulation lab notebooks.",
      category: "Class Update",
      priority: "high",
      authorId: "u_fac_cse",
      authorName: "Prof. Priya Sharma",
      authorRole: "Faculty",
      authorDepartment: "Computer Science & Engineering",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      date: "2026-10-30T08:15:00Z",
      audience: "class_only",
      audienceLabel: "CSE - 3rd Year - Section A",
      department: "CSE",
      semester: "5",
      classCode: "CSE-3A",
      status: "published",
      attachment: null,
      pinned: true,
      viewsCount: 58
    },
    {
      id: "ann_04",
      title: "International Seminar on 'Next-Gen Generative AI & Autonomous Agents in Industry'",
      message: "The Department of Computer Science & Engineering cordially invites pre-final and final-year students along with faculty members to an expert guest lecture by Dr. Aris Thorne, Lead AI Research Scientist at DeepScale Labs, Bengaluru. Topics include transformer architectures, multimodal agentic frameworks, and industry hiring trends. Certificates of participation will be issued. Venue: Vikram Sarabhai Seminar Complex Hall A.",
      category: "Seminar",
      priority: "normal",
      authorId: "u_fac_cse",
      authorName: "Prof. Priya Sharma",
      authorRole: "Faculty",
      authorDepartment: "Computer Science & Engineering",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      date: "2026-10-28T11:00:00Z",
      audience: "department_only",
      audienceLabel: "CSE Department (Faculty & Students)",
      department: "CSE",
      semester: "All",
      classCode: "All",
      status: "published",
      attachment: {
        name: "Seminar_Flyer_GenAI_Oct2026.png",
        size: "2.1 MB",
        type: "image"
      },
      pinned: false,
      viewsCount: 340
    },
    {
      id: "ann_05",
      title: "Campus Placement Drive: Zoho Corporation & Cognizant Phase-1 Registration",
      message: "Placement & Training Cell Notice: Registration is now open for the 2027 graduating batch. Eligibility: B.E. / B.Tech (CSE, ECE, EEE, MECH) with CGPA 7.0 and above, zero standing arrears. Round 1 Online Aptitude & Coding assessment will take place on November 12th in the Central Computing Facility. Complete the Google Form via the SSM placement portal by November 5th, 5:00 PM.",
      category: "Placement",
      priority: "normal",
      authorId: "u_principal",
      authorName: "Dr. R. Chandrasekaran",
      authorRole: "Principal",
      authorDepartment: "Office of the Principal",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      date: "2026-10-27T16:00:00Z",
      audience: "college_wide",
      audienceLabel: "Final Year Students (All Depts)",
      department: "All",
      semester: "7",
      classCode: "All",
      status: "published",
      attachment: {
        name: "Zoho_Cognizant_JD_2026.pdf",
        size: "1.1 MB",
        type: "pdf"
      },
      pinned: false,
      viewsCount: 1120
    },
    {
      id: "ann_06",
      title: "SSM Nakshatra 2026: Annual Inter-Collegiate Cultural Festival Dates & Rules",
      message: "Get ready for the most awaited cultural extravaganza in Tamil Nadu! 'SSM Nakshatra 2026' will be celebrated on December 18-19, 2026. Over 40 events including Western & Classical Dance, Battle of Bands, Short Film Contest, Theatre, Fashion Walk, and Fine Arts. Cash prizes worth ₹3 Lakhs to be won. Department auditions begin on November 15th.",
      category: "Festival",
      priority: "normal",
      authorId: "u_ceo",
      authorName: "Dr. K. Senthil Kumar",
      authorRole: "CEO",
      authorDepartment: "Executive Management",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      date: "2026-10-25T10:00:00Z",
      audience: "college_wide",
      audienceLabel: "All College",
      department: "All",
      semester: "All",
      classCode: "All",
      status: "published",
      attachment: {
        name: "Nakshatra2026_Brochure_Rules.pdf",
        size: "3.8 MB",
        type: "pdf"
      },
      pinned: false,
      viewsCount: 2200
    },
    {
      id: "ann_07",
      title: "ECE Dept: Signals and Systems Assignment-2 Submission & Viva Date",
      message: "Students of 2nd Year ECE Section A: Assignment-2 on Fourier Transforms and Discrete Time Signals has been posted. Handwritten solutions must be submitted to the department lab office by Wednesday, 4th November. Viva-voce will be conducted during your scheduled lab hour.",
      category: "Internal Assessment",
      priority: "normal",
      authorId: "u_fac_ece",
      authorName: "Dr. M. Natarajan",
      authorRole: "Faculty",
      authorDepartment: "Electronics & Communication Engineering",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      date: "2026-10-26T15:20:00Z",
      audience: "class_only",
      audienceLabel: "ECE - 2nd Year - Section A",
      department: "ECE",
      semester: "3",
      classCode: "ECE-2A",
      status: "published",
      attachment: {
        name: "EC8352_Assignment_2_Questions.pdf",
        size: "420 KB",
        type: "pdf"
      },
      pinned: false,
      viewsCount: 52
    },
    {
      id: "ann_pending_01",
      title: "Request for College-Wide Technical Symposium 'CYBERPULSE 2026' Call for Papers",
      message: "The CSE Department plans to host the National Level Technical Symposium 'CYBERPULSE 2026' on December 5th. We request Principal and CEO approval to open registrations college-wide and publish promotional materials across social media channels and partner universities.",
      category: "Academic",
      priority: "normal",
      authorId: "u_fac_cse",
      authorName: "Prof. Priya Sharma",
      authorRole: "Faculty",
      authorDepartment: "Computer Science & Engineering",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      date: "2026-10-30T09:30:00Z",
      audience: "college_wide",
      audienceLabel: "College-Wide Broadcast (Pending Review)",
      department: "CSE",
      semester: "All",
      classCode: "All",
      status: "pending_approval",
      attachment: {
        name: "Cyberpulse_2026_Proposal_Budget.pdf",
        size: "1.8 MB",
        type: "pdf"
      },
      pinned: false,
      viewsCount: 2
    }
  ],

  // Semester Timetables
  timetables: {
    "CSE-3A": {
      classCode: "CSE-3A",
      dept: "CSE",
      deptName: "Computer Science & Engineering",
      semester: 5,
      year: "3rd Year",
      section: "A",
      room: "MB-303",
      advisor: "Prof. Priya Sharma",
      periods: [
        { time: "09:00 - 09:50", label: "Period 1" },
        { time: "09:50 - 10:40", label: "Period 2" },
        { time: "10:40 - 11:00", label: "Tea Break", isBreak: true },
        { time: "11:00 - 11:50", label: "Period 3" },
        { time: "11:50 - 12:40", label: "Period 4" },
        { time: "12:40 - 01:30", label: "Lunch Break", isBreak: true },
        { time: "01:30 - 02:20", label: "Period 5" },
        { time: "02:20 - 03:10", label: "Period 6" },
        { time: "03:10 - 04:00", label: "Period 7" }
      ],
      days: {
        "Monday": [
          { subject: "CS8591 Computer Networks", code: "CN", faculty: "Prof. Priya Sharma", room: "MB-303", type: "theory" },
          { subject: "CS8501 Theory of Computation", code: "TOC", faculty: "Dr. S. Karthikeyan", room: "MB-303", type: "theory" },
          { subject: "Tea Break", isBreak: true },
          { subject: "EC8681 Microprocessors & Microcontrollers", code: "MPMC", faculty: "Dr. V. Gomathi", room: "MB-303", type: "theory" },
          { subject: "MA8551 Algebra and Number Theory", code: "ANT", faculty: "Prof. K. Venkatesh", room: "MB-303", type: "theory" },
          { subject: "Lunch Break", isBreak: true },
          { subject: "CS8581 Networks Laboratory (Batch 1)", code: "NW-LAB", faculty: "Prof. Priya Sharma", room: "CS-LAB-2", type: "lab", span: 3 }
        ],
        "Tuesday": [
          { subject: "MA8551 Algebra and Number Theory", code: "ANT", faculty: "Prof. K. Venkatesh", room: "MB-303", type: "theory" },
          { subject: "CS8592 Object Oriented Analysis & Design", code: "OOAD", faculty: "Prof. Anitha K.", room: "MB-303", type: "theory" },
          { subject: "Tea Break", isBreak: true },
          { subject: "CS8591 Computer Networks", code: "CN", faculty: "Prof. Priya Sharma", room: "MB-303", type: "theory" },
          { subject: "CS8501 Theory of Computation", code: "TOC", faculty: "Dr. S. Karthikeyan", room: "MB-303", type: "theory" },
          { subject: "Lunch Break", isBreak: true },
          { subject: "Professional Elective I (Data Mining)", code: "DM", faculty: "Dr. P. Sundaram", room: "MB-303", type: "theory" },
          { subject: "Library & Self Learning Hour", code: "LIB", faculty: "Department Staff", room: "Central Lib", type: "library" },
          { subject: "Sports & Yoga Activity", code: "SPORTS", faculty: "Physical Director", room: "Grounds", type: "sports" }
        ],
        "Wednesday": [
          { subject: "CS8592 Object Oriented Analysis & Design", code: "OOAD", faculty: "Prof. Anitha K.", room: "MB-303", type: "theory" },
          { subject: "EC8681 Microprocessors & Microcontrollers", code: "MPMC", faculty: "Dr. V. Gomathi", room: "MB-303", type: "theory" },
          { subject: "Tea Break", isBreak: true },
          { subject: "CS8591 Computer Networks", code: "CN", faculty: "Prof. Priya Sharma", room: "MB-303", type: "theory" },
          { subject: "MA8551 Algebra and Number Theory", code: "ANT", faculty: "Prof. K. Venkatesh", room: "MB-303", type: "theory" },
          { subject: "Lunch Break", isBreak: true },
          { subject: "CS8582 Microprocessors Lab (Batch 2)", code: "MP-LAB", faculty: "Dr. V. Gomathi", room: "TB-LAB-1", type: "lab", span: 3 }
        ],
        "Thursday": [
          { subject: "CS8501 Theory of Computation", code: "TOC", faculty: "Dr. S. Karthikeyan", room: "MB-303", type: "theory" },
          { subject: "CS8591 Computer Networks", code: "CN", faculty: "Prof. Priya Sharma", room: "MB-303", type: "theory" },
          { subject: "Tea Break", isBreak: true },
          { subject: "Professional Elective I (Data Mining)", code: "DM", faculty: "Dr. P. Sundaram", room: "MB-303", type: "theory" },
          { subject: "EC8681 Microprocessors & Microcontrollers", code: "MPMC", faculty: "Dr. V. Gomathi", room: "MB-303", type: "theory" },
          { subject: "Lunch Break", isBreak: true },
          { subject: "Placement Aptitude & Verbal Skills", code: "APT", faculty: "Training Cell", room: "MB-303", type: "placement" },
          { subject: "Technical Seminar & Mini Project Review", code: "MINIPROJ", faculty: "Prof. Priya Sharma", room: "MB-303", type: "seminar" },
          { subject: "Counseling & Advisor Hour", code: "MENTOR", faculty: "Prof. Priya Sharma", room: "MB-303", type: "mentoring" }
        ],
        "Friday": [
          { subject: "MA8551 Algebra and Number Theory", code: "ANT", faculty: "Prof. K. Venkatesh", room: "MB-303", type: "theory" },
          { subject: "CS8592 Object Oriented Analysis & Design", code: "OOAD", faculty: "Prof. Anitha K.", room: "MB-303", type: "theory" },
          { subject: "Tea Break", isBreak: true },
          { subject: "CS8501 Theory of Computation", code: "TOC", faculty: "Dr. S. Karthikeyan", room: "MB-303", type: "theory" },
          { subject: "Professional Elective I (Data Mining)", code: "DM", faculty: "Dr. P. Sundaram", room: "MB-303", type: "theory" },
          { subject: "Lunch Break", isBreak: true },
          { subject: "Open Source Software Club & Hackathon Lab", code: "CLUB", faculty: "Student Leads", room: "CS-LAB-3", type: "activity", span: 3 }
        ]
      }
    },
    "ECE-2A": {
      classCode: "ECE-2A",
      dept: "ECE",
      deptName: "Electronics & Communication Engineering",
      semester: 3,
      year: "2nd Year",
      section: "A",
      room: "TB-201",
      advisor: "Dr. M. Natarajan",
      periods: [
        { time: "09:00 - 09:50", label: "Period 1" },
        { time: "09:50 - 10:40", label: "Period 2" },
        { time: "10:40 - 11:00", label: "Tea Break", isBreak: true },
        { time: "11:00 - 11:50", label: "Period 3" },
        { time: "11:50 - 12:40", label: "Period 4" },
        { time: "12:40 - 01:30", label: "Lunch Break", isBreak: true },
        { time: "01:30 - 02:20", label: "Period 5" },
        { time: "02:20 - 03:10", label: "Period 6" },
        { time: "03:10 - 04:00", label: "Period 7" }
      ],
      days: {
        "Monday": [
          { subject: "EC8352 Signals and Systems", code: "SS", faculty: "Dr. M. Natarajan", room: "TB-201", type: "theory" },
          { subject: "EC8393 Digital Electronics", code: "DE", faculty: "Prof. Suganya R.", room: "TB-201", type: "theory" },
          { subject: "Tea Break", isBreak: true },
          { subject: "MA8352 Linear Algebra & PDEs", code: "LAPDE", faculty: "Dr. K. Balaji", room: "TB-201", type: "theory" },
          { subject: "EC8351 Electronic Circuits I", code: "EC-1", faculty: "Prof. R. Meenakshi", room: "TB-201", type: "theory" },
          { subject: "Lunch Break", isBreak: true },
          { subject: "Analog & Digital Circuits Lab", code: "ADC-LAB", faculty: "Dr. M. Natarajan", room: "ECE-LAB-1", type: "lab", span: 3 }
        ]
      }
    }
  },

  // Internal Exam Timetables
  internalExams: [
    {
      id: "exam_1",
      title: "Continuous Assessment Test 1 (CAT-1) - Odd Semester 2026",
      type: "CAT-1",
      academicYear: "2026-2027",
      targetDepts: ["CSE", "ECE", "EEE", "MECH", "CIVIL", "AI&DS"],
      targetSemesters: ["Sem 3", "Sem 5", "Sem 7"],
      status: "Upcoming",
      startDate: "2026-11-03",
      endDate: "2026-11-07",
      sessions: [
        { session: "FN", time: "09:30 AM - 11:00 AM (90 mins)", maxMarks: 50 },
        { session: "AN", time: "01:45 PM - 03:15 PM (90 mins)", maxMarks: 50 }
      ],
      guidelines: [
        "Students must be seated in their designated exam hall 15 minutes prior to commencement.",
        "Anna University approved non-programmable scientific calculators only.",
        "Possession of cell phones, smart watches, notes, or digital media constitutes malpractice.",
        "College ID card must be placed on the top right corner of the desk."
      ],
      schedule: [
        {
          date: "2026-11-03",
          day: "Monday",
          session: "FN",
          dept: "CSE",
          semester: 5,
          subjectCode: "MA8551",
          subjectName: "Algebra and Number Theory",
          halls: "MB-301 to MB-304",
          syllabus: "Unit 1 (Groups and Rings) & Unit 2 (Finite Fields and Polynomials)"
        },
        {
          date: "2026-11-03",
          day: "Monday",
          session: "AN",
          dept: "CSE",
          semester: 5,
          subjectCode: "CS8591",
          subjectName: "Computer Networks",
          halls: "MB-301 to MB-304",
          syllabus: "Unit 1 (Physical & Data Link Layer) & Unit 2 (Routing Protocols & IP Addressing)"
        },
        {
          date: "2026-11-04",
          day: "Tuesday",
          session: "FN",
          dept: "CSE",
          semester: 5,
          subjectCode: "CS8501",
          subjectName: "Theory of Computation",
          halls: "MB-301 to MB-304",
          syllabus: "Unit 1 (Automata & Regular Expressions) & Unit 2 (Context-Free Grammars)"
        },
        {
          date: "2026-11-04",
          day: "Tuesday",
          session: "AN",
          dept: "CSE",
          semester: 5,
          subjectCode: "EC8681",
          subjectName: "Microprocessors & Microcontrollers",
          halls: "MB-301 to MB-304",
          syllabus: "Unit 1 (8086 Architecture) & Unit 2 (Instruction Set & Assembly Programming)"
        },
        {
          date: "2026-11-05",
          day: "Wednesday",
          session: "FN",
          dept: "CSE",
          semester: 5,
          subjectCode: "CS8592",
          subjectName: "Object Oriented Analysis and Design",
          halls: "MB-301 to MB-304",
          syllabus: "Unit 1 (UML Diagrams) & Unit 2 (Design Patterns - GoF)"
        },
        {
          date: "2026-11-05",
          day: "Wednesday",
          session: "AN",
          dept: "CSE",
          semester: 5,
          subjectCode: "CS8075",
          subjectName: "Data Mining (Professional Elective I)",
          halls: "MB-301 to MB-304",
          syllabus: "Unit 1 (Data Preprocessing) & Unit 2 (Association Rule Mining - Apriori)"
        }
      ]
    }
  ],

  // Seminar Schedules
  seminars: [
    {
      id: "sem_01",
      title: "Frontiers of Generative AI & Autonomous Agentic Workflows",
      speaker: "Dr. Aris Thorne",
      speakerTitle: "Principal AI Research Scientist, DeepScale Labs",
      speakerBio: "PhD from Stanford University with 14+ years in Deep Learning, Large Language Model architectures, and multi-agent systems.",
      speakerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      date: "2026-11-08",
      time: "10:00 AM - 01:00 PM",
      venue: "Vikram Sarabhai Seminar Complex (Hall A)",
      department: "CSE",
      targetAudience: "3rd & 4th Year B.E. (CSE, AI&DS, ECE) and Faculty",
      capacity: 250,
      registeredCount: 198,
      status: "Open",
      topics: [
        "LLM Attention Mechanics and Latent Space Navigation",
        "Agentic Reasoning Patterns: ReAct, Plan-and-Solve, Self-Refine",
        "Tool Calling, Vector Indexing, and Enterprise RAG Pipelines",
        "Live Demonstration: Building a Collaborative Multi-Agent Mesh"
      ],
      coordinator: "Prof. Priya Sharma (CSE)",
      prerequisites: "Basic Python programming and understanding of neural networks."
    },
    {
      id: "sem_02",
      title: "VLSI System Design in 3nm Era: Chiplet Architectures & RISC-V",
      speaker: "Er. K. Balasubramanian",
      speakerTitle: "Senior Director of Silicon Engineering, Texas Instruments",
      speakerBio: "Veteran semiconductor architect with 22 patents in low-power SoC and RISC-V customized instruction sets.",
      speakerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      date: "2026-11-14",
      time: "02:00 PM - 04:30 PM",
      venue: "Dr. APJ Abdul Kalam Auditorium",
      department: "ECE",
      targetAudience: "ECE, EEE Students and VLSI Research Scholars",
      capacity: 400,
      registeredCount: 310,
      status: "Open",
      topics: [
        "Silicon Packaging & Heterogeneous Chiplet Integration",
        "Open-source RISC-V ISA for Edge Computing",
        "Careers in Semiconductor Fab & IC Design"
      ],
      coordinator: "Dr. M. Natarajan (ECE)",
      prerequisites: "Digital Electronics fundamentals."
    },
    {
      id: "sem_03",
      title: "Sustainable Green Hydrogen & Electric Vehicle Powertrain Engineering",
      speaker: "Dr. Sandeep Vardhan",
      speakerTitle: "Chief Technology Advisor, Tata Motors EV Division",
      speakerBio: "Automotive innovation specialist pioneering thermal management systems in next-generation lithium iron phosphate battery packs.",
      speakerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      date: "2026-11-19",
      time: "10:30 AM - 12:45 PM",
      venue: "Mechanical Seminar Hall (RB-102)",
      department: "MECH",
      targetAudience: "Mechanical & Automobile Engineering Students",
      capacity: 180,
      registeredCount: 165,
      status: "Filling Fast",
      topics: [
        "Battery Thermal Runaway Mitigation",
        "Hydrogen Fuel Cell Integration for Heavy Commercial Vehicles",
        "CFD Modeling of Aerodynamic Drag in High-Speed EVs"
      ],
      coordinator: "Dr. T. Murugan (MECH)",
      prerequisites: "Thermodynamics and fluid dynamics."
    }
  ],

  // Events & Festivals
  events: [
    {
      id: "evt_01",
      title: "SSM NAKSHATRA 2026: Grand Annual Inter-College Cultural Fiesta",
      tagline: "Celebrating Harmony, Art, Culture, and Young Indian Spirit",
      category: "Cultural",
      badgeColor: "purple",
      date: "2026-12-18 to 2026-12-19",
      venue: "Open Air Amphitheatre & Central Auditorium",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
      description: "SSM Nakshatra is Central Tamil Nadu's premiere youth cultural summit attracting over 6,000 students across 80+ engineering and arts colleges. 40 competitions across Music, Dance, Dramatics, Literary, and Visual Arts with celebrity musical concert night.",
      highlights: [
        "Battle of the College Bands & Unplugged Acoustic Night",
        "Choreo Night: Western and Classical Group Dance Showdown",
        "Short Film Premieres judged by acclaimed Tamil Cinema Directors",
        "Grand Celebrity Musical Night with Singer Andrea Jeremiah & Band"
      ],
      chiefGuest: "Padma Shri Dr. Kamal Haasan (Invited) & Eminent Cultural Dignitaries",
      coordinator: "Dr. R. Meenakshi & Prof. Priya Sharma",
      registrationStatus: "Auditions Open"
    },
    {
      id: "evt_02",
      title: "INNOVEX 2026: 36-Hour National Student Hackathon",
      tagline: "Code, Build, and Deploy Solutions for Smart Cities & Agriculture",
      category: "Technical",
      badgeColor: "blue",
      date: "2026-11-28 to 2026-11-29",
      venue: "Central Computing Center & Turing Complex",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
      description: "A continuous 36-hour hackathon where student teams develop working prototypes in AI for Healthcare, Precision Agriculture, Blockchain for Logistics, and Clean Energy Monitoring.",
      highlights: [
        "₹2.5 Lakhs Total Cash Pool & Direct Interview Slots with Zoho, Freshworks",
        "Mentorship by Silicon Valley and Chennai Tech Leaders",
        "Free High-Speed Wi-Fi, Cloud Credits, Food, and Energy Drinks for 36 hours"
      ],
      chiefGuest: "VP of Product Engineering, Zoho Corporation",
      coordinator: "Dr. S. Karthikeyan (HOD - CSE)",
      registrationStatus: "Registrations Active"
    },
    {
      id: "evt_03",
      title: "AGNI 2026: 18th Annual Inter-Departmental Sports Olympiad",
      tagline: "Strength, Grit, and Brotherhood on the Field",
      category: "Sports",
      badgeColor: "emerald",
      date: "2026-11-21 to 2026-11-22",
      venue: "SSM International Sports Complex & Synthetic Track",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80",
      description: "Annual athletic meet and tournament featuring Track & Field, Football, Cricket, Basketball, Volleyball, Badminton, and Table Tennis competitions across all engineering departments.",
      highlights: [
        "Inter-Departmental March Past & Olympic Flame Lighting",
        "Floodlit Cricket Tournament Final & Basketball Championship",
        "Overall Championship Rolling Trophy and Individual Best Athlete Gold Medals"
      ],
      chiefGuest: "International Athlete & Olympian Mr. Santhosh Kumar",
      coordinator: "Physical Director & Sports Committee",
      registrationStatus: "Team Selections in Progress"
    }
  ],

  // Notification logs
  notifications: [
    {
      id: "notif_1",
      userId: "u_stud_1",
      title: "CAT-1 Timetable Released",
      message: "Continuous Assessment Test 1 schedule has been published for 3rd Year CSE.",
      timestamp: "2026-10-30T09:05:00Z",
      read: false,
      type: "exam",
      link: "internal-exams"
    },
    {
      id: "notif_2",
      userId: "u_stud_1",
      title: "Class Update: CS8591 Networks",
      message: "Rescheduled lecture on Friday moved to Saturday Period 1.",
      timestamp: "2026-10-30T08:16:00Z",
      read: false,
      type: "class",
      link: "dashboard"
    },
    {
      id: "notif_3",
      userId: "u_stud_1",
      title: "Upcoming Seminar Registration",
      message: "Dr. Aris Thorne's Generative AI Seminar seats are filling quickly.",
      timestamp: "2026-10-28T11:05:00Z",
      read: true,
      type: "seminar",
      link: "seminars"
    },
    {
      id: "notif_4",
      userId: "u_principal",
      title: "New Post Pending Your Review",
      message: "Prof. Priya Sharma submitted 'CYBERPULSE 2026' for College-Wide Broadcast.",
      timestamp: "2026-10-30T09:31:00Z",
      read: false,
      type: "approval",
      link: "approvals"
    }
  ],

  // Simulated Email Dispatch Records
  emailLogs: [
    {
      id: "mail_01",
      to: "all-students@ssm.edu.in, all-faculty@ssm.edu.in",
      recipientGroup: "College-Wide (Students & Staff)",
      subject: "[SSM Connect - URGENT] Continuous Assessment Test 1 (CAT-1) Timetable & Hall Allocations",
      timestamp: "2026-10-30T09:02:14Z",
      status: "Delivered (Demo Simulator)",
      bodySnippet: "Official notification from the Office of the Principal regarding the upcoming Continuous Assessment Test 1 commencing November 3rd, 2026...",
      author: "Dr. R. Chandrasekaran (Principal)",
      importance: "High"
    },
    {
      id: "mail_02",
      to: "cse-3a-students@student.ssm.edu.in",
      recipientGroup: "CSE 3rd Year - Section A",
      subject: "[SSM Connect - Class Update] CS8591 Computer Networks Rescheduling Notice",
      timestamp: "2026-10-30T08:16:45Z",
      status: "Delivered (Demo Simulator)",
      bodySnippet: "Period 2 lecture rescheduled to Saturday Period 1 due to Anna University inspection. Today afternoon tutorial in CS-LAB-2...",
      author: "Prof. Priya Sharma",
      importance: "Normal"
    }
  ]
};

