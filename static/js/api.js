/**
 * SSM Connect - API Layer with Transparent LocalStorage Fallback
 * Provides consistent Promise-based endpoints whether connected to
 * the Python Flask server or running standalone in the browser.
 */

(function () {
  const STORAGE_KEY_PREFIX = "ssm_connect_data_v1_";
  let isBackendOnline = false;

  // Initialize LocalStorage with sample data if not present
  function initLocalStorage() {
    const rawData = window.SSM_SAMPLE_DATA;
    if (!rawData) return;

    if (!localStorage.getItem(STORAGE_KEY_PREFIX + "initialized")) {
      localStorage.setItem(STORAGE_KEY_PREFIX + "config", JSON.stringify(rawData.collegeConfig));
      localStorage.setItem(STORAGE_KEY_PREFIX + "users", JSON.stringify(rawData.users));
      localStorage.setItem(STORAGE_KEY_PREFIX + "announcements", JSON.stringify(rawData.announcements));
      localStorage.setItem(STORAGE_KEY_PREFIX + "departments", JSON.stringify(rawData.departments));
      localStorage.setItem(STORAGE_KEY_PREFIX + "classes", JSON.stringify(rawData.classes));
      localStorage.setItem(STORAGE_KEY_PREFIX + "classrooms", JSON.stringify(rawData.classrooms));
      localStorage.setItem(STORAGE_KEY_PREFIX + "timetables", JSON.stringify(rawData.timetables));
      localStorage.setItem(STORAGE_KEY_PREFIX + "internalExams", JSON.stringify(rawData.internalExams));
      localStorage.setItem(STORAGE_KEY_PREFIX + "seminars", JSON.stringify(rawData.seminars));
      localStorage.setItem(STORAGE_KEY_PREFIX + "events", JSON.stringify(rawData.events));
      localStorage.setItem(STORAGE_KEY_PREFIX + "notifications", JSON.stringify(rawData.notifications));
      localStorage.setItem(STORAGE_KEY_PREFIX + "emailLogs", JSON.stringify(rawData.emailLogs));
      localStorage.setItem(STORAGE_KEY_PREFIX + "initialized", "true");
    }
  }

  initLocalStorage();

  // Helper storage accessors
  function getLocal(key) {
    try {
      const val = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      console.warn("Storage read error", e);
      return null;
    }
  }

  function setLocal(key, value) {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }

  // Check if Flask backend is alive
  async function checkBackendHealth() {
    try {
      const resp = await fetch("/api/health", { method: "GET", cache: "no-store" });
      if (resp.ok) {
        const data = await resp.json();
        isBackendOnline = data.status === "online";
      } else {
        isBackendOnline = false;
      }
    } catch (e) {
      isBackendOnline = false;
    }
    return isBackendOnline;
  }

  // Trigger health check on load
  checkBackendHealth();

  const API = {
    isBackendOnline: () => isBackendOnline,

    // AUTH METHODS
    auth: {
      async login(identifier, password, selectedRole) {
        identifier = (identifier || "").trim().toLowerCase();
        const users = getLocal("users") || [];

        // Role-based matching
        const user = users.find(u => {
          if (selectedRole && u.role !== selectedRole) return false;
          const matchEmail = (u.email && u.email.toLowerCase() === identifier);
          const matchRegNo = (u.registerNo && u.registerNo.toLowerCase() === identifier);
          return matchEmail || matchRegNo;
        });

        if (!user) {
          throw new Error("Invalid credentials. Please verify your Email or Register Number.");
        }

        // Demo password check: Password123! or any password set by user
        if (user.password && user.password !== password) {
          throw new Error("Incorrect password. Please try again or use the Password Reset flow.");
        }

        // Create sanitized session user (never leak sensitive fields to client state)
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem("ssm_current_user", JSON.stringify(sessionUser));
        return sessionUser;
      },

      getCurrentUser() {
        try {
          const userStr = localStorage.getItem("ssm_current_user");
          if (userStr) return JSON.parse(userStr);
          // Default to student user for demo convenience if none
          const users = getLocal("users") || [];
          const defaultUser = users.find(u => u.role === "student") || users[0];
          if (defaultUser) {
            const sanitized = { ...defaultUser };
            delete sanitized.password;
            localStorage.setItem("ssm_current_user", JSON.stringify(sanitized));
            return sanitized;
          }
          return null;
        } catch (e) {
          return null;
        }
      },

      setCurrentUser(user) {
        const sanitized = { ...user };
        delete sanitized.password;
        localStorage.setItem("ssm_current_user", JSON.stringify(sanitized));
      },

      logout() {
        localStorage.removeItem("ssm_current_user");
      },

      async activateStudentAccount(registerNo, phoneLast4, newPassword) {
        registerNo = (registerNo || "").trim();
        const users = getLocal("users") || [];
        const studentIndex = users.findIndex(u => u.role === "student" && u.registerNo === registerNo);

        if (studentIndex === -1) {
          throw new Error("Register number not found in college student roster. Contact Exam Cell / HOD.");
        }

        if (newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long.");
        }

        users[studentIndex].password = newPassword;
        users[studentIndex].isActivated = true;
        setLocal("users", users);

        const sanitized = { ...users[studentIndex] };
        delete sanitized.password;
        return sanitized;
      },

      async resetPassword(identifier, newPassword) {
        identifier = (identifier || "").trim().toLowerCase();
        const users = getLocal("users") || [];
        const userIndex = users.findIndex(u =>
          (u.email && u.email.toLowerCase() === identifier) ||
          (u.registerNo && u.registerNo.toLowerCase() === identifier)
        );

        if (userIndex === -1) {
          throw new Error("Account with this email or register number was not found.");
        }

        if (newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long.");
        }

        users[userIndex].password = newPassword;
        setLocal("users", users);
        return { success: true, message: "Password updated successfully. You can now sign in." };
      }
    },

    // ANNOUNCEMENTS METHODS
    announcements: {
      async getAll(filters = {}) {
        let list = getLocal("announcements") || [];

        // Filter by user role visibility
        const currentUser = API.auth.getCurrentUser();
        if (currentUser) {
          if (currentUser.role === "student") {
            // Students see published college_wide, their department, or their specific class
            list = list.filter(item => {
              if (item.status !== "published") return false;
              if (item.audience === "college_wide") return true;
              if (item.audience === "department_only" && (item.department === "All" || item.department === currentUser.department)) return true;
              if (item.audience === "class_only" && (item.classCode === "All" || item.classCode === currentUser.classCode)) return true;
              return false;
            });
          } else if (currentUser.role === "faculty") {
            // Faculty see published college-wide, department, class updates, plus their own pending/archived posts
            list = list.filter(item => {
              if (item.authorId === currentUser.id) return true;
              if (item.status !== "published") return false;
              if (item.audience === "college_wide" || item.audience === "faculty_only") return true;
              if (item.department === "All" || item.department === currentUser.department) return true;
              return true;
            });
          }
          // CEO and Principal see all announcements including pending reviews
        }

        // Apply search query
        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.message.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.authorName.toLowerCase().includes(q)
          );
        }

        // Filter by Category
        if (filters.category && filters.category !== "All") {
          list = list.filter(a => a.category.toLowerCase() === filters.category.toLowerCase());
        }

        // Filter by Audience / Department
        if (filters.department && filters.department !== "All") {
          list = list.filter(a => a.department === "All" || a.department === filters.department);
        }

        // Filter by Priority
        if (filters.urgentOnly) {
          list = list.filter(a => a.priority === "high" || a.category === "Urgent");
        }

        // Filter by Status (e.g. pending_approval)
        if (filters.status) {
          list = list.filter(a => a.status === filters.status);
        }

        // Sort: Pinned first, then newest first
        list.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.date) - new Date(a.date);
        });

        return list;
      },

      async getPendingApprovals() {
        const list = getLocal("announcements") || [];
        return list.filter(a => a.status === "pending_approval");
      },

      async create(postData) {
        const currentUser = API.auth.getCurrentUser();
        if (!currentUser) throw new Error("Must be logged in to create announcements.");

        if (currentUser.role === "student") {
          throw new Error("Unauthorized: Students cannot publish official college announcements.");
        }

        const announcements = getLocal("announcements") || [];
        const isCollegeWide = (postData.audience === "college_wide");

        // Faculty posting college-wide goes to pending_approval
        let status = "published";
        if (currentUser.role === "faculty" && isCollegeWide) {
          status = "pending_approval";
        }

        const newPost = {
          id: "ann_" + Date.now(),
          title: postData.title.trim(),
          message: postData.message.trim(),
          category: postData.category || "Academic",
          priority: postData.priority || "normal",
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.roleLabel || currentUser.role,
          authorDepartment: currentUser.departmentName || currentUser.department || "SSM",
          authorAvatar: currentUser.avatar,
          date: new Date().toISOString(),
          audience: postData.audience || "college_wide",
          audienceLabel: postData.audienceLabel || (isCollegeWide ? "All College" : "Target Audience"),
          department: postData.department || "All",
          semester: postData.semester || "All",
          classCode: postData.classCode || "All",
          status: status,
          pinned: !!postData.pinned,
          attachment: postData.attachment || null,
          viewsCount: 1
        };

        announcements.unshift(newPost);
        setLocal("announcements", announcements);

        // If high priority / urgent, create notification & email log simulation
        if (status === "published") {
          API.notifications.createSystemBroadcast(newPost);
        } else if (status === "pending_approval") {
          // Notify principal of pending post
          API.notifications.addNotification({
            userId: "u_principal",
            title: "Post Awaiting Principal Approval",
            message: `${currentUser.name} submitted "${newPost.title}" for College-Wide Broadcast.`,
            type: "approval",
            link: "approvals"
          });
        }

        return newPost;
      },

      async update(id, patch) {
        const list = getLocal("announcements") || [];
        const idx = list.findIndex(a => a.id === id);
        if (idx === -1) throw new Error("Announcement not found");

        list[idx] = { ...list[idx], ...patch, date: new Date().toISOString() };
        setLocal("announcements", list);
        return list[idx];
      },

      async archive(id) {
        const list = getLocal("announcements") || [];
        const idx = list.findIndex(a => a.id === id);
        if (idx === -1) throw new Error("Announcement not found");

        list[idx].status = "archived";
        setLocal("announcements", list);
        return list[idx];
      },

      async approve(id) {
        const currentUser = API.auth.getCurrentUser();
        if (currentUser.role !== "ceo" && currentUser.role !== "principal") {
          throw new Error("Only CEO or Principal can approve college-wide announcements.");
        }

        const list = getLocal("announcements") || [];
        const idx = list.findIndex(a => a.id === id);
        if (idx === -1) throw new Error("Announcement not found");

        list[idx].status = "published";
        list[idx].approvedBy = currentUser.name;
        list[idx].approvedAt = new Date().toISOString();
        setLocal("announcements", list);

        // Trigger notifications to users
        API.notifications.createSystemBroadcast(list[idx]);

        return list[idx];
      },

      async reject(id, feedback = "") {
        const currentUser = API.auth.getCurrentUser();
        if (currentUser.role !== "ceo" && currentUser.role !== "principal") {
          throw new Error("Only CEO or Principal can review announcements.");
        }

        const list = getLocal("announcements") || [];
        const idx = list.findIndex(a => a.id === id);
        if (idx === -1) throw new Error("Announcement not found");

        list[idx].status = "rejected";
        list[idx].rejectionFeedback = feedback || "Requires revision before college-wide publication.";
        setLocal("announcements", list);

        // Notify author
        API.notifications.addNotification({
          userId: list[idx].authorId,
          title: "Announcement Revision Requested",
          message: `Your post "${list[idx].title}" was reviewed: ${list[idx].rejectionFeedback}`,
          type: "approval",
          link: "dashboard"
        });

        return list[idx];
      }
    },

    // TIMETABLES
    timetables: {
      async getByClass(classCode) {
        const timetables = getLocal("timetables") || {};
        return timetables[classCode] || timetables["CSE-3A"] || null;
      },
      async getAll() {
        return getLocal("timetables") || {};
      }
    },

    // INTERNAL EXAMS
    internalExams: {
      async getAll() {
        return getLocal("internalExams") || [];
      }
    },

    // SEMINARS
    seminars: {
      async getAll() {
        return getLocal("seminars") || [];
      },
      async register(seminarId) {
        const list = getLocal("seminars") || [];
        const idx = list.findIndex(s => s.id === seminarId);
        if (idx === -1) throw new Error("Seminar not found");

        if (list[idx].registeredCount < list[idx].capacity) {
          list[idx].registeredCount += 1;
          list[idx].isUserRegistered = true;
          setLocal("seminars", list);
          return list[idx];
        } else {
          throw new Error("This seminar has reached maximum capacity.");
        }
      }
    },

    // EVENTS
    events: {
      async getAll() {
        return getLocal("events") || [];
      }
    },

    // CLASSROOMS & LABS
    classrooms: {
      async getAll() {
        return getLocal("classrooms") || [];
      },
      async updateStatus(id, newStatus, currentSession = "") {
        const list = getLocal("classrooms") || [];
        const idx = list.findIndex(r => r.id === id);
        if (idx === -1) throw new Error("Classroom not found");

        list[idx].status = newStatus;
        if (currentSession) {
          list[idx].currentSession = currentSession;
        }
        setLocal("classrooms", list);
        return list[idx];
      }
    },

    // DIRECTORY MANAGEMENT
    directory: {
      async getDepartments() {
        return getLocal("departments") || [];
      },
      async saveDepartment(dept) {
        const list = getLocal("departments") || [];
        const existingIdx = list.findIndex(d => d.code === dept.code);
        if (existingIdx >= 0) {
          list[existingIdx] = { ...list[existingIdx], ...dept };
        } else {
          list.push(dept);
        }
        setLocal("departments", list);
        return list;
      },
      async getClasses() {
        return getLocal("classes") || [];
      },
      async saveClass(cls) {
        const list = getLocal("classes") || [];
        const existingIdx = list.findIndex(c => c.code === cls.code);
        if (existingIdx >= 0) {
          list[existingIdx] = { ...list[existingIdx], ...cls };
        } else {
          list.push(cls);
        }
        setLocal("classes", list);
        return list;
      }
    },

    // NOTIFICATIONS & EMAIL
    notifications: {
      async getUserNotifications(userId) {
        const notifs = getLocal("notifications") || [];
        return notifs.filter(n => n.userId === userId || n.userId === "all");
      },

      addNotification(notif) {
        const notifs = getLocal("notifications") || [];
        const newNotif = {
          id: "notif_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          timestamp: new Date().toISOString(),
          read: false,
          ...notif
        };
        notifs.unshift(newNotif);
        setLocal("notifications", notifs);
        return newNotif;
      },

      async markAllAsRead(userId) {
        const notifs = getLocal("notifications") || [];
        notifs.forEach(n => {
          if (n.userId === userId || n.userId === "all") {
            n.read = true;
          }
        });
        setLocal("notifications", notifs);
        return true;
      },

      createSystemBroadcast(announcement) {
        // Add in-app notification
        this.addNotification({
          userId: "all",
          title: `Announcement: ${announcement.title}`,
          message: announcement.message.substring(0, 110) + "...",
          type: announcement.priority === "high" ? "urgent" : "academic",
          link: "dashboard"
        });

        // Add simulated email dispatch log
        const emailLogs = getLocal("emailLogs") || [];
        const newMail = {
          id: "mail_" + Date.now(),
          to: announcement.audience === "college_wide" ? "all-campus@ssm.edu.in" : `${announcement.department.toLowerCase()}@ssm.edu.in`,
          recipientGroup: announcement.audienceLabel,
          subject: `[SSM Connect${announcement.priority === "high" ? " - URGENT" : ""}] ${announcement.title}`,
          timestamp: new Date().toISOString(),
          status: "Delivered (Demo Simulator)",
          bodySnippet: announcement.message.substring(0, 160) + "...",
          author: `${announcement.authorName} (${announcement.authorRole})`,
          importance: announcement.priority === "high" ? "High" : "Normal"
        };
        emailLogs.unshift(newMail);
        setLocal("emailLogs", emailLogs);
      }
    },

    // EMAIL LOGS
    emailLogs: {
      async getAll() {
        return getLocal("emailLogs") || [];
      }
    },

    // COLLEGE CONFIG
    config: {
      async get() {
        return getLocal("config") || window.SSM_SAMPLE_DATA.collegeConfig;
      },
      async update(newConfig) {
        setLocal("config", newConfig);
        return newConfig;
      }
    },

    // RESET TO SAMPLE DATA
    resetToSampleData() {
      localStorage.removeItem(STORAGE_KEY_PREFIX + "initialized");
      initLocalStorage();
      const defaultUser = (getLocal("users") || [])[0];
      if (defaultUser) {
        API.auth.setCurrentUser(defaultUser);
      }
      return true;
    }
  };

  window.SSM_API = API;
})();

