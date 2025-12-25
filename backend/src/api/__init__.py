from fastapi import APIRouter
from .auth import router as auth_router
from .dashboard import router as dashboard_router
from .vulnerabilities import router as vulnerabilities_router
from .incidents import router as incidents_router
from .compliance import router as compliance_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(vulnerabilities_router)
api_router.include_router(incidents_router)
api_router.include_router(compliance_router)


