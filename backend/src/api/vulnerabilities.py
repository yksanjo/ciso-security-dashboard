from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime
from ..core.database import get_db
from ..models.user import User
from ..models.vulnerability import Vulnerability, Severity, Status
from ..api.dependencies import get_current_active_user
from ..api.schemas import VulnerabilityCreate, VulnerabilityUpdate, VulnerabilityResponse

router = APIRouter(prefix="/api/vulnerabilities", tags=["vulnerabilities"])


@router.get("", response_model=List[VulnerabilityResponse])
def get_vulnerabilities(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    severity: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get list of vulnerabilities"""
    query = db.query(Vulnerability)
    
    if severity:
        query = query.filter(Vulnerability.severity == severity)
    
    if status_filter:
        query = query.filter(Vulnerability.status == status_filter)
    
    vulnerabilities = query.order_by(desc(Vulnerability.discovered_at)).offset(skip).limit(limit).all()
    return vulnerabilities


@router.get("/{vulnerability_id}", response_model=VulnerabilityResponse)
def get_vulnerability(
    vulnerability_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific vulnerability"""
    vulnerability = db.query(Vulnerability).filter(Vulnerability.id == vulnerability_id).first()
    if not vulnerability:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    return vulnerability


@router.post("", response_model=VulnerabilityResponse, status_code=status.HTTP_201_CREATED)
def create_vulnerability(
    vulnerability_data: VulnerabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new vulnerability"""
    vulnerability = Vulnerability(**vulnerability_data.dict())
    db.add(vulnerability)
    db.commit()
    db.refresh(vulnerability)
    return vulnerability


@router.patch("/{vulnerability_id}", response_model=VulnerabilityResponse)
def update_vulnerability(
    vulnerability_id: int,
    vulnerability_update: VulnerabilityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a vulnerability"""
    vulnerability = db.query(Vulnerability).filter(Vulnerability.id == vulnerability_id).first()
    if not vulnerability:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    update_data = vulnerability_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vulnerability, field, value)
    
    vulnerability.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(vulnerability)
    return vulnerability


@router.delete("/{vulnerability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vulnerability(
    vulnerability_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a vulnerability"""
    vulnerability = db.query(Vulnerability).filter(Vulnerability.id == vulnerability_id).first()
    if not vulnerability:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    db.delete(vulnerability)
    db.commit()
    return None


