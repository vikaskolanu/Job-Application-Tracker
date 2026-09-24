from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import os
import json
import logging
from datetime import datetime
from models.application import Application, ApplicationUpdate, ReorderRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/applications", tags=["applications"])

STORE_FILE = os.path.join(os.path.dirname(__file__), "..", "applications_store.json")

# Initial seed data for fresh start (starts empty as user applies)
INITIAL_SEED_DATA: List[dict] = []

# Optional sample template data
SAMPLE_TEMPLATE_DATA = [
    {
        "id": "app-tesco",
        "company": "Tesco Bengaluru",
        "role": "Software Development Engineer Intern",
        "type": "On-Campus",
        "compensation": "₹50,000 / month",
        "duration": "6 months",
        "location": "Bengaluru",
        "appliedDate": "2026-09-20",
        "link": "https://www.tesco.com/careers",
        "notes": "OA scheduled for 26th at 7:00 PM. High focus on DSA & OOPs.",
        "status": "active",
        "order": 0,
        "stages": [
            {
                "id": "st-tesco-1",
                "name": "Online Assessment (OA)",
                "date": "2026-09-26 19:00",
                "status": "pending",
                "notes": "26th @ 7:00 PM - 2 coding questions + MCQs"
            },
            {
                "id": "st-tesco-2",
                "name": "Technical Interview",
                "date": "",
                "status": "pending",
                "notes": "DSA, OOP, OS, System Design"
            },
            {
                "id": "st-tesco-3",
                "name": "Behavioural Round",
                "date": "",
                "status": "pending",
                "notes": "Company values & project deep dive"
            },
            {
                "id": "st-tesco-4",
                "name": "HR Interview",
                "date": "",
                "status": "pending",
                "notes": "Final discussion"
            },
            {
                "id": "st-tesco-5",
                "name": "Offer Received",
                "date": "",
                "status": "pending",
                "notes": "Final placement offer"
            }
        ],
        "topics": [
            {"id": "top-tesco-1", "name": "DSA", "selected": True},
            {"id": "top-tesco-2", "name": "OOP / C++", "selected": True},
            {"id": "top-tesco-3", "name": "DBMS + SQL", "selected": False},
            {"id": "top-tesco-4", "name": "Operating System (OS)", "selected": True},
            {"id": "top-tesco-5", "name": "LLD", "selected": False},
            {"id": "top-tesco-6", "name": "Computer Networks (CN)", "selected": False}
        ],
        "attachments": [
            {"id": "att-tesco-1", "name": "Tesco_SDE_Job_Description.pdf", "type": "jd", "size": "180 KB", "url": "", "uploaded_at": "Sep 20"},
            {"id": "att-tesco-2", "name": "Applied_Resume_Vikas.pdf", "type": "resume", "size": "245 KB", "url": "", "uploaded_at": "Sep 20"}
        ]
    },
    {
        "id": "app-nokia",
        "company": "Nokia",
        "role": "Software Engineer Intern",
        "type": "On-Campus",
        "compensation": "PPO -> 17.5 LPA",
        "duration": "6 months",
        "location": "Bengaluru / Bangalore",
        "appliedDate": "2026-09-15",
        "link": "",
        "notes": "PPO conversion rate is high. Focus on Virtual & In-Person rounds.",
        "status": "active",
        "order": 1,
        "stages": [
            {
                "id": "st-nokia-1",
                "name": "OA (Online Assessment)",
                "date": "2026-09-22 18:00",
                "status": "completed",
                "notes": "Shortlisted! Cleared OA on 22nd Sep."
            },
            {
                "id": "st-nokia-2",
                "name": "Technical (Virtual & In-person)",
                "date": "2026-09-28 11:00",
                "status": "pending",
                "notes": "Virtual round followed by in-person discussion"
            },
            {
                "id": "st-nokia-3",
                "name": "HR Interview",
                "date": "",
                "status": "pending",
                "notes": "Managerial & HR"
            },
            {
                "id": "st-nokia-4",
                "name": "Offer Received",
                "date": "",
                "status": "pending",
                "notes": "Final PPO offer"
            }
        ],
        "topics": [
            {"id": "top-nokia-1", "name": "C++ / OOP", "selected": True},
            {"id": "top-nokia-2", "name": "Computer Networks (CN)", "selected": True},
            {"id": "top-nokia-3", "name": "Operating System (OS)", "selected": True},
            {"id": "top-nokia-4", "name": "DSA", "selected": True}
        ]
    },
    {
        "id": "app-bluno",
        "company": "Bluno",
        "role": "Full Stack Developer Intern",
        "type": "Off-Campus",
        "compensation": "PPO (13 - 17 LPA)",
        "duration": "6 months",
        "location": "Remote / Hybrid",
        "appliedDate": "2026-09-12",
        "link": "",
        "notes": "Fast growing startup. Focus on practical assignment and clean coding.",
        "status": "active",
        "order": 2,
        "stages": [
            {
                "id": "st-bluno-1",
                "name": "Online Assessment (OA)",
                "date": "2026-09-16",
                "status": "completed",
                "notes": "Cleared OA round"
            },
            {
                "id": "st-bluno-2",
                "name": "DSA Round",
                "date": "2026-09-21",
                "status": "completed",
                "notes": "Cleared - Leetcode Medium DSA questions"
            },
            {
                "id": "st-bluno-3",
                "name": "Assignment & Oral",
                "date": "2026-09-27 15:00",
                "status": "pending",
                "notes": "Build mini full-stack dashboard & walkthrough"
            },
            {
                "id": "st-bluno-4",
                "name": "Culture Fit Round",
                "date": "",
                "status": "pending",
                "notes": "Founder & Team interaction"
            },
            {
                "id": "st-bluno-5",
                "name": "Offer Received",
                "date": "",
                "status": "pending",
                "notes": "Final PPO offer"
            }
        ],
        "topics": [
            {"id": "top-bluno-1", "name": "Full Stack", "selected": True},
            {"id": "top-bluno-2", "name": "React / Frontend", "selected": True},
            {"id": "top-bluno-3", "name": "Node.js / Express", "selected": True},
            {"id": "top-bluno-4", "name": "DSA", "selected": True},
            {"id": "top-bluno-5", "name": "System Design", "selected": False},
            {"id": "top-bluno-6", "name": "REST APIs", "selected": True}
        ]
    },
    {
        "id": "app-amgen",
        "company": "Amgen",
        "role": "Data Science / Data Management Intern",
        "type": "On-Campus",
        "compensation": "₹85,000 / month",
        "duration": "6 months",
        "location": "Hyderabad / Bengaluru",
        "appliedDate": "2026-09-14",
        "link": "",
        "notes": "Biotech multinational. Great compensation.",
        "status": "active",
        "order": 3,
        "stages": [
            {
                "id": "st-amgen-1",
                "name": "Online Assessment",
                "date": "2026-09-19",
                "status": "completed",
                "notes": "Cleared online aptitude and SQL coding"
            },
            {
                "id": "st-amgen-2",
                "name": "Technical Assessment",
                "date": "2026-09-29 14:00",
                "status": "pending",
                "notes": "Data pipeline & statistics case study"
            },
            {
                "id": "st-amgen-3",
                "name": "Technical Interview 1",
                "date": "",
                "status": "pending",
                "notes": "Data architecture & modeling"
            },
            {
                "id": "st-amgen-4",
                "name": "HR Interview",
                "date": "",
                "status": "pending",
                "notes": "Final discussion"
            },
            {
                "id": "st-amgen-5",
                "name": "Offer Received",
                "date": "",
                "status": "pending",
                "notes": "Final internship & PPO offer"
            }
        ],
        "topics": [
            {"id": "top-amgen-1", "name": "Data Management", "selected": True},
            {"id": "top-amgen-2", "name": "Data Science", "selected": True},
            {"id": "top-amgen-3", "name": "DBMS + SQL", "selected": True},
            {"id": "top-amgen-4", "name": "Python", "selected": True},
            {"id": "top-amgen-5", "name": "Machine Learning", "selected": False}
        ]
    },
    {
        "id": "app-booking",
        "company": "Booking Holdings",
        "role": "Software Development Engineer",
        "type": "Off-Campus",
        "compensation": "₹47,500 / month",
        "duration": "6 months",
        "location": "Bengaluru",
        "appliedDate": "2026-09-10",
        "link": "",
        "notes": "Applied via referral on career portal.",
        "status": "rejected",
        "order": 4,
        "stages": [
            {
                "id": "st-book-1",
                "name": "Online Assessment (OA)",
                "date": "2026-09-15",
                "status": "completed",
                "notes": "Shortlisted for interview"
            },
            {
                "id": "st-book-2",
                "name": "Technical Interview 1",
                "date": "2026-09-20",
                "status": "rejected",
                "notes": "Could not clear dynamic programming problem"
            },
            {
                "id": "st-book-3",
                "name": "Technical Interview 2",
                "date": "",
                "status": "pending",
                "notes": "Not reached"
            },
            {
                "id": "st-book-4",
                "name": "HR Interview",
                "date": "",
                "status": "pending",
                "notes": "Not reached"
            },
            {
                "id": "st-book-5",
                "name": "Offer Received",
                "date": "",
                "status": "pending",
                "notes": "Not reached"
            }
        ],
        "topics": [
            {"id": "top-book-1", "name": "DSA", "selected": True},
            {"id": "top-book-2", "name": "System Design", "selected": False},
            {"id": "top-book-3", "name": "Operating System", "selected": True},
            {"id": "top-book-4", "name": "LLD", "selected": False}
        ]
    },
    {
        "id": "app-lt",
        "company": "Larsen & Toubro (L&T)",
        "role": "Graduate Engineer Trainee (GET)",
        "type": "On-Campus",
        "compensation": "6 LPA",
        "duration": "Full Time",
        "location": "Mumbai / Pan-India",
        "appliedDate": "2026-09-08",
        "link": "",
        "notes": "Pre-placement talk attended.",
        "status": "shortlisted",
        "order": 5,
        "stages": [
            {
                "id": "st-lt-1",
                "name": "Online Assessment",
                "date": "2026-09-12",
                "status": "completed",
                "notes": "Cleared OA"
            },
            {
                "id": "st-lt-2",
                "name": "Technical Interview",
                "date": "2026-09-18",
                "status": "completed",
                "notes": "Cleared technical panel"
            },
            {
                "id": "st-lt-3",
                "name": "HR Interview",
                "date": "2026-09-23",
                "status": "completed",
                "notes": "Shortlisted / Recommended for final offer!"
            },
            {
                "id": "st-lt-4",
                "name": "Offer Received",
                "date": "2026-09-24",
                "status": "completed",
                "notes": "Offer letter received!"
            }
        ],
        "topics": [
            {"id": "top-lt-1", "name": "Aptitude & Core", "selected": True},
            {"id": "top-lt-2", "name": "DSA Basics", "selected": True},
            {"id": "top-lt-3", "name": "OOP / C++", "selected": True},
            {"id": "top-lt-4", "name": "DBMS + SQL", "selected": True}
        ]
    }
]

def load_from_file() -> List[dict]:
    if os.path.exists(STORE_FILE):
        try:
            with open(STORE_FILE, "r") as f:
                content = f.read().strip()
                if content:
                    data = json.loads(content)
                    if isinstance(data, list):
                        return data
        except Exception as e:
            logger.error(f"Error reading {STORE_FILE}: {e}")
    # Return empty initial data
    save_to_file([])
    return []

def save_to_file(data: List[dict]):
    try:
        with open(STORE_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Error writing to {STORE_FILE}: {e}")

# In-memory cached list backed by file & mongo
_cached_applications = load_from_file()

def get_apps_cache() -> List[dict]:
    global _cached_applications
    if _cached_applications is None:
        _cached_applications = load_from_file()
    return _cached_applications

@router.get("", response_model=List[dict])
async def list_applications(
    search: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None
):
    apps = get_apps_cache()
    # Sort by order
    apps.sort(key=lambda x: x.get("order", 0))
    
    result = apps
    if search:
        s = search.lower()
        result = [
            a for a in result
            if s in a.get("company", "").lower()
            or s in a.get("role", "").lower()
            or any(s in t.get("name", "").lower() for t in a.get("topics", []))
            or any(s in st.get("name", "").lower() for st in a.get("stages", []))
        ]
    if type and type != "All":
        result = [a for a in result if a.get("type", "").lower() == type.lower()]
    if status and status != "All":
        result = [a for a in result if a.get("status", "").lower() == status.lower()]
    
    return result

@router.post("", response_model=dict)
async def create_application(app: Application):
    global _cached_applications
    data = app.dict()
    data["order"] = len(_cached_applications)
    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()
    _cached_applications.append(data)
    save_to_file(_cached_applications)
    return data

@router.get("/{app_id}", response_model=dict)
async def get_application(app_id: str):
    apps = get_apps_cache()
    for a in apps:
        if a.get("id") == app_id:
            return a
    raise HTTPException(status_code=404, detail="Application not found")

@router.put("/{app_id}", response_model=dict)
async def update_application(app_id: str, update: ApplicationUpdate):
    global _cached_applications
    for idx, a in enumerate(_cached_applications):
        if a.get("id") == app_id:
            update_data = update.dict(exclude_unset=True)
            for k, v in update_data.items():
                if v is not None:
                    if k in ["stages", "topics", "attachments"]:
                        a[k] = [item.dict() if hasattr(item, "dict") else item for item in v]
                    else:
                        a[k] = v
            a["updated_at"] = datetime.utcnow().isoformat()
            _cached_applications[idx] = a
            save_to_file(_cached_applications)
            return a
    raise HTTPException(status_code=404, detail="Application not found")

@router.delete("/{app_id}")
async def delete_application(app_id: str):
    global _cached_applications
    prev_len = len(_cached_applications)
    _cached_applications = [a for a in _cached_applications if a.get("id") != app_id]
    if len(_cached_applications) == prev_len:
        raise HTTPException(status_code=404, detail="Application not found")
    save_to_file(_cached_applications)
    return {"message": "Application deleted successfully", "id": app_id}

@router.put("/reorder/all")
async def reorder_applications(req: ReorderRequest):
    global _cached_applications
    id_map = {a["id"]: a for a in _cached_applications}
    new_list = []
    for order, app_id in enumerate(req.application_ids):
        if app_id in id_map:
            app = id_map[app_id]
            app["order"] = order
            new_list.append(app)
    # Append any remaining not in the reorder list
    for a in _cached_applications:
        if a["id"] not in req.application_ids:
            a["order"] = len(new_list)
            new_list.append(a)
    _cached_applications = new_list
    save_to_file(_cached_applications)
    return {"message": "Applications reordered successfully", "count": len(_cached_applications)}

@router.post("/reset/seed")
async def reset_seed_data():
    global _cached_applications
    _cached_applications = []
    save_to_file([])
    return {"message": "Applications reset to clean empty state", "applications": []}

@router.post("/load/sample")
async def load_sample_data():
    global _cached_applications
    _cached_applications = list(SAMPLE_TEMPLATE_DATA)
    save_to_file(_cached_applications)
    return {"message": "Sample template applications loaded", "applications": _cached_applications}
