const API_BASE = '/api/applications';
const STORAGE_KEY = 'job_application_tracker_v1';

// Optional sample template data for testing or previewing
export const SAMPLE_TEMPLATE_DATA = [
  {
    id: "app-tesco",
    company: "Tesco Bengaluru",
    role: "Software Development Engineer Intern",
    type: "On-Campus",
    compensation: "₹50,000 / month",
    duration: "6 months",
    location: "Bengaluru",
    appliedDate: "2026-09-20",
    link: "https://www.tesco.com/careers",
    notes: "OA scheduled for 26th at 7:00 PM. High focus on DSA & OOPs.",
    status: "active",
    order: 0,
    stages: [
      {
        id: "st-tesco-1",
        name: "Online Assessment (OA)",
        date: "2026-09-26 19:00",
        status: "pending",
        notes: "26th @ 7:00 PM - 2 coding questions + MCQs"
      },
      {
        id: "st-tesco-2",
        name: "Technical Interview",
        date: "",
        status: "pending",
        notes: "DSA, OOP, OS, System Design"
      },
      {
        id: "st-tesco-3",
        name: "Behavioural Round",
        date: "",
        status: "pending",
        notes: "Company values & project deep dive"
      },
      {
        id: "st-tesco-4",
        name: "HR Interview",
        date: "",
        status: "pending",
        notes: "Final discussion"
      },
      {
        id: "st-tesco-5",
        name: "Offer Received",
        date: "",
        status: "pending",
        notes: "Final placement offer"
      }
    ],
    topics: [
      { id: "top-tesco-1", name: "DSA", selected: true },
      { id: "top-tesco-2", name: "OOP / C++", selected: true },
      { id: "top-tesco-3", name: "DBMS + SQL", selected: false },
      { id: "top-tesco-4", name: "Operating System (OS)", selected: true },
      { id: "top-tesco-5", name: "LLD", selected: false },
      { id: "top-tesco-6", name: "Computer Networks (CN)", selected: false }
    ],
    attachments: [
      { id: "att-tesco-1", name: "Tesco_SDE_Job_Description.pdf", type: "jd", size: "180 KB", url: "", uploaded_at: "Sep 20" },
      { id: "att-tesco-2", name: "Applied_Resume_Vikas.pdf", type: "resume", size: "245 KB", url: "", uploaded_at: "Sep 20" }
    ]
  },
  {
    id: "app-nokia",
    company: "Nokia",
    role: "Software Engineer Intern",
    type: "On-Campus",
    compensation: "PPO -> 17.5 LPA",
    duration: "6 months",
    location: "Bengaluru / Bangalore",
    appliedDate: "2026-09-15",
    link: "",
    notes: "PPO conversion rate is high. Focus on Virtual & In-Person rounds.",
    status: "active",
    order: 1,
    stages: [
      {
        id: "st-nokia-1",
        name: "OA (Online Assessment)",
        date: "2026-09-22 18:00",
        status: "completed",
        notes: "Shortlisted! Cleared OA on 22nd Sep."
      },
      {
        id: "st-nokia-2",
        name: "Technical (Virtual & In-person)",
        date: "2026-09-28 11:00",
        status: "pending",
        notes: "Virtual round followed by in-person discussion"
      },
      {
        id: "st-nokia-3",
        name: "HR Interview",
        date: "",
        status: "pending",
        notes: "Managerial & HR"
      },
      {
        id: "st-nokia-4",
        name: "Offer Received",
        date: "",
        status: "pending",
        notes: "Final PPO offer"
      }
    ],
    topics: [
      { id: "top-nokia-1", name: "C++ / OOP", selected: true },
      { id: "top-nokia-2", name: "Computer Networks (CN)", selected: true },
      { id: "top-nokia-3", name: "Operating System (OS)", selected: true },
      { id: "top-nokia-4", name: "DSA", selected: true }
    ]
  },
  {
    id: "app-bluno",
    company: "Bluno",
    role: "Full Stack Developer Intern",
    type: "Off-Campus",
    compensation: "PPO (13 - 17 LPA)",
    duration: "6 months",
    location: "Remote / Hybrid",
    appliedDate: "2026-09-12",
    link: "",
    notes: "Fast growing startup. Focus on practical assignment and clean coding.",
    status: "active",
    order: 2,
    stages: [
      {
        id: "st-bluno-1",
        name: "Online Assessment (OA)",
        date: "2026-09-16",
        status: "completed",
        notes: "Cleared OA round"
      },
      {
        id: "st-bluno-2",
        name: "DSA Round",
        date: "2026-09-21",
        status: "completed",
        notes: "Cleared - Leetcode Medium DSA questions"
      },
      {
        id: "st-bluno-3",
        name: "Assignment & Oral",
        date: "2026-09-27 15:00",
        status: "pending",
        notes: "Build mini full-stack dashboard & walkthrough"
      },
      {
        id: "st-bluno-4",
        name: "Culture Fit Round",
        date: "",
        status: "pending",
        notes: "Founder & Team interaction"
      },
      {
        id: "st-bluno-5",
        name: "Offer Received",
        date: "",
        status: "pending",
        notes: "Final PPO offer"
      }
    ],
    topics: [
      { id: "top-bluno-1", name: "Full Stack", selected: true },
      { id: "top-bluno-2", name: "React / Frontend", selected: true },
      { id: "top-bluno-3", name: "Node.js / Express", selected: true },
      { id: "top-bluno-4", name: "DSA", selected: true },
      { id: "top-bluno-5", name: "System Design", selected: false },
      { id: "top-bluno-6", name: "REST APIs", selected: true }
    ]
  },
  {
    id: "app-amgen",
    company: "Amgen",
    role: "Data Science / Data Management Intern",
    type: "On-Campus",
    compensation: "₹85,000 / month",
    duration: "6 months",
    location: "Hyderabad / Bengaluru",
    appliedDate: "2026-09-14",
    link: "",
    notes: "Biotech multinational. Great compensation.",
    status: "active",
    order: 3,
    stages: [
      {
        id: "st-amgen-1",
        name: "Online Assessment",
        date: "2026-09-19",
        status: "completed",
        notes: "Cleared online aptitude and SQL coding"
      },
      {
        id: "st-amgen-2",
        name: "Technical Assessment",
        date: "2026-09-29 14:00",
        status: "pending",
        notes: "Data pipeline & statistics case study"
      },
      {
        id: "st-amgen-3",
        name: "Technical Interview 1",
        date: "",
        status: "pending",
        notes: "Data architecture & modeling"
      },
      {
        id: "st-amgen-4",
        name: "HR Interview",
        date: "",
        status: "pending",
        notes: "Final discussion"
      },
      {
        id: "st-amgen-5",
        name: "Offer Received",
        date: "",
        status: "pending",
        notes: "Final internship & PPO offer"
      }
    ],
    topics: [
      { id: "top-amgen-1", name: "Data Management", selected: true },
      { id: "top-amgen-2", name: "Data Science", selected: true },
      { id: "top-amgen-3", name: "DBMS + SQL", selected: true },
      { id: "top-amgen-4", name: "Python", selected: true },
      { id: "top-amgen-5", name: "Machine Learning", selected: false }
    ]
  },
  {
    id: "app-booking",
    company: "Booking Holdings",
    role: "Software Development Engineer",
    type: "Off-Campus",
    compensation: "₹47,500 / month",
    duration: "6 months",
    location: "Bengaluru",
    appliedDate: "2026-09-10",
    link: "",
    notes: "Applied via referral on career portal.",
    status: "rejected",
    order: 4,
    stages: [
      {
        id: "st-book-1",
        name: "Online Assessment (OA)",
        date: "2026-09-15",
        status: "completed",
        notes: "Shortlisted for interview"
      },
      {
        id: "st-book-2",
        name: "Technical Interview 1",
        date: "2026-09-20",
        status: "rejected",
        notes: "Could not clear dynamic programming problem"
      },
      {
        id: "st-book-3",
        name: "Technical Interview 2",
        date: "",
        status: "pending",
        notes: "Not reached"
      },
      {
        id: "st-book-4",
        name: "HR Interview",
        date: "",
        status: "pending",
        notes: "Not reached"
      },
      {
        id: "st-book-5",
        name: "Offer Received",
        date: "",
        status: "pending",
        notes: "Not reached"
      }
    ],
    topics: [
      { id: "top-book-1", name: "DSA", selected: true },
      { id: "top-book-2", name: "System Design", selected: false },
      { id: "top-book-3", name: "Operating System", selected: true },
      { id: "top-book-4", name: "LLD", selected: false }
    ]
  },
  {
    id: "app-lt",
    company: "Larsen & Toubro (L&T)",
    role: "Graduate Engineer Trainee (GET)",
    type: "On-Campus",
    compensation: "6 LPA",
    duration: "Full Time",
    location: "Mumbai / Pan-India",
    appliedDate: "2026-09-08",
    link: "",
    notes: "Pre-placement talk attended.",
    status: "shortlisted",
    order: 5,
    stages: [
      {
        id: "st-lt-1",
        name: "Online Assessment",
        date: "2026-09-12",
        status: "completed",
        notes: "Cleared OA"
      },
      {
        id: "st-lt-2",
        name: "Technical Interview",
        date: "2026-09-18",
        status: "completed",
        notes: "Cleared technical panel"
      },
      {
        id: "st-lt-3",
        name: "HR Interview",
        date: "2026-09-23",
        status: "completed",
        notes: "Shortlisted / Recommended for final offer!"
      },
      {
        id: "st-lt-4",
        name: "Offer Received",
        date: "2026-09-24",
        status: "completed",
        notes: "Offer letter received!"
      }
    ],
    topics: [
      {"id": "top-lt-1", "name": "Aptitude & Core", "selected": true},
      {"id": "top-lt-2", "name": "DSA Basics", "selected": true},
      {"id": "top-lt-3", "name": "OOP / C++", "selected": true},
      {"id": "top-lt-4", "name": "DBMS + SQL", "selected": true}
    ]
  }
];

function getLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read from localStorage', e);
  }
  return []; // Clean empty start for user applications
}

function setLocalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

export const api = {
  async getApplications() {
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        const data = await res.json();
        setLocalData(data);
        return data;
      }
    } catch (e) {
      console.warn('Backend API unavailable, using local storage cache:', e);
    }
    return getLocalData();
  },

  async createApplication(app) {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app),
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocalData();
        setLocalData([...current, created]);
        return created;
      }
    } catch (e) {
      console.warn('Backend create failed, saving locally:', e);
    }
    const current = getLocalData();
    const newApp = { ...app, id: app.id || `app-${Date.now()}`, order: current.length };
    const updated = [...current, newApp];
    setLocalData(updated);
    return newApp;
  },

  async updateApplication(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocalData();
        const index = current.findIndex(a => a.id === id);
        if (index !== -1) {
          current[index] = updated;
          setLocalData(current);
        }
        return updated;
      }
    } catch (e) {
      console.warn('Backend update failed, updating locally:', e);
    }
    const current = getLocalData();
    const index = current.findIndex(a => a.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updates };
      setLocalData(current);
      return current[index];
    }
    return updates;
  },

  async deleteApplication(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const current = getLocalData();
        setLocalData(current.filter(a => a.id !== id));
        return true;
      }
    } catch (e) {
      console.warn('Backend delete failed, removing locally:', e);
    }
    const current = getLocalData();
    setLocalData(current.filter(a => a.id !== id));
    return true;
  },

  async reorderApplications(ids) {
    try {
      await fetch(`${API_BASE}/reorder/all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_ids: ids }),
      });
    } catch (e) {
      console.warn('Backend reorder failed:', e);
    }
    const current = getLocalData();
    const map = new Map(current.map(a => [a.id, a]));
    const reordered = ids.map((id, idx) => {
      const app = map.get(id);
      return app ? { ...app, order: idx } : null;
    }).filter(Boolean);
    setLocalData(reordered);
    return reordered;
  },

  async resetSeedData() {
    try {
      const res = await fetch(`${API_BASE}/reset/seed`, { method: 'POST' });
      if (res.ok) {
        setLocalData([]);
        return [];
      }
    } catch (e) {
      console.warn('Reset seed failed, clearing local data:', e);
    }
    setLocalData([]);
    return [];
  },

  async loadSampleTemplate() {
    try {
      const res = await fetch(`${API_BASE}/load/sample`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLocalData(data.applications);
        return data.applications;
      }
    } catch (e) {
      console.warn('Load sample failed, using local sample:', e);
    }
    setLocalData(SAMPLE_TEMPLATE_DATA);
    return SAMPLE_TEMPLATE_DATA;
  }
};
