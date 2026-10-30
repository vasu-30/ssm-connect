/**
 * SSM Connect - Main Application Controller
 * Handles role-based views, state management, announcements feed,
 * timetables, internal exams, approvals workflow, and reactive UI.
 */

(function () {
  const APP = {
    state: {
      currentUser: null,
      currentView: "dashboard",
      feedFilters: {
        category: "All",
        department: "All",
        search: "",
        urgentOnly: false
      },
      classroomFilter: "all",
      selectedTimetableClass: "CSE-3A",
      stagedAttachment: null,
      editingPostId: null
    },

    // INITIALIZATION
    async init() {
      // 1. Load user from storage or default to student
      this.state.currentUser = window.SSM_API.auth.getCurrentUser();

      // 2. Setup event listeners
      this.bindEvents();

      // 3. Render initial role state & views
      await this.applyUserRole();
      this.switchView("dashboard");
      await this.refreshAllData();

      // Re-initialize Lucide icons
      if (window.lucide) window.lucide.createIcons();
    },

    bindEvents() {
      // Mobile menu toggle
      const mobileBtn = document.getElementById("mobile-menu-btn");
      if (mobileBtn) {
        mobileBtn.addEventListener("click", () => {
          this.toggleMobileNav();
        });
      }

      // Close dropdowns on outside click
      document.addEventListener("click", (e) => {
        const userMenuBtn = document.getElementById("user-menu-btn");
        const userDropdown = document.getElementById("user-dropdown-menu");
        if (userMenuBtn && userDropdown && !userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.add("hidden");
        }
      });
    },

    // ROLE & USER MANAGEMENT
    async applyUserRole() {
      const u = this.state.currentUser;
      if (!u) return;

      // Update header avatar & info
      const avatarEl = document.getElementById("header-user-avatar");
      const nameEl = document.getElementById("header-user-name");
      const roleEl = document.getElementById("header-user-role");
      const fullMenuName = document.getElementById("menu-user-full-name");
      const menuBadge = document.getElementById("menu-user-badge");
      const menuId = document.getElementById("menu-user-identifier");
      const greetingName = document.getElementById("dash-greeting-name");
      const greetingSub = document.getElementById("dash-greeting-sub");

      if (avatarEl) avatarEl.src = u.avatar || "/static/assets/logo.svg";
      if (nameEl) nameEl.textContent = u.name.split(" ")[0] || u.name;
      if (roleEl) roleEl.textContent = `${u.roleLabel || u.role} (${u.department || 'SSM'})`;
      if (fullMenuName) fullMenuName.textContent = u.name;
      if (menuBadge) {
        menuBadge.textContent = u.roleLabel || u.role;
        menuBadge.className = `px-2 py-0.5 rounded text-[10px] font-semibold ${
          u.role === 'ceo' || u.role === 'principal' ? 'bg-amber-100 text-amber-900 font-bold' : 
          u.role === 'faculty' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
        }`;
      }
      if (menuId) menuId.textContent = u.registerNo || u.email || "";

      if (greetingName) greetingName.textContent = u.name;
      if (greetingSub) {
        if (u.role === "student") {
          greetingSub.textContent = `Enrolled in ${u.degree || 'B.E.'} • Semester ${u.semester || '5'} (${u.section || 'A'}) • Class Advisor: ${u.advisor || 'Prof. Priya Sharma'}`;
        } else if (u.role === "faculty") {
          greetingSub.textContent = `Department of ${u.departmentName || u.department} • Assigned Classes: ${(u.assignedClasses || []).join(", ")}`;
        } else {
          greetingSub.textContent = `Executive Portal • College-wide administration, academic governance, and institutional notices.`;
        }
      }

      // Quick-role switcher active buttons styling
      document.querySelectorAll(".demo-role-btn").forEach(btn => {
        btn.classList.remove("active", "bg-blue-600", "text-white");
        btn.classList.add("bg-slate-800", "text-slate-200");
      });
      const activeDemoBadge = document.getElementById("demo-active-badge");
      if (activeDemoBadge) {
        activeDemoBadge.textContent = `${u.roleLabel || u.role} (${u.name.split(" ")[0]})`;
      }

      // Show/Hide Role-Gated UI Elements
      const isStudent = (u.role === "student");
      const isFaculty = (u.role === "faculty");
      const isLeadership = (u.role === "ceo" || u.role === "principal");

      // Post button: hidden for students
      const headerPostBtn = document.getElementById("header-post-btn");
      const mobilePostBtn = document.getElementById("mobile-post-btn");
      const seminarProposeBtn = document.getElementById("seminar-propose-btn");

      if (headerPostBtn) headerPostBtn.classList.toggle("hidden", isStudent);
      if (mobilePostBtn) mobilePostBtn.classList.toggle("hidden", isStudent);
      if (seminarProposeBtn) seminarProposeBtn.classList.toggle("hidden", isStudent);

      // Approvals tab & Admin Directory: visible only to CEO and Principal
      const sidebarApprovalsGroup = document.getElementById("sidebar-approvals-group");
      if (sidebarApprovalsGroup) {
        sidebarApprovalsGroup.classList.toggle("hidden", !isLeadership);
      }

      const collegeSettingsBtn = document.getElementById("menu-college-settings-btn");
      if (collegeSettingsBtn) {
        collegeSettingsBtn.classList.toggle("hidden", !isLeadership);
      }

      const btnAddDept = document.getElementById("btn-add-dept");
      if (btnAddDept) {
        btnAddDept.classList.toggle("hidden", !isLeadership);
      }

      // If user is student and was currently on approvals or directory view, redirect to dashboard
      if (isStudent && (this.state.currentView === "approvals" || this.state.currentView === "directory")) {
        this.switchView("dashboard");
      }

      // Update pending approvals counter if leadership
      if (isLeadership) {
        await this.updateApprovalsCounter();
      }

      // Update unread notifications badge
      await this.updateNotificationBadge();
    },

    async quickSwitchUser(userId) {
      const users = (await window.SSM_SAMPLE_DATA.users) || [];
      const user = users.find(u => u.id === userId);
      if (user) {
        window.SSM_API.auth.setCurrentUser(user);
        this.state.currentUser = user;
        await this.applyUserRole();
        await this.loadAnnouncementsFeed();
        this.showToast(`Switched active role to: ${user.name} (${user.roleLabel})`, "info");
      }
    },

    // NAVIGATION & VIEW SWITCHING
    switchView(viewName) {
      this.state.currentView = viewName;

      // Update sidebar nav highlights
      document.querySelectorAll(".nav-item").forEach(item => {
        const itemTarget = item.getAttribute("data-nav-view");
        if (itemTarget === viewName) {
          item.classList.add("text-blue-900", "bg-blue-50/80", "font-semibold");
          item.classList.remove("text-slate-600", "font-medium");
        } else {
          item.classList.remove("text-blue-900", "bg-blue-50/80", "font-semibold");
          item.classList.add("text-slate-600", "font-medium");
        }
      });

      // Show target view, hide others
      const views = ["dashboard", "timetables", "internal-exams", "seminars", "events", "classrooms", "approvals", "directory"];
      views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) {
          el.classList.toggle("hidden", v !== viewName);
        }
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // View-specific data refreshing
      if (viewName === "timetables") this.loadTimetable(this.state.selectedTimetableClass);
      if (viewName === "internal-exams") this.loadExamTimetable();
      if (viewName === "seminars") this.loadSeminars();
      if (viewName === "events") this.loadEvents();
      if (viewName === "classrooms") this.loadClassrooms();
      if (viewName === "approvals") this.loadApprovalsQueue();
      if (viewName === "directory") this.loadDirectory();

      if (window.lucide) window.lucide.createIcons();
    },

    // ANNOUNCEMENTS FEED CONTROLLER
    async loadAnnouncementsFeed() {
      const container = document.getElementById("announcements-container");
      if (!container) return;

      container.innerHTML = `
        <div class="text-center py-10 text-slate-400">
          <i data-lucide="loader-2" class="w-7 h-7 mx-auto animate-spin text-blue-600 mb-2"></i>
          <p class="text-xs">Loading announcements...</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();

      try {
        const posts = await window.SSM_API.announcements.getAll(this.state.feedFilters);

        // Update dashboard active notices count
        const statActive = document.getElementById("stat-active-announcements");
        if (statActive) statActive.textContent = posts.length;

        if (!posts || posts.length === 0) {
          container.innerHTML = `
            <div class="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <i data-lucide="inbox" class="w-6 h-6"></i>
              </div>
              <h3 class="font-bold text-slate-800 text-sm">No announcements found</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">
                No notices match your current filters or search term. Try switching departments or clearing search filters.
              </p>
              <button onclick="window.SSM_APP.resetFeedFilters()" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white">
                Clear Filters
              </button>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
          return;
        }

        const currentUser = this.state.currentUser;

        // Render posts
        container.innerHTML = posts.map(post => {
          const isUrgent = (post.priority === "high" || post.category === "Urgent");
          const isAuthor = (currentUser && currentUser.id === post.authorId);
          const canManage = (currentUser && (isAuthor || currentUser.role === "ceo" || currentUser.role === "principal"));
          const formattedDate = this.formatDate(post.date);

          // Category badge class
          let catClass = "badge-academic";
          if (post.category === "Urgent") catClass = "badge-urgent";
          else if (post.category === "Exam" || post.category === "Internal Assessment") catClass = "badge-exam";
          else if (post.category === "Seminar") catClass = "badge-seminar";
          else if (post.category === "Festival") catClass = "badge-festival";
          else if (post.category === "Placement") catClass = "badge-placement";
          else if (post.category === "Class Update") catClass = "badge-class-update";
          else if (post.category === "Timetable") catClass = "badge-timetable";

          return `
            <article class="announcement-card bg-white rounded-2xl border ${isUrgent ? 'border-rose-200 ring-1 ring-rose-300/50' : 'border-slate-200/80'} p-5 sm:p-6 shadow-sm space-y-4">
              
              <!-- Post Meta Header -->
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}" alt="${post.authorName}" class="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0">
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-bold text-slate-900 text-xs sm:text-sm">${post.authorName}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${
                        post.authorRole === 'CEO' || post.authorRole === 'Principal' ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-700'
                      }">${post.authorRole}</span>
                    </div>
                    <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>${post.authorDepartment || 'SSM'}</span>
                      <span>•</span>
                      <span>${formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 flex-wrap">
                  ${post.pinned ? `
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <i data-lucide="pin" class="w-3 h-3 text-amber-600"></i> Pinned
                    </span>
                  ` : ''}

                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${catClass}">
                    ${post.category}
                  </span>

                  ${canManage ? `
                    <div class="relative group ml-1">
                      <button class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition" aria-label="Post actions">
                        <i data-lucide="more-vertical" class="w-4 h-4"></i>
                      </button>
                      <div class="hidden group-hover:block absolute right-0 top-6 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
                        <button onclick="window.SSM_APP.openPostModal(null, '${post.id}')" class="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit
                        </button>
                        <button onclick="window.SSM_APP.archivePost('${post.id}')" class="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5">
                          <i data-lucide="archive" class="w-3.5 h-3.5"></i> Archive
                        </button>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Post Title & Content -->
              <div>
                <h3 class="heading-font text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                  ${post.title}
                </h3>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                  ${post.message}
                </p>
              </div>

              <!-- Optional Attachment Pill -->
              ${post.attachment ? `
                <div class="pt-1">
                  <a href="#" onclick="window.SSM_APP.downloadAttachmentDemo('${post.attachment.name}'); return false;" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 transition group">
                    <div class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
                      <i data-lucide="${post.attachment.type === 'pdf' ? 'file-text' : 'image'}" class="w-3.5 h-3.5"></i>
                    </div>
                    <span class="font-semibold truncate max-w-[220px] sm:max-w-xs">${post.attachment.name}</span>
                    <span class="text-[10px] text-slate-400">(${post.attachment.size})</span>
                    <i data-lucide="download" class="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-1"></i>
                  </a>
                </div>
              ` : ''}

              <!-- Footer Tags: Target Audience, Department, Status -->
              <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <i data-lucide="users" class="w-3 h-3 text-slate-400"></i>
                    <span>Audience: <strong>${post.audienceLabel || post.audience}</strong></span>
                  </span>

                  ${post.department && post.department !== "All" ? `
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      Dept: ${post.department}
                    </span>
                  ` : ''}

                  ${post.classCode && post.classCode !== "All" ? `
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      Class: ${post.classCode}
                    </span>
                  ` : ''}
                </div>

                <div class="flex items-center gap-3 text-[11px] text-slate-400">
                  <span class="flex items-center gap-1">
                    <i data-lucide="eye" class="w-3 h-3"></i> ${post.viewsCount || 42} views
                  </span>
                  <button onclick="window.SSM_APP.shareAnnouncement('${post.id}')" class="hover:text-blue-600 flex items-center gap-1">
                    <i data-lucide="share-2" class="w-3 h-3"></i> Share
                  </button>
                </div>
              </div>

            </article>
          `;
        }).join("");

      } catch (err) {
        container.innerHTML = `<div class="p-6 bg-rose-50 rounded-xl text-rose-700 text-xs">Error loading announcements: ${err.message}</div>`;
      }

      if (window.lucide) window.lucide.createIcons();
    },

    handleSearchInput(val) {
      this.state.feedFilters.search = val;
      this.loadAnnouncementsFeed();
    },

    handleFilterChange() {
      const dept = document.getElementById("feed-dept-filter").value;
      this.state.feedFilters.department = dept;
      this.loadAnnouncementsFeed();
    },

    filterFeedCategory(cat) {
      this.state.feedFilters.category = cat;

      // Update pill styling
      document.querySelectorAll(".cat-pill").forEach(pill => {
        const pCat = pill.getAttribute("data-cat");
        if (pCat === cat) {
          pill.className = "cat-pill active px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white transition flex-shrink-0";
        } else {
          pill.className = "cat-pill px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex-shrink-0";
        }
      });

      this.loadAnnouncementsFeed();
    },

    resetFeedFilters() {
      this.state.feedFilters = {
        category: "All",
        department: "All",
        search: "",
        urgentOnly: false
      };
      const searchInput = document.getElementById("feed-search-input");
      const deptSelect = document.getElementById("feed-dept-filter");
      if (searchInput) searchInput.value = "";
      if (deptSelect) deptSelect.value = "All";
      this.filterFeedCategory("All");
    },

    // TIMETABLES CONTROLLER
    async loadTimetable(classCode) {
      this.state.selectedTimetableClass = classCode;
      const tbody = document.getElementById("timetable-tbody");
      if (!tbody) return;

      const metaDept = document.getElementById("tt-meta-dept");
      const metaRoom = document.getElementById("tt-meta-room");
      const metaAdvisor = document.getElementById("tt-meta-advisor");

      try {
        const tt = await window.SSM_API.timetables.getByClass(classCode);
        if (!tt) {
          tbody.innerHTML = `<tr><td colspan="10" class="p-6 text-center text-slate-400">Timetable not available for ${classCode}</td></tr>`;
          return;
        }

        if (metaDept) metaDept.textContent = tt.deptName || tt.dept;
        if (metaRoom) metaRoom.textContent = `${tt.room} (${tt.classCode})`;
        if (metaAdvisor) metaAdvisor.textContent = tt.advisor;

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

        tbody.innerHTML = days.map(day => {
          const slots = tt.days[day] || [];
          if (slots.length === 0) return '';

          // Build row cells
          // Index map for typical periods:
          // 0: P1, 1: P2, 2: TeaBreak, 3: P3, 4: P4, 5: LunchBreak, 6: P5, 7: P6, 8: P7
          let cellsHtml = '';

          slots.forEach(slot => {
            if (slot.isBreak) {
              cellsHtml += `
                <td class="p-2 text-center period-cell-break text-[10px]">
                  <span class="vertical-text font-bold uppercase tracking-wider">${slot.subject}</span>
                </td>
              `;
            } else if (slot.span && slot.span > 1) {
              // Colspan for 3-period continuous labs or workshops
              cellsHtml += `
                <td colspan="${slot.span}" class="p-2.5 period-cell-lab">
                  <div class="p-2 bg-white/90 rounded-lg shadow-xs border border-purple-200">
                    <span class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 uppercase mb-1">
                      ${slot.type} (${slot.span} hrs)
                    </span>
                    <p class="font-bold text-purple-950 text-xs">${slot.subject}</p>
                    <p class="text-[10px] text-slate-500 mt-0.5">Faculty: ${slot.faculty} • Room: <strong>${slot.room}</strong></p>
                  </div>
                </td>
              `;
            } else {
              let cellTypeClass = "period-cell-theory";
              if (slot.type === "placement") cellTypeClass = "period-cell-placement";

              cellsHtml += `
                <td class="p-2.5 ${cellTypeClass}">
                  <div class="h-full flex flex-col justify-between">
                    <div>
                      <span class="inline-block px-1 rounded text-[9px] font-bold bg-blue-100 text-blue-800 mb-0.5 font-mono">
                        ${slot.code}
                      </span>
                      <p class="font-bold text-slate-900 text-[11px] leading-tight line-clamp-2">${slot.subject}</p>
                    </div>
                    <div class="mt-1 pt-1 border-t border-slate-200/50 text-[10px] text-slate-500">
                      <p class="truncate">${slot.faculty}</p>
                      <span class="font-bold text-slate-700">${slot.room}</span>
                    </div>
                  </div>
                </td>
              `;
            }
          });

          return `
            <tr>
              <td class="p-3 font-bold text-slate-900 text-center bg-slate-100/70 border-r border-slate-200">
                ${day}
              </td>
              ${cellsHtml}
            </tr>
          `;
        }).join("");

      } catch (e) {
        tbody.innerHTML = `<tr><td colspan="10" class="p-4 text-center text-rose-600">Error loading timetable</td></tr>`;
      }
    },

    // INTERNAL EXAMS CONTROLLER
    async loadExamTimetable() {
      const tbody = document.getElementById("exam-timetable-tbody");
      if (!tbody) return;

      try {
        const exams = await window.SSM_API.internalExams.getAll();
        const activeExam = exams[0];
        if (!activeExam) return;

        tbody.innerHTML = activeExam.schedule.map(row => {
          return `
            <tr class="hover:bg-slate-50 transition">
              <td class="p-3 font-bold text-slate-900 whitespace-nowrap">
                ${row.date}<br>
                <span class="text-[10px] text-slate-500 font-normal">${row.day}</span>
              </td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-black ${
                  row.session === 'FN' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                }">
                  ${row.session} (${row.session === 'FN' ? '09:30 AM' : '01:45 PM'})
                </span>
              </td>
              <td class="p-3">
                <span class="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded">${row.subjectCode}</span>
                <p class="font-bold text-slate-900 text-xs mt-0.5">${row.subjectName}</p>
              </td>
              <td class="p-3 text-slate-600">
                ${row.dept} (Sem ${row.semester})
              </td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-800 text-[11px] border border-slate-200">
                  ${row.halls}
                </span>
              </td>
              <td class="p-3 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                ${row.syllabus}
              </td>
            </tr>
          `;
        }).join("");

      } catch (e) {
        console.error(e);
      }
    },

    // SEMINARS CONTROLLER
    async loadSeminars() {
      const grid = document.getElementById("seminars-grid");
      if (!grid) return;

      try {
        const list = await window.SSM_API.seminars.getAll();

        grid.innerHTML = list.map(sem => {
          const isRegistered = sem.isUserRegistered;
          const isFull = sem.registeredCount >= sem.capacity;

          return `
            <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row gap-6">
              
              <!-- Speaker Photo & Meta -->
              <div class="md:w-64 flex-shrink-0 text-center md:text-left flex flex-col items-center md:items-start">
                <img src="${sem.speakerImage}" alt="${sem.speaker}" class="w-24 h-24 rounded-2xl object-cover ring-2 ring-blue-100 shadow-md mb-3">
                <h4 class="font-bold text-slate-900 text-sm">${sem.speaker}</h4>
                <p class="text-[11px] text-blue-700 font-semibold mt-0.5">${sem.speakerTitle}</p>
                <p class="text-[11px] text-slate-500 mt-2 leading-relaxed text-left">${sem.speakerBio}</p>
              </div>

              <!-- Seminar Details -->
              <div class="flex-1 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                      Department of ${sem.department}
                    </span>
                    <span class="text-xs text-slate-400 font-medium">Audience: ${sem.targetAudience}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isFull ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }">
                    ${isFull ? 'Registrations Full' : 'Seats Open'}
                  </span>
                </div>

                <h3 class="heading-font text-lg font-bold text-slate-900">
                  ${sem.title}
                </h3>

                <!-- Logistics Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-semibold">Date &amp; Time</span>
                    <span class="font-bold text-slate-800">${sem.date} • ${sem.time}</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-semibold">Venue</span>
                    <span class="font-bold text-slate-800">${sem.venue}</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-semibold">Confirmed Attendees</span>
                    <span class="font-bold text-blue-700">${sem.registeredCount} / ${sem.capacity} registered</span>
                  </div>
                </div>

                <!-- Topics list -->
                <div class="space-y-1">
                  <p class="text-xs font-bold text-slate-700">Core Lecture Topics:</p>
                  <ul class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-600">
                    ${(sem.topics || []).map(t => `<li class="flex items-center gap-1.5"><i data-lucide="check-circle" class="w-3.5 h-3.5 text-blue-600 flex-shrink-0"></i> <span>${t}</span></li>`).join('')}
                  </ul>
                </div>

                <!-- Registration Action Bar -->
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-xs text-slate-500">Coordinator: <strong>${sem.coordinator}</strong></span>
                  
                  <button onclick="window.SSM_APP.registerForSeminar('${sem.id}')" ${isRegistered || isFull ? 'disabled' : ''} class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isRegistered ? 'bg-emerald-100 text-emerald-800 cursor-default' : 
                    isFull ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                    'bg-blue-700 hover:bg-blue-800 text-white shadow-sm'
                  }">
                    <i data-lucide="${isRegistered ? 'check' : 'ticket'}" class="w-3.5 h-3.5"></i>
                    ${isRegistered ? 'Registered (Pass Confirmed)' : isFull ? 'Full' : 'Reserve My Seat'}
                  </button>
                </div>

              </div>

            </div>
          `;
        }).join("");

      } catch (e) {
        console.error(e);
      }

      if (window.lucide) window.lucide.createIcons();
    },

    async registerForSeminar(semId) {
      try {
        await window.SSM_API.seminars.register(semId);
        this.showToast("Successfully registered! Digital pass sent to your college email.", "success");
        await this.loadSeminars();
      } catch (e) {
        this.showToast(e.message, "error");
      }
    },

    // EVENTS CONTROLLER
    async loadEvents() {
      const grid = document.getElementById("events-grid");
      if (!grid) return;

      try {
        const events = await window.SSM_API.events.getAll();

        grid.innerHTML = events.map(evt => {
          return `
            <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col">
              <div class="h-44 relative overflow-hidden bg-slate-900">
                <img src="${evt.image}" alt="${evt.title}" class="w-full h-full object-cover opacity-85 hover:scale-105 transition duration-500">
                <div class="absolute top-3 left-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                    ${evt.category}
                  </span>
                </div>
                <div class="absolute bottom-3 left-3 right-3 text-white">
                  <span class="text-[11px] font-bold text-amber-300">${evt.date}</span>
                  <h3 class="heading-font font-bold text-base leading-tight drop-shadow-md">${evt.title}</h3>
                </div>
              </div>

              <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p class="text-xs font-semibold text-blue-900 italic mb-2">"${evt.tagline}"</p>
                  <p class="text-xs text-slate-600 leading-relaxed">${evt.description}</p>
                  
                  <div class="mt-3 space-y-1">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Festival Highlights:</p>
                    <ul class="text-xs space-y-1 text-slate-700">
                      ${(evt.highlights || []).slice(0, 3).map(h => `<li class="flex items-start gap-1.5"><i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5"></i> <span>${h}</span></li>`).join('')}
                    </ul>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-slate-400 block text-[10px]">Venue</span>
                    <span class="font-bold text-slate-800 truncate max-w-[150px] block">${evt.venue}</span>
                  </div>
                  <button onclick="window.SSM_APP.showToast('Registrations open! Report to department coordinator.', 'info')" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition">
                    View Guidelines
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join("");

      } catch (e) {
        console.error(e);
      }

      if (window.lucide) window.lucide.createIcons();
    },

    // CLASSROOMS CONTROLLER
    async loadClassrooms() {
      const grid = document.getElementById("classrooms-grid");
      if (!grid) return;

      try {
        let list = await window.SSM_API.classrooms.getAll();

        if (this.state.classroomFilter !== "all") {
          list = list.filter(r => r.status === this.state.classroomFilter);
        }

        // Update dashboard free rooms count
        const statAvail = document.getElementById("stat-classrooms-available");
        const freeCount = (await window.SSM_API.classrooms.getAll()).filter(r => r.status === "Available").length;
        if (statAvail) statAvail.textContent = `${freeCount} Free`;

        grid.innerHTML = list.map(rm => {
          let statusBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
          if (rm.status === "In-Session") statusBadgeClass = "bg-blue-100 text-blue-800 border-blue-200";
          if (rm.status === "Maintenance") statusBadgeClass = "bg-amber-100 text-amber-800 border-amber-200";
          if (rm.status === "Reserved for Exam") statusBadgeClass = "bg-purple-100 text-purple-800 border-purple-200";

          const canEditStatus = (this.state.currentUser && this.state.currentUser.role !== "student");

          return `
            <div class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <span class="font-mono text-base font-black text-slate-900">${rm.number}</span>
                  <p class="text-xs font-semibold text-slate-600">${rm.type}</p>
                  <p class="text-[11px] text-slate-400">${rm.block} • ${rm.floor}</p>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadgeClass}">
                  ${rm.status}
                </span>
              </div>

              <div class="py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Active Session</span>
                <p class="font-bold text-slate-800 truncate">${rm.currentSession || 'None (Free)'}</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Faculty in Charge: ${rm.facultyInCharge}</p>
              </div>

              <!-- Facilities Badges -->
              <div class="flex flex-wrap gap-1">
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  <i data-lucide="users" class="w-3 h-3 inline mr-0.5"></i> Cap: ${rm.capacity}
                </span>
                ${(rm.facilities || []).slice(0, 2).map(f => `
                  <span class="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    ${f}
                  </span>
                `).join('')}
              </div>

              ${canEditStatus ? `
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span class="text-[11px] text-slate-400">Available: ${rm.nextAvailable}</span>
                  <button onclick="window.SSM_APP.promptClassroomStatusUpdate('${rm.id}', '${rm.status}')" class="text-blue-700 font-bold hover:underline text-[11px]">
                    Update Status
                  </button>
                </div>
              ` : `
                <div class="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  Available: <strong>${rm.nextAvailable}</strong>
                </div>
              `}
            </div>
          `;
        }).join("");

      } catch (e) {
        console.error(e);
      }

      if (window.lucide) window.lucide.createIcons();
    },

    filterClassrooms(filterType) {
      this.state.classroomFilter = filterType;
      document.querySelectorAll(".rm-pill").forEach(p => {
        const f = p.getAttribute("data-rm-filter");
        if (f === filterType) {
          p.className = "rm-pill active px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white";
        } else {
          p.className = "rm-pill px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200";
        }
      });
      this.loadClassrooms();
    },

    async promptClassroomStatusUpdate(roomId, currentStatus) {
      const newStatus = prompt("Select new room status (Available / In-Session / Maintenance / Reserved for Exam):", currentStatus);
      if (newStatus && ["Available", "In-Session", "Maintenance", "Reserved for Exam"].includes(newStatus)) {
        let currentSession = "";
        if (newStatus === "In-Session") {
          currentSession = prompt("Enter current class subject & faculty:", "CS8591 Lecture - Prof. Priya Sharma") || "Class in Session";
        }
        await window.SSM_API.classrooms.updateStatus(roomId, newStatus, currentSession);
        this.showToast(`Updated classroom status to ${newStatus}`, "success");
        await this.loadClassrooms();
      }
    },

    // PRINCIPAL & CEO APPROVALS QUEUE
    async loadApprovalsQueue() {
      const container = document.getElementById("approvals-queue-list");
      if (!container) return;

      try {
        const pendingPosts = await window.SSM_API.announcements.getPendingApprovals();
        await this.updateApprovalsCounter();

        if (pendingPosts.length === 0) {
          container.innerHTML = `
            <div class="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <i data-lucide="check" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-slate-800 text-sm">Approvals Queue is Clear</h4>
              <p class="text-xs text-slate-500">All submitted faculty notices have been reviewed and published.</p>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
          return;
        }

        container.innerHTML = pendingPosts.map(post => {
          return `
            <div class="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 space-y-4 shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}" alt="${post.authorName}" class="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-300">
                  <div>
                    <span class="font-bold text-slate-900 text-xs sm:text-sm">${post.authorName}</span>
                    <span class="ml-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">${post.authorRole} • ${post.authorDepartment}</span>
                    <p class="text-[11px] text-slate-500 mt-0.5">Submitted: ${this.formatDate(post.date)}</p>
                  </div>
                </div>

                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wider">
                  Pending Review
                </span>
              </div>

              <div>
                <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Requested Scope: College-Wide Broadcast</span>
                <h3 class="heading-font text-base font-bold text-slate-900 mt-0.5">${post.title}</h3>
                <p class="text-xs text-slate-700 leading-relaxed mt-1.5">${post.message}</p>
              </div>

              ${post.attachment ? `
                <div class="p-2.5 bg-white rounded-xl border border-amber-200/60 inline-flex items-center gap-2 text-xs">
                  <i data-lucide="file-text" class="w-4 h-4 text-amber-700"></i>
                  <span class="font-semibold text-slate-800">${post.attachment.name}</span>
                  <span class="text-slate-400 text-[10px]">(${post.attachment.size})</span>
                </div>
              ` : ''}

              <!-- Actions: Approve vs Reject with feedback -->
              <div class="pt-3 border-t border-amber-200/60 flex items-center justify-end gap-3">
                <button onclick="window.SSM_APP.rejectAnnouncement('${post.id}')" class="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 text-xs font-semibold transition flex items-center gap-1.5">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i> Request Revision
                </button>
                <button onclick="window.SSM_APP.approveAnnouncement('${post.id}')" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i> Approve &amp; Broadcast College-Wide
                </button>
              </div>
            </div>
          `;
        }).join("");

      } catch (e) {
        console.error(e);
      }

      if (window.lucide) window.lucide.createIcons();
    },

    async updateApprovalsCounter() {
      const badge = document.getElementById("sidebar-approval-count");
      if (!badge) return;
      try {
        const pending = await window.SSM_API.announcements.getPendingApprovals();
        badge.textContent = pending.length;
        badge.classList.toggle("hidden", pending.length === 0);
      } catch (e) {}
    },

    async approveAnnouncement(id) {
      try {
        await window.SSM_API.announcements.approve(id);
        this.showToast("Post approved and published college-wide to all students and staff!", "success");
        await this.loadApprovalsQueue();
        await this.loadAnnouncementsFeed();
      } catch (e) {
        this.showToast(e.message, "error");
      }
    },

    async rejectAnnouncement(id) {
      const feedback = prompt("Enter revision instructions for the author:", "Please coordinate with Dean Academics before scheduling national level calls for papers.") || "";
      try {
        await window.SSM_API.announcements.reject(id, feedback);
        this.showToast("Post sent back to author with revision feedback.", "info");
        await this.loadApprovalsQueue();
      } catch (e) {
        this.showToast(e.message, "error");
      }
    },

    // DIRECTORY ADMIN CONTROLLER
    async loadDirectory() {
      const deptsGrid = document.getElementById("directory-depts-grid");
      const classesTbody = document.getElementById("directory-classes-tbody");

      try {
        const depts = await window.SSM_API.directory.getDepartments();
        const classes = await window.SSM_API.directory.getClasses();

        if (deptsGrid) {
          deptsGrid.innerHTML = depts.map(d => {
            return `
              <div class="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-black text-sm text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">${d.code}</span>
                  <span class="text-[11px] text-slate-400 font-semibold">${d.studentCount} Students</span>
                </div>
                <h4 class="font-bold text-slate-900 text-xs leading-tight">${d.name}</h4>
                <div class="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <p>HOD: <strong>${d.hod}</strong></p>
                  <p>Faculty Strength: ${d.facultyCount} Professors</p>
                </div>
              </div>
            `;
          }).join("");
        }

        if (classesTbody) {
          classesTbody.innerHTML = classes.map(c => {
            return `
              <tr class="hover:bg-slate-50 transition">
                <td class="p-3 font-mono font-bold text-slate-900">${c.code}</td>
                <td class="p-3 text-slate-700">${c.dept}</td>
                <td class="p-3 text-slate-700">Year ${c.year} (Sem ${c.semester})</td>
                <td class="p-3 font-bold text-slate-800">${c.section}</td>
                <td class="p-3 font-mono text-slate-600">${c.room}</td>
                <td class="p-3 font-bold text-emerald-700">${c.strength} enrolled</td>
                <td class="p-3 text-slate-700 font-medium">${c.advisor}</td>
              </tr>
            `;
          }).join("");
        }

      } catch (e) {
        console.error(e);
      }
    },

    // POST CREATION MODAL & ACTIONS
    openPostModal(category = null, editId = null) {
      const u = this.state.currentUser;
      if (u.role === "student") {
        this.showToast("Students are not permitted to publish official college announcements.", "error");
        return;
      }

      this.state.editingPostId = editId;
      this.state.stagedAttachment = null;

      const modal = document.getElementById("post-modal");
      const titleEl = document.getElementById("post-modal-title");
      const titleInput = document.getElementById("post-title");
      const msgInput = document.getElementById("post-message");
      const catSelect = document.getElementById("post-category");
      const audSelect = document.getElementById("post-audience");
      const deptSelect = document.getElementById("post-dept");
      const classSelect = document.getElementById("post-classcode");
      const attachLabel = document.getElementById("attachment-label");

      if (attachLabel) attachLabel.textContent = "No attachment selected";

      if (category && catSelect) {
        catSelect.value = category;
      }

      if (modal) modal.classList.remove("hidden");

      // Auto-configure audience scopes based on user role
      if (audSelect) {
        if (u.role === "faculty") {
          audSelect.value = "class_only";
          this.handlePostAudienceChange("class_only");
        } else {
          audSelect.value = "college_wide";
          this.handlePostAudienceChange("college_wide");
        }
      }

      if (window.lucide) window.lucide.createIcons();
    },

    closePostModal() {
      const modal = document.getElementById("post-modal");
      if (modal) modal.classList.add("hidden");
    },

    handlePostAudienceChange(scope) {
      const u = this.state.currentUser;
      const warning = document.getElementById("post-approval-warning");
      const scopeBadge = document.getElementById("post-scope-badge");

      if (scopeBadge) {
        scopeBadge.textContent = scope === "college_wide" ? "College-Wide Broadcast" : 
                                 scope === "department_only" ? "Department Audience" : "Assigned Class";
      }

      // If faculty selects college-wide, display the review warning
      if (warning) {
        warning.classList.toggle("hidden", !(u.role === "faculty" && scope === "college_wide"));
      }
    },

    simulateAttachment() {
      const sampleFiles = [
        { name: "CAT-1_Revised_Timetable_Oct2026.pdf", size: "1.2 MB", type: "pdf" },
        { name: "SSM_Symposium_Call_For_Papers.pdf", size: "2.4 MB", type: "pdf" },
        { name: "Guest_Lecture_Flyer_AI.png", size: "850 KB", type: "image" }
      ];
      const selected = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
      this.state.stagedAttachment = selected;

      const label = document.getElementById("attachment-label");
      if (label) {
        label.innerHTML = `<span class="text-emerald-700 font-bold">Attached: ${selected.name} (${selected.size})</span>`;
      }
      this.showToast(`Simulated attachment selected: ${selected.name}`, "info");
    },

    async handlePostSubmit(e) {
      e.preventDefault();
      const title = document.getElementById("post-title").value;
      const message = document.getElementById("post-message").value;
      const category = document.getElementById("post-category").value;
      const priority = document.getElementById("post-priority").value;
      const audience = document.getElementById("post-audience").value;
      const department = document.getElementById("post-dept").value;
      const classCode = document.getElementById("post-classcode").value;
      const pinned = document.getElementById("post-pinned").checked;

      let audienceLabel = "All College";
      if (audience === "department_only") audienceLabel = `${department} Department`;
      if (audience === "class_only") audienceLabel = `Class ${classCode}`;
      if (audience === "faculty_only") audienceLabel = `Faculty Only`;

      try {
        const postData = {
          title,
          message,
          category,
          priority,
          audience,
          audienceLabel,
          department,
          classCode,
          pinned,
          attachment: this.state.stagedAttachment
        };

        const res = await window.SSM_API.announcements.create(postData);

        this.closePostModal();

        if (res.status === "pending_approval") {
          this.showToast("Announcement submitted! It is in the Principal Review Queue for college-wide approval.", "info");
        } else {
          this.showToast("Announcement published successfully!", "success");
        }

        // Reset form
        document.getElementById("form-create-post").reset();
        await this.loadAnnouncementsFeed();
        await this.updateApprovalsCounter();

      } catch (err) {
        this.showToast(err.message, "error");
      }
    },

    async archivePost(id) {
      if (confirm("Are you sure you want to archive this announcement?")) {
        await window.SSM_API.announcements.archive(id);
        this.showToast("Announcement archived.", "info");
        await this.loadAnnouncementsFeed();
      }
    },

    // NOTIFICATIONS & EMAIL LOGS
    async updateNotificationBadge() {
      const u = this.state.currentUser;
      if (!u) return;

      const badge = document.getElementById("notif-badge-count");
      const notifs = await window.SSM_API.notifications.getUserNotifications(u.id);
      const unread = notifs.filter(n => !n.read).length;

      if (badge) {
        badge.textContent = unread;
        badge.classList.toggle("hidden", unread === 0);
      }
    },

    async toggleNotifDrawer() {
      const drawer = document.getElementById("notif-drawer");
      if (!drawer) return;

      const isOpen = !drawer.classList.contains("translate-x-full");
      if (isOpen) {
        drawer.classList.add("translate-x-full");
      } else {
        drawer.classList.remove("translate-x-full");
        await this.renderNotificationDrawer();
      }
    },

    async renderNotificationDrawer() {
      const u = this.state.currentUser;
      const listEl = document.getElementById("notif-drawer-list");
      if (!listEl || !u) return;

      const notifs = await window.SSM_API.notifications.getUserNotifications(u.id);

      if (notifs.length === 0) {
        listEl.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">No notifications right now.</div>`;
        return;
      }

      listEl.innerHTML = notifs.map(n => {
        return `
          <div class="p-3 rounded-xl border ${n.read ? 'bg-white border-slate-200' : 'bg-blue-50/70 border-blue-200'} text-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold ${n.read ? 'text-slate-800' : 'text-blue-900'}">${n.title}</span>
              ${!n.read ? `<span class="w-2 h-2 rounded-full bg-blue-600"></span>` : ''}
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">${n.message}</p>
            <span class="text-[10px] text-slate-400 block">${this.formatDate(n.timestamp)}</span>
          </div>
        `;
      }).join("");
    },

    async markAllNotificationsRead() {
      const u = this.state.currentUser;
      if (u) {
        await window.SSM_API.notifications.markAllAsRead(u.id);
        await this.renderNotificationDrawer();
        await this.updateNotificationBadge();
        this.showToast("All notifications marked as read", "info");
      }
    },

    openEmailLogsModal() {
      const modal = document.getElementById("email-logs-modal");
      if (modal) {
        modal.classList.remove("hidden");
        this.renderEmailLogs();
      }
    },

    closeEmailLogsModal() {
      const modal = document.getElementById("email-logs-modal");
      if (modal) modal.classList.add("hidden");
    },

    async renderEmailLogs() {
      const container = document.getElementById("email-logs-list");
      if (!container) return;

      const logs = await window.SSM_API.emailLogs.getAll();

      container.innerHTML = logs.map(mail => {
        return `
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                  mail.importance === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                }">
                  Priority: ${mail.importance}
                </span>
                <h4 class="font-bold text-slate-900 text-xs sm:text-sm mt-1">${mail.subject}</h4>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex-shrink-0">
                ${mail.status}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-500 py-1 border-y border-slate-100">
              <p>To: <strong class="text-slate-800">${mail.to}</strong></p>
              <p>Audience: <strong>${mail.recipientGroup}</strong></p>
              <p>Sent by: ${mail.author}</p>
              <p>Dispatched: ${this.formatDate(mail.timestamp)}</p>
            </div>

            <p class="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              "${mail.bodySnippet}"
            </p>
          </div>
        `;
      }).join("");

      if (window.lucide) window.lucide.createIcons();
    },

    // AUTH MODAL & LOGINS
    openAuthModal(tab = "staff") {
      const modal = document.getElementById("auth-modal");
      if (modal) {
        modal.classList.remove("hidden");
        this.switchAuthTab(tab);
      }
    },

    closeAuthModal() {
      const modal = document.getElementById("auth-modal");
      if (modal) modal.classList.add("hidden");
    },

    switchAuthTab(tab) {
      const forms = ["staff", "student", "activate", "reset"];
      forms.forEach(f => {
        const formEl = document.getElementById(`form-auth-${f}`);
        const tabEl = document.getElementById(`auth-tab-${f}`);
        if (formEl) formEl.classList.toggle("hidden", f !== tab);
        if (tabEl) {
          if (f === tab) {
            tabEl.className = "py-3 text-blue-900 border-b-2 border-blue-900 bg-white font-bold";
          } else {
            tabEl.className = "py-3 text-slate-500 hover:text-slate-800";
          }
        }
      });
    },

    async handleStaffLogin(e) {
      e.preventDefault();
      const email = document.getElementById("staff-email").value;
      const password = document.getElementById("staff-password").value;
      const errEl = document.getElementById("staff-auth-error");

      try {
        errEl.classList.add("hidden");
        const user = await window.SSM_API.auth.login(email, password, null);
        this.state.currentUser = user;
        this.closeAuthModal();
        await this.applyUserRole();
        await this.loadAnnouncementsFeed();
        this.showToast(`Signed in successfully as ${user.name}`, "success");
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
      }
    },

    async handleStudentLogin(e) {
      e.preventDefault();
      const regno = document.getElementById("student-regno").value;
      const password = document.getElementById("student-password").value;
      const errEl = document.getElementById("student-auth-error");

      try {
        errEl.classList.add("hidden");
        const user = await window.SSM_API.auth.login(regno, password, "student");
        this.state.currentUser = user;
        this.closeAuthModal();
        await this.applyUserRole();
        await this.loadAnnouncementsFeed();
        this.showToast(`Signed in as Student: ${user.name} (${user.registerNo})`, "success");
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
      }
    },

    async handleStudentActivate(e) {
      e.preventDefault();
      const regno = document.getElementById("activate-regno").value;
      const newPwd = document.getElementById("activate-new-password").value;
      const errEl = document.getElementById("activate-error");

      try {
        errEl.classList.add("hidden");
        const user = await window.SSM_API.auth.activateStudentAccount(regno, "1001", newPwd);
        window.SSM_API.auth.setCurrentUser(user);
        this.state.currentUser = user;
        this.closeAuthModal();
        await this.applyUserRole();
        this.showToast("Account activated successfully! Permanent secure password established.", "success");
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove("hidden");
      }
    },

    async handlePasswordReset(e) {
      e.preventDefault();
      const id = document.getElementById("reset-identifier").value;
      const newPwd = document.getElementById("reset-new-password").value;
      const msgEl = document.getElementById("reset-msg");

      try {
        await window.SSM_API.auth.resetPassword(id, newPwd);
        msgEl.className = "p-2.5 rounded-xl text-xs bg-emerald-50 text-emerald-800 border border-emerald-200";
        msgEl.textContent = "Password updated! You can now sign in with your new password.";
        msgEl.classList.remove("hidden");
      } catch (err) {
        msgEl.className = "p-2.5 rounded-xl text-xs bg-rose-50 text-rose-800 border border-rose-200";
        msgEl.textContent = err.message;
        msgEl.classList.remove("hidden");
      }
    },

    logout() {
      window.SSM_API.auth.logout();
      this.showToast("You have been signed out.", "info");
      // Default to student user for continuing preview
      this.quickSwitchUser("u_stud_1");
    },

    toggleUserDropdown() {
      const menu = document.getElementById("user-dropdown-menu");
      if (menu) menu.classList.toggle("hidden");
    },

    // USER PROFILE MODAL
    openProfileModal() {
      const u = this.state.currentUser;
      if (!u) return;

      document.getElementById("prof-avatar").src = u.avatar || "/static/assets/logo.svg";
      document.getElementById("prof-name").textContent = u.name;
      document.getElementById("prof-role-dept").textContent = `${u.roleLabel || u.role} • ${u.departmentName || u.department || 'SSM'}`;
      document.getElementById("prof-identifier").textContent = u.registerNo || u.email;
      document.getElementById("prof-email").textContent = u.email;
      document.getElementById("prof-department").textContent = u.departmentName || u.department || 'General';
      document.getElementById("prof-class").textContent = u.classCode || (u.assignedClasses ? u.assignedClasses.join(", ") : 'Institution-Wide');

      const modal = document.getElementById("profile-modal");
      if (modal) modal.classList.remove("hidden");
      if (window.lucide) window.lucide.createIcons();
    },

    closeProfileModal() {
      const modal = document.getElementById("profile-modal");
      if (modal) modal.classList.add("hidden");
    },

    // CONFIG MODAL
    async openConfigModal() {
      const cfg = await window.SSM_API.config.get();
      document.getElementById("cfg-college-name").value = cfg.name;
      document.getElementById("cfg-short-name").value = cfg.shortName;
      document.getElementById("cfg-academic-year").value = cfg.academicYear;
      document.getElementById("cfg-helpline").value = cfg.helpline;

      const modal = document.getElementById("config-modal");
      if (modal) modal.classList.remove("hidden");
    },

    closeConfigModal() {
      const modal = document.getElementById("config-modal");
      if (modal) modal.classList.add("hidden");
    },

    async handleConfigSave(e) {
      e.preventDefault();
      const newCfg = {
        name: document.getElementById("cfg-college-name").value,
        shortName: document.getElementById("cfg-short-name").value,
        academicYear: document.getElementById("cfg-academic-year").value,
        helpline: document.getElementById("cfg-helpline").value
      };
      await window.SSM_API.config.update(newCfg);
      this.closeConfigModal();
      this.showToast("College configuration updated successfully!", "success");
    },

    // TOAST SYSTEM
    showToast(message, type = "info") {
      const container = document.getElementById("toast-container");
      if (!container) return;

      const toast = document.createElement("div");
      let icon = "info";
      let bg = "bg-slate-900 text-white";

      if (type === "success") {
        icon = "check-circle";
        bg = "bg-emerald-900 text-emerald-100 border border-emerald-700";
      } else if (type === "error") {
        icon = "alert-triangle";
        bg = "bg-rose-900 text-rose-100 border border-rose-700";
      }

      toast.className = `p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold ${bg} transition-all duration-300 pointer-events-auto transform translate-y-2 opacity-0`;
      toast.innerHTML = `
        <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
        <span>${message}</span>
      `;

      container.appendChild(toast);
      if (window.lucide) window.lucide.createIcons();

      // Animate in
      requestAnimationFrame(() => {
        toast.classList.remove("translate-y-2", "opacity-0");
      });

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2");
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    },

    resetSampleData() {
      if (confirm("Reset all announcements, classrooms, and schedules to fresh sample data?")) {
        window.SSM_API.resetToSampleData();
        this.showToast("Sample data reset successfully!", "info");
        setTimeout(() => window.location.reload(), 500);
      }
    },

    viewUrgentPost() {
      this.switchView("dashboard");
      this.filterFeedCategory("Urgent");
    },

    downloadAttachmentDemo(filename) {
      this.showToast(`Initiating download for ${filename} (Simulation)`, "info");
    },

    shareAnnouncement(id) {
      navigator.clipboard?.writeText(window.location.href);
      this.showToast("Announcement link copied to clipboard!", "success");
    },

    formatDate(dateStr) {
      if (!dateStr) return "";
      try {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHrs < 1) return "Just now";
        if (diffHrs < 24) return `${diffHrs} hours ago`;
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      } catch (e) {
        return dateStr;
      }
    },

    async refreshAllData() {
      await this.loadAnnouncementsFeed();
      await this.loadClassrooms();
    }
  };

  window.SSM_APP = APP;

  // Boot the application when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    APP.init();
  });
})();

