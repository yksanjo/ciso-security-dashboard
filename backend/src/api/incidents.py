from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime
from ..core.database import get_db
from ..models.user import User
from ..models.incident import Incident, IncidentType, IncidentStatus, IncidentSeverity
from ..api.dependencies import get_current_active_user
from ..api.schemas import IncidentCreate, IncidentUpdate, IncidentResponse

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("", response_model=List[IncidentResponse])
def get_incidents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: Optional[str] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get list of incidents"""
    query = db.query(Incident)
    
    if status_filter:
        query = query.filter(Incident.status == status_filter)
    
    if severity:
        query = query.filter(Incident.severity == severity)
    
    incidents = query.order_by(desc(Incident.detected_at)).offset(skip).limit(limit).all()
    return incidents


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific incident"""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(
    incident_data: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new incident"""
    incident = Incident(**incident_data.dict())
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(
    incident_id: int,
    incident_update: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update an incident"""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    update_data = incident_update.dict(exclude_unset=True)
    
    # Calculate response time if contained_at is set
    if "contained_at" in update_data and update_data["contained_at"]:
        if incident.detected_at:
            delta = update_data["contained_at"] - incident.detected_at
            incident.response_time_minutes = int(delta.total_seconds() / 60)
    
    # Calculate resolution time if resolved_at is set
    if "resolved_at" in update_data and update_data["resolved_at"]:
        if incident.detected_at:
            delta = update_data["resolved_at"] - incident.detected_at
            incident.resolution_time_minutes = int(delta.total_seconds() / 60)
    
    for field, value in update_data.items():
        if field not in ["contained_at", "resolved_at"]:
            setattr(incident, field, value)
    
    incident.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(incident)
    return incident


@router.delete("/{incident_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete an incident"""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    db.delete(incident)
    db.commit()
    return None


