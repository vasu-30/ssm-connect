#!/usr/bin/env python3
"""
SSM Connect - Official College Communication Hub Backend
Flask RESTful API & Static Server
SSM Institute of Engineering and Technology
"""

import os
import json
from datetime import datetime, timezone
from flask import Flask, jsonify, request, send_from_directory, send_file

app = Flask(__name__, static_folder="static", static_url_path="/static")

# Initial realistic state for SSM Connect
DATA = {
    "config": {
        "name": "SSM Institute of Engineering and Technology",
        "shortName": "SSM Connect",
        "motto": "Illuminating Minds, Empowering Future Leaders",
        "academicYear": "2026 - 2027 (Odd Semester)",
        "code": "SSM-9221",
        "affiliation": "Affiliated to Anna University | Approved by AICTE | Accredited A+ by NAAC",
        "address": "SSM Nagar, NH-209, Dindigul - Palani Highway, Tamil Nadu 624002",
        "helpline": "+91 (0451) 2448800 / 2448899",
        "emergencyEmail": "emergency@ssm.edu.in",
        "contactEmail": "contact@ssm.edu.in",
        "website": "https://www.ssm.edu.in"
    },
    "users": [
        {
            "id": "u_ceo",
            "name": "Dr. K. Senthil Kumar",
            "role": "ceo",
            "roleLabel": "Chief Executive Officer",
            "email": "ceo@ssm.edu.in",
            "password": "Password123!",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "department": "Executive Management",
            "designation": "CEO & Managing Trustee",
            "phone": "+91 98421 11001",
            "canPublishCollegeWide": True
        },
        {
            "id": "u_principal",
            "name": "Dr. R. Chandrasekaran",
            "role": "principal",
            "roleLabel": "Principal",
            "email": "principal@ssm.edu.in",
            "password": "Password123!",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "department": "Office of the Principal",
            "designation": "Principal & Professor of Mechanical Engg",
            "phone": "+91 98421 22002",
            "canPublishCollegeWide": True
        },
        {
            "id": "u_fac_cse",
            "name": "Prof. Priya Sharma",
            "role": "faculty",
            "roleLabel": "Faculty Member",
            "email": "priya.sharma@ssm.edu.in",
            "password": "Password123!",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            "department": "CSE",
            "departmentName": "Computer Science & Engineering",
            "designation": "Associate Professor & Class Advisor",
            "assignedClasses": ["CSE-3A", "CSE-3B", "CSE-4A"],
            "subjects": ["CS8591 - Computer Networks", "CS8501 - Theory of Computation"],
            "canPublishCollegeWide": False
        },
        {
            "id": "u_fac_ece",
            "name": "Dr. M. Natarajan",
            "role": "faculty",
            "roleLabel": "Faculty Member",
            "email": "m.natarajan@ssm.edu.in",
            "password": "Password123!",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "department": "ECE",
            "departmentName": "Electronics & Communication Engineering",
            "designation": "Professor & Head of Research",
            "assignedClasses": ["ECE-2A", "ECE-3A"],
            "subjects": ["EC8352 - Signals and Systems"],
            "canPublishCollegeWide": False
        },
        {
            "id": "u_stud_1",
            "name": "Aravind Swaminathan",
            "role": "student",
            "roleLabel": "Student",
            "registerNo": "713821104001",
            "email": "aravind.713821104001@student.ssm.edu.in",
            "password": "Password123!",
            "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
            "department": "CSE",
            "departmentName": "Computer Science & Engineering",
            "degree": "B.E. Computer Science & Engineering",
            "semester": 5,
            "year": "3rd Year",
            "section": "A",
            "classCode": "CSE-3A",
            "batch": "2024-2028",
            "bloodGroup": "O+",
            "advisor": "Prof. Priya Sharma"
        }
    ],
    "departments": [
        {"code": "CSE", "name": "Computer Science & Engineering", "hod": "Dr. S. Karthikeyan", "facultyCount": 28, "studentCount": 480},
        {"code": "ECE", "name": "Electronics & Communication Engineering", "hod": "Dr. V. Gomathi", "facultyCount": 24, "studentCount": 420},
        {"code": "EEE", "name": "Electrical & Electronics Engineering", "hod": "Dr. K. Balaji", "facultyCount": 18, "studentCount": 260},
        {"code": "MECH", "name": "Mechanical Engineering", "hod": "Dr. T. Murugan", "facultyCount": 22, "studentCount": 310},
        {"code": "CIVIL", "name": "Civil Engineering", "hod": "Dr. R. Meenakshi", "facultyCount": 15, "studentCount": 210},
        {"code": "AI&DS", "name": "Artificial Intelligence & Data Science", "hod": "Dr. P. Sundaram", "facultyCount": 16, "studentCount": 240}
    ],
    "classes": [
        {"code": "CSE-1A", "dept": "CSE", "year": 1, "semester": 1, "section": "A", "room": "MB-101", "strength": 60, "advisor": "Dr. Anitha K."},
        {"code": "CSE-2A", "dept": "CSE", "year": 2, "semester": 3, "section": "A", "room": "MB-202", "strength": 58, "advisor": "Prof. Rajesh V."},
        {"code": "CSE-3A", "dept": "CSE", "year": 3, "semester": 5, "section": "A", "room": "MB-303", "strength": 62, "advisor": "Prof. Priya Sharma"},
        {"code": "CSE-3B", "dept": "CSE", "year": 3, "semester": 5, "section": "B", "room": "MB-304", "strength": 60, "advisor": "Prof. Priya Sharma"},
        {"code": "ECE-2A", "dept": "ECE", "year": 2, "semester": 3, "section": "A", "room": "TB-201", "strength": 55, "advisor": "Dr. M. Natarajan"}
    ],
    "classrooms": [
        {
            "id": "rm_1",
            "number": "MB-303",
            "block": "Main Academic Block (Babbage Hall)",
            "floor": "3rd Floor",
            "type": "Smart Classroom",
            "capacity": 70,
            "facilities": ["Interactive 4K Smart Board", "Ceiling Dual Projector", "Wi-Fi 6", "Central AC"],
            "status": "In-Session",
            "currentSession": "CS8591 - Computer Networks (CSE-3A)",
            "facultyInCharge": "Prof. Priya Sharma",
            "nextAvailable": "11:30 AM"
        },
        {
            "id": "rm_2",
            "number": "MB-304",
            "block": "Main Academic Block",
            "floor": "3rd Floor",
            "type": "Lecture Hall",
            "capacity": 65,
            "facilities": ["HD Projector", "Whiteboard", "Wi-Fi"],
            "status": "Available",
            "currentSession": "None",
            "facultyInCharge": "Department Staff",
            "nextAvailable": "Now"
        },
        {
            "id": "rm_3",
            "number": "CS-LAB-2",
            "block": "Turing Computer Block",
            "floor": "2nd Floor",
            "type": "Advanced Computer Lab",
            "capacity": 65,
            "facilities": ["65 High-End i7 Workstations", "Gigabit LAN", "AC"],
            "status": "In-Session",
            "currentSession": "Networks & OS Lab (CSE-3B)",
            "facultyInCharge": "Mr. R. Dinesh Kumar",
            "nextAvailable": "01:15 PM"
        },
        {
            "id": "rm_4",
            "number": "AUD-MAIN",
            "block": "Dr. APJ Abdul Kalam Auditorium",
            "floor": "Ground Floor",
            "type": "Central Auditorium",
            "capacity": 1200,
            "facilities": ["Stage Lighting", "Surround Sound JBL", "Dual LED Walls"],
            "status": "Reserved for Exam",
            "currentSession": "Anna University Practical & CAT-1 Setup",
            "facultyInCharge": "Exam Cell",
            "nextAvailable": "Tomorrow 09:00 AM"
        }
    ],
    "announcements": [
        {
            "id": "ann_01",
            "title": "URGENT: Continuous Assessment Test 1 (CAT-1) Timetable & Hall Allocations Released",
            "message": "The Continuous Assessment Test 1 (CAT-1) for all 2nd, 3rd, and 4th-year B.E. / B.Tech students will commence on Monday, 03rd November 2026. Hall tickets and seating charts are available in SSM Connect under the Internal Exams section. Morning sessions run from 09:30 AM to 11:00 AM, and afternoon sessions run from 01:45 PM to 03:15 PM.",
            "category": "Urgent",
            "priority": "high",
            "authorId": "u_principal",
            "authorName": "Dr. R. Chandrasekaran",
            "authorRole": "Principal",
            "authorDepartment": "Office of the Principal",
            "authorAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "date": "2026-10-30T09:00:00Z",
            "audience": "college_wide",
            "audienceLabel": "All College (Faculty & Students)",
            "department": "All",
            "semester": "All",
            "classCode": "All",
            "status": "published",
            "attachment": {"name": "CAT1_Schedule_Nov2026_Official.pdf", "size": "1.4 MB", "type": "pdf"},
            "pinned": True,
            "viewsCount": 1420
        },
        {
            "id": "ann_02",
            "title": "Strategic Vision 2030: Research Grant Allocation & Innovation Incubation Hub Launch",
            "message": "SSM Management is delighted to announce a dedicated seed research fund of ₹50 Lakhs for multidisciplinary student-faculty joint ventures in AI, Robotics, Renewable Energy, and Smart Mobility. Interested faculty and final year project teams may submit concept notes.",
            "category": "Academic",
            "priority": "normal",
            "authorId": "u_ceo",
            "authorName": "Dr. K. Senthil Kumar",
            "authorRole": "CEO",
            "authorDepartment": "Executive Management",
            "authorAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "date": "2026-10-29T14:30:00Z",
            "audience": "college_wide",
            "audienceLabel": "All College",
            "department": "All",
            "semester": "All",
            "classCode": "All",
            "status": "published",
            "attachment": {"name": "SSM_Seed_Grant_Guidelines_2026.pdf", "size": "860 KB", "type": "pdf"},
            "pinned": False,
            "viewsCount": 980
        },
        {
            "id": "ann_03",
            "title": "Class Cancellation & Room Relocation: CS8591 Computer Networks on 31st Oct",
            "message": "Attention 3rd Year CSE Section A (CSE-3A): Tomorrow's (Friday) Period 2 Computer Networks lecture is rescheduled to Saturday morning Period 1. Today's afternoon tutorial class will meet in Turing Lab 2 (CS-LAB-2) instead of MB-303.",
            "category": "Class Update",
            "priority": "high",
            "authorId": "u_fac_cse",
            "authorName": "Prof. Priya Sharma",
            "authorRole": "Faculty",
            "authorDepartment": "Computer Science & Engineering",
            "authorAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            "date": "2026-10-30T08:15:00Z",
            "audience": "class_only",
            "audienceLabel": "CSE - 3rd Year - Section A",
            "department": "CSE",
            "semester": "5",
            "classCode": "CSE-3A",
            "status": "published",
            "attachment": None,
            "pinned": True,
            "viewsCount": 58
        },
        {
            "id": "ann_pending_01",
            "title": "Request for College-Wide Technical Symposium 'CYBERPULSE 2026' Call for Papers",
            "message": "The CSE Department plans to host the National Level Technical Symposium 'CYBERPULSE 2026' on December 5th. We request Principal and CEO approval to open registrations college-wide.",
            "category": "Academic",
            "priority": "normal",
            "authorId": "u_fac_cse",
            "authorName": "Prof. Priya Sharma",
            "authorRole": "Faculty",
            "authorDepartment": "Computer Science & Engineering",
            "authorAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            "date": "2026-10-30T09:30:00Z",
            "audience": "college_wide",
            "audienceLabel": "College-Wide Broadcast (Pending Review)",
            "department": "CSE",
            "semester": "All",
            "classCode": "All",
            "status": "pending_approval",
            "attachment": {"name": "Cyberpulse_2026_Proposal_Budget.pdf", "size": "1.8 MB", "type": "pdf"},
            "pinned": False,
            "viewsCount": 2
        }
    ],
    "emailLogs": [
        {
            "id": "mail_01",
            "to": "all-students@ssm.edu.in, all-faculty@ssm.edu.in",
            "recipientGroup": "College-Wide (Students & Staff)",
            "subject": "[SSM Connect - URGENT] Continuous Assessment Test 1 (CAT-1) Timetable & Hall Allocations",
            "timestamp": "2026-10-30T09:02:14Z",
            "status": "Delivered (Demo Simulator)",
            "bodySnippet": "Official notification from the Office of the Principal regarding the upcoming Continuous Assessment Test 1...",
            "author": "Dr. R. Chandrasekaran (Principal)",
            "importance": "High"
        }
    ]
}

# --- ROUTES & ENDPOINTS ---

@app.route("/")
def index():
    return send_file(os.path.join(app.static_folder, "index.html"))

@app.route("/api/health")
def api_health():
    return jsonify({
        "status": "online",
        "app": "SSM Connect",
        "academicYear": DATA["config"]["academicYear"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route("/api/auth/login", methods=["POST"])
def api_login():
    payload = request.get_json() or {}
    identifier = (payload.get("identifier") or "").strip().lower()
    password = payload.get("password") or ""
    role = payload.get("role")

    user = None
    for u in DATA["users"]:
        if role and u["role"] != role:
            continue
        if u.get("email", "").lower() == identifier or u.get("registerNo", "").lower() == identifier:
            user = u
            break

    if not user:
        return jsonify({"error": "Account not found with this identifier"}), 404

    if user.get("password") and user.get("password") != password:
        return jsonify({"error": "Invalid password"}), 401

    sanitized = {k: v for k, v in user.items() if k != "password"}
    return jsonify({"user": sanitized, "token": f"ssm_token_{user['id']}"})

@app.route("/api/announcements", methods=["GET"])
def api_get_announcements():
    dept = request.args.get("department")
    category = request.args.get("category")
    search = request.args.get("search", "").lower()
    urgent_only = request.args.get("urgent") == "true"
    status = request.args.get("status")

    res = list(DATA["announcements"])

    if status:
        res = [a for a in res if a.get("status") == status]
    if category and category != "All":
        res = [a for a in res if a.get("category", "").lower() == category.lower()]
    if dept and dept != "All":
        res = [a for a in res if a.get("department") in ["All", dept]]
    if urgent_only:
        res = [a for a in res if a.get("priority") == "high" or a.get("category") == "Urgent"]
    if search:
        res = [a for a in res if search in a.get("title", "").lower() or search in a.get("message", "").lower()]

    return jsonify(res)

@app.route("/api/announcements", methods=["POST"])
def api_create_announcement():
    payload = request.get_json() or {}
    title = payload.get("title", "").strip()
    message = payload.get("message", "").strip()
    if not title or not message:
        return jsonify({"error": "Title and message are required"}), 400

    author_id = payload.get("authorId", "u_principal")
    author = next((u for u in DATA["users"] if u["id"] == author_id), DATA["users"][1])

    is_college_wide = (payload.get("audience") == "college_wide")
    status = "published"
    if author["role"] == "faculty" and is_college_wide:
        status = "pending_approval"

    new_post = {
        "id": f"ann_{int(datetime.now().timestamp() * 1000)}",
        "title": title,
        "message": message,
        "category": payload.get("category", "Academic"),
        "priority": payload.get("priority", "normal"),
        "authorId": author["id"],
        "authorName": author["name"],
        "authorRole": author["roleLabel"],
        "authorDepartment": author.get("departmentName", author.get("department", "SSM")),
        "authorAvatar": author.get("avatar"),
        "date": datetime.now(timezone.utc).isoformat(),
        "audience": payload.get("audience", "college_wide"),
        "audienceLabel": payload.get("audienceLabel", "Target Audience"),
        "department": payload.get("department", "All"),
        "semester": payload.get("semester", "All"),
        "classCode": payload.get("classCode", "All"),
        "status": status,
        "pinned": bool(payload.get("pinned")),
        "attachment": payload.get("attachment"),
        "viewsCount": 1
    }

    DATA["announcements"].insert(0, new_post)
    return jsonify(new_post), 201

@app.route("/api/announcements/<post_id>/approve", methods=["POST"])
def api_approve_announcement(post_id):
    post = next((a for a in DATA["announcements"] if a["id"] == post_id), None)
    if not post:
        return jsonify({"error": "Announcement not found"}), 404
    post["status"] = "published"
    post["approvedAt"] = datetime.now(timezone.utc).isoformat()
    return jsonify(post)

@app.route("/api/classrooms", methods=["GET"])
def api_get_classrooms():
    return jsonify(DATA["classrooms"])

@app.route("/api/classrooms/<room_id>/status", methods=["PUT"])
def api_update_classroom_status(room_id):
    payload = request.get_json() or {}
    room = next((r for r in DATA["classrooms"] if r["id"] == room_id), None)
    if not room:
        return jsonify({"error": "Room not found"}), 404
    room["status"] = payload.get("status", room["status"])
    if "currentSession" in payload:
        room["currentSession"] = payload["currentSession"]
    return jsonify(room)

@app.route("/api/email-logs", methods=["GET"])
def api_get_email_logs():
    return jsonify(DATA["emailLogs"])

@app.route("/api/config", methods=["GET", "PUT"])
def api_config():
    if request.method == "PUT":
        payload = request.get_json() or {}
        DATA["config"].update(payload)
    return jsonify(DATA["config"])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[*] SSM Connect server booting at http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)
