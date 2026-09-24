from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Job Application Tracker",
    description="RESTful API for Job Application Tracker",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.applications import router as applications_router
app.include_router(applications_router)

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["iitgoa_placement_db"]

class Post(BaseModel):
    author: str
    content: str
    timestamp: Optional[str] = None

class Review(BaseModel):
    author: str
    year: int
    content: str

class PYQ(BaseModel):
    question_name: str
    year: int
    description: str
    link_url: Optional[str] = None

class Details(BaseModel):
    eligible_branches: List[str]
    cgpa_cutoff: float
    duration: str
    work_type: str
    stipend: str

class Role(BaseModel):
    role: str
    details: Details
    reviews: List[Review]
    pyqs: List[PYQ]
    posts: List[Post]

class Company(BaseModel):
    _id: Optional[str] = None
    name: str
    appearedIn: List[int]
    roles: List[Role]

class Contribution(BaseModel):
    review: Optional[Review] = None
    pyq: Optional[PYQ] = None
    post: Optional[Post] = None

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "College Placement Tracker API"}

@app.get("/companies/")
async def get_companies(year: Optional[int] = None):
    query = {}
    if year:
        query["appearedIn"] = year
    companies = await db.company.find(query).to_list(100)
    for company in companies:
        company["_id"] = str(company["_id"])
    return companies

@app.get("/companies/{company_id}")
async def get_company(company_id: str):
    try:
        company_oid = ObjectId(company_id)
        logger.info(f"Converted company_id to ObjectId: {company_oid}")
    except ValueError as e:
        logger.error(f"ValueError during ObjectId conversion: {e}")
        raise HTTPException(status_code=400, detail="Invalid company ID format")
    except Exception as e:
        logger.error(f"Unexpected error during ObjectId conversion: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    company = await db.company.find_one({"_id": company_oid})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    company["_id"] = str(company["_id"])
    return company

@app.get("/companies/by_role/{role}")
async def get_companies_by_role(role: str):
    companies = await db.company.find({"roles.role": role}).to_list(100)
    for company in companies:
        company["_id"] = str(company["_id"])
    return companies

@app.get("/companies/{company_id}/role/{role}")
async def get_company_role(company_id: str, role: str):
    try:
        company_oid = ObjectId(company_id)
        logger.info(f"Converted company_id to ObjectId: {company_oid}")
    except ValueError as e:
        logger.error(f"ValueError during ObjectId conversion: {e}")
        raise HTTPException(status_code=400, detail="Invalid company ID format")
    except Exception as e:
        logger.error(f"Unexpected error during ObjectId conversion: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    company = await db.company.find_one({"_id": company_oid})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    company["_id"] = str(company["_id"])
    for r in company.get("roles", []):
        if r["role"] == role:
            r["_id"] = str(r.get("_id", "N/A"))
            return {"company": company["name"], "role": r}
    raise HTTPException(status_code=404, detail="Role not found for this company")

@app.post("/companies/{company_id}/contribute")
async def contribute_to_company(company_id: str, contribution: Contribution):
    logger.info(f"Attempting to convert company_id: {company_id}")
    try:
        company_oid = ObjectId(company_id)
        logger.info(f"Converted to ObjectId: {company_oid}")
    except ValueError as e:
        logger.error(f"ValueError during ObjectId conversion: {e}")
        raise HTTPException(status_code=400, detail="Invalid company ID format")
    except Exception as e:
        logger.error(f"Unexpected error during ObjectId conversion: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    company = await db.company.find_one({"_id": company_oid})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    if not contribution.review and not contribution.pyq and not contribution.post:
        raise HTTPException(status_code=400, detail="At least one of review, pyq, or post must be provided")
    update_operations = {}
    if contribution.review:
        update_operations["$push"] = {"roles.$[elem].reviews": contribution.review.dict()}
    if contribution.pyq:
        update_operations["$push"] = {"roles.$[elem].pyqs": contribution.pyq.dict()}
    if contribution.post:
        update_operations["$push"] = {"roles.$[elem].posts": contribution.post.dict()}
    if update_operations:
        await db.company.update_one(
            {"_id": company_oid},
            update_operations,
            array_filters=[{"elem.role": {"$exists": True}}]
        )
    return {"message": "Contribution added successfully", "company_id": company_id}

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.api_route("/", methods=["GET", "HEAD"])
    async def serve_index():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("companies") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)