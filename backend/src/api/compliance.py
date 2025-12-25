from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User
from ..models.compliance import ComplianceFramework, ComplianceControl, ComplianceAssessment, ControlStatus
from ..api.dependencies import get_current_active_user
from ..api.schemas import (
    ComplianceFrameworkResponse,
    ComplianceControlResponse,
    ComplianceControlUpdate,
    ComplianceAssessmentCreate
)

router = APIRouter(prefix="/api/compliance", tags=["compliance"])


@router.get("/frameworks", response_model=List[ComplianceFrameworkResponse])
def get_frameworks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all compliance frameworks"""
    frameworks = db.query(ComplianceFramework).all()
    return frameworks


@router.get("/frameworks/{framework_id}", response_model=ComplianceFrameworkResponse)
def get_framework(
    framework_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific compliance framework"""
    framework = db.query(ComplianceFramework).filter(ComplianceFramework.id == framework_id).first()
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    return framework


@router.get("/frameworks/{framework_id}/controls", response_model=List[ComplianceControlResponse])
def get_framework_controls(
    framework_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get controls for a framework"""
    framework = db.query(ComplianceFramework).filter(ComplianceFramework.id == framework_id).first()
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    return framework.controls


@router.patch("/controls/{control_id}", response_model=ComplianceControlResponse)
def update_control(
    control_id: int,
    control_update: ComplianceControlUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a compliance control"""
    control = db.query(ComplianceControl).filter(ComplianceControl.id == control_id).first()
    if not control:
        raise HTTPException(status_code=404, detail="Control not found")
    
    update_data = control_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(control, field, value)
    
    db.commit()
    db.refresh(control)
    
    # Update framework overall score
    framework = control.framework
    total_controls = len(framework.controls)
    if total_controls > 0:
        compliant_count = sum(1 for c in framework.controls if c.status == ControlStatus.COMPLIANT)
        framework.overall_score = (compliant_count / total_controls) * 100
        db.commit()
    
    return control


@router.post("/assessments", status_code=status.HTTP_201_CREATED)
def create_assessment(
    assessment_data: ComplianceAssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a compliance assessment"""
    framework = db.query(ComplianceFramework).filter(
        ComplianceFramework.id == assessment_data.framework_id
    ).first()
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    
    assessment = ComplianceAssessment(**assessment_data.dict())
    db.add(assessment)
    
    # Update framework
    framework.overall_score = assessment_data.overall_score
    framework.last_assessed_at = assessment.assessed_at
    db.commit()
    db.refresh(assessment)
    
    return assessment


