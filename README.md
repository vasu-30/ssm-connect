# SSM Connect - Official College Communication Hub

**SSM Connect** is the official, responsive web communication hub for **SSM Institute of Engineering and Technology (SSMIET)**. It unifies college-wide announcements, academic schedules, semester timetables, continuous internal assessment tests (CAT-1), expert seminars, campus festivals, classroom availability, and multi-tier leadership approvals into one intuitive platform accessible on mobile phones, tablets, and desktop computers.

---

## 🌟 Key Capabilities & Role-Based Workflows

### 1. User Roles & Permission Matrix

| Feature / Permission | 🎓 Student | 👩‍🏫 Faculty | 🏫 Principal | 👔 CEO |
| :--- | :---: | :---: | :---: | :---: |
| **Sign-In Method** | Register Number (12 digits) | College Email (`@ssm.edu.in`) | College Email (`@ssm.edu.in`) | College Email (`@ssm.edu.in`) |
| **First-Time Setup Flow** | ✅ Custom secure password setup | Contact System Admin | Executive Admin | Executive Admin |
| **View Announcements** | Department, Semester, & Class scoped | Department & College-wide | Full College View | Full College View |
| **Publish Announcements** | ❌ Read-Only | ✅ Assigned classes & dept | ✅ College-Wide & targeted | ✅ College-Wide & targeted |
| **College-Wide Broadcast** | ❌ | ⏳ Requires Principal Review | ✅ Direct Immediate Publish | ✅ Direct Immediate Publish |
| **Review & Approvals Queue** | ❌ | ❌ | ✅ Moderate faculty posts | ✅ Moderate faculty posts |
| **Semester Timetable** | View & Print enrolled schedule | View & Highlight teaching slots | View all departments | View all departments |
| **CAT-1 Seating & Exam Hall** | ✅ Check hall & syllabus | View & Invigilation notes | Exam Cell master control | Executive oversight |
| **Seminar Reservations** | ✅ 1-Click seat reservation | Propose & coordinate | Manage campus logistics | Strategic oversight |
| **Live Classroom Directory** | ✅ Check room status & specs | ✅ Update status / class | Full Directory Management | Full Directory Management |
| **Simulated Email Logs** | Preference alerts | Class dispatches | College-wide email logs | College-wide email logs |

---

## 🚀 Quick Start & Launch Instructions

### Option 1: Full-Stack Flask Web Server (Recommended)
1. Ensure Python is installed (Python 3.10+ recommended).
2. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

### Option 2: Pure Standalone / Direct Browser Opening
If Python or Flask is not running, the application includes a **transparent LocalStorage fallback**:
- Simply open `static/index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
- All interactive features (role switching, post creation, approval flows, filters, notifications, timetable grids) work client-side seamlessly!

---

## 🔑 Pre-Seeded Sample Accounts (For Quick Evaluation)

The platform includes a persistent **Demo Quick-Switcher Bar** at the top of the screen to switch between roles with a single click. You can also sign in manually using the credentials below:

### 1. Student Account
- **Role:** Student (3rd Year CSE, Section A)
- **Name:** Aravind Swaminathan
- **Register Number:** `713821104001`
- **Default Password:** `Password123!`
- *Note:* Students also have a **"First-Time Setup"** tab to set a custom permanent password.

### 2. Faculty Account
- **Role:** Associate Professor & Class Advisor (CSE)
- **Name:** Prof. Priya Sharma
- **Email:** `priya.sharma@ssm.edu.in`
- **Password:** `Password123!`
- **Assigned Classes:** `CSE-3A`, `CSE-3B`, `CSE-4A`

### 3. Principal Account
- **Role:** Principal & Head of Exam Cell
- **Name:** Dr. R. Chandrasekaran
- **Email:** `principal@ssm.edu.in`
- **Password:** `Password123!`
- *Capabilities:* College-wide announcements, review/approve faculty proposals, directory management.

### 4. CEO Account
- **Role:** Chief Executive Officer & Managing Trustee
- **Name:** Dr. K. Senthil Kumar
- **Email:** `ceo@ssm.edu.in`
- **Password:** `Password123!`
- *Capabilities:* Strategic notices, seed research grants, festival oversight, full governance.

---

## 📋 Comprehensive Feature Tour

1. **Dashboard Feed & Urgent Alerts:**
   - Urgent banner with pulsing alert for Continuous Assessment Tests (CAT-1).
   - Real-time search bar (by title, content, or author).
   - Category filtering pills: *Academic, Class Update, Internal Assessment, Seminar, Festival, Placement, Timetable, Urgent*.
   - Department selector: *CSE, ECE, EEE, MECH, CIVIL, AI&DS*.
   - Metric counters showing active notices, exam countdown, available classrooms, and upcoming seminars.

2. **Publishing & Leadership Approval Engine:**
   - **CEO and Principal** can publish college-wide announcements immediately.
   - **Faculty** can publish directly to their assigned classes (e.g. `CSE-3A`) or their department.
   - If a faculty member requests a **"College-Wide Broadcast"**, the post is routed to the **Principal & CEO Review & Approvals Queue** (`pending_approval`).
   - Principal/CEO can click **"Approve & Broadcast College-Wide"** or **"Request Revision"** with personalized comments.

3. **Semester Timetables:**
   - Interactive 5-day (Monday - Friday) grid across 7 daily class periods plus morning tea break and lunch break.
   - Distinct color coding for Theory Lectures, 3-hour Laboratory Sessions, and Placement/Aptitude Hours.
   - Filterable by department and class code (`CSE-3A`, `ECE-2A`).
   - Dedicated print-optimized view (`window.print()`).

4. **Continuous Assessment Test 1 (CAT-1) Schedules:**
   - Forenoon (FN: 09:30 AM - 11:00 AM) and Afternoon (AN: 01:45 PM - 03:15 PM) session timings.
   - Course codes, subject titles, target batch, allocated exam halls (`MB-301 to MB-304`), and syllabus portion checklists.
   - Strict examination guidelines from the Controller of Examinations.

5. **Industry Seminars & Guest Lectures:**
   - High-profile industry speakers (e.g., Stanford PhD / DeepScale Labs, Texas Instruments, Tata Motors).
   - Speaker bio, topics list, venue, date, and live registration capacity counter.
   - Interactive 1-click **"Reserve My Seat"** pass confirmation.

6. **Campus Festivals & Hackathons:**
   - "SSM Nakshatra 2026" Annual Cultural Extravaganza.
   - "INNOVEX 2026" 36-Hour National Hackathon with ₹2.5L cash pool.
   - "AGNI 2026" 18th Annual Inter-Departmental Sports Olympiad.

7. **Classroom & Smart Lab Live Directory:**
   - Real-time room availability status: `Available`, `In-Session`, `Maintenance`, `Reserved for Exam`.
   - Seating capacity and facility tags (Dual 4K Projector, Smart Board, Wi-Fi 6, AC).
   - Faculty status update action.

8. **Notification Drawer & Automated Email Simulator:**
   - Live notification bell badge with unread counter.
   - Slide-out drawer with notification history and "Mark all read".
   - **Simulated Email Dispatch Log:** Previews automated HTML emails generated by the system for important announcements with recipient group and delivery timestamps.
   - User notification preferences modal (toggle email alerts for urgent notices, exam schedules, and room relocations).

9. **Security & Data Privacy:**
   - Role-based data sanitization: passwords and private phone numbers are stripped from API outputs.
   - First-time student account activation with registration verification.
   - Responsive design tailored for mobile phones, tablets, and widescreen desktop monitors.

---

## 📁 Project Architecture

```
ssm-connect/
├── app.py                      # Flask RESTful API & static asset server
├── requirements.txt            # Python dependencies (flask>=3.0.0)
├── README.md                   # Complete documentation and user manual
└── static/
    ├── index.html              # Responsive HTML5 SPA layout with Tailwind & Lucide
    ├── css/
    │   └── styles.css          # Academic styling, badges, animations, print stylesheet
    ├── assets/
    │   └── logo.svg            # Official SSM College Crest & Logo
    └── js/
        ├── sample-data.js      # Realistic dataset for SSMIET (Odd Semester 2026)
        ├── api.js              # Transparent API client with LocalStorage fallback
        └── app.js              # Reactive UI controller, approvals workflow, and state
```

---

## 🏛️ Identity & Branding
- **Institution:** SSM Institute of Engineering and Technology (SSMIET)
- **Affiliation:** Affiliated to Anna University | Approved by AICTE | Accredited A+ by NAAC
- **Address:** SSM Nagar, NH-209, Dindigul - Palani Highway, Tamil Nadu 624002
- **Helpline:** +91 (0451) 2448800

