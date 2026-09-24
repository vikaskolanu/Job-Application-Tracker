from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

class Stage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    date: Optional[str] = ""
    status: str = "pending"  # "pending", "completed", "rejected", "in_progress"
    notes: Optional[str] = ""

class Topic(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    selected: bool = False  # checked/prepared status

class Attachment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str = "resume"  # "resume", "jd", "document"
    size: Optional[str] = ""
    url: Optional[str] = ""  # data url or web link
    uploaded_at: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Application(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company: str
    role: str
    type: str = "On-Campus"  # "On-Campus", "Off-Campus", "Referral"
    compensation: Optional[str] = ""
    duration: Optional[str] = ""
    location: Optional[str] = ""
    appliedDate: Optional[str] = ""
    link: Optional[str] = ""
    notes: Optional[str] = ""
    status: str = "active"  # "active", "shortlisted", "rejected", "offer"
    order: int = 0
    stages: List[Stage] = []
    topics: List[Topic] = []
    attachments: List[Attachment] = []
    created_at: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    type: Optional[str] = None
    compensation: Optional[str] = None
    duration: Optional[str] = None
    location: Optional[str] = None
    appliedDate: Optional[str] = None
    link: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    order: Optional[int] = None
    stages: Optional[List[Stage]] = None
    topics: Optional[List[Topic]] = None
    attachments: Optional[List[Attachment]] = None

class ReorderRequest(BaseModel):
    application_ids: List[str]
