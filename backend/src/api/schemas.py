from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Security Metric Schemas
class SecurityMetricCreate(BaseModel):
    metric_type: str
    value: float
    category: Optional[str] = None
    description: Optional[str] = None


class SecurityMetricResponse(BaseModel):
    id: int
    metric_type: str
    value: float
    category: Optional[str]
    description: Optional[str]
    recorded_at: datetime
    
    class Config:
        from_attributes = True


# Vulnerability Schemas
class VulnerabilityCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cve_id: Optional[str] = None
    cvss_score: Optional[float] = None
    severity: str
    asset_name: Optional[str] = None
    asset_type: Optional[str] = None
    source: Optional[str] = None


class VulnerabilityUpdate(BaseModel):
    status: Optional[str] = None
    remediation_notes: Optional[str] = None
    resolved_at: Optional[datetime] = None


class VulnerabilityResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    cve_id: Optional[str]
    cvss_score: Optional[float]
    severity: str
    status: str
    asset_name: Optional[str]
    asset_type: Optional[str]
    source: Optional[str]
    discovered_at: datetime
    resolved_at: Optional[datetime]
    sla_deadline: Optional[datetime]
    remediation_notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Incident Schemas
class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    incident_type: str
    severity: str
    affected_assets: Optional[str] = None


class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    contained_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    root_cause: Optional[str] = None
    lessons_learned: Optional[str] = None


class IncidentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    incident_type: str
    status: str
    severity: str
    detected_at: datetime
    contained_at: Optional[datetime]
    resolved_at: Optional[datetime]
    response_time_minutes: Optional[int]
    resolution_time_minutes: Optional[int]
    affected_assets: Optional[str]
    root_cause: Optional[str]
    lessons_learned: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Compliance Schemas
class ComplianceControlResponse(BaseModel):
    id: int
    control_id: str
    title: str
    description: Optional[str]
    status: str
    evidence: Optional[str]
    remediation_notes: Optional[str]
    
    class Config:
        from_attributes = True


class ComplianceFrameworkResponse(BaseModel):
    id: int
    name: str
    framework_type: str
    version: Optional[str]
    description: Optional[str]
    overall_score: float
    last_assessed_at: Optional[datetime]
    controls: List[ComplianceControlResponse] = []
    
    class Config:
        from_attributes = True


class ComplianceControlUpdate(BaseModel):
    status: Optional[str] = None
    evidence: Optional[str] = None
    remediation_notes: Optional[str] = None


class ComplianceAssessmentCreate(BaseModel):
    framework_id: int
    overall_score: float
    compliant_controls: int
    non_compliant_controls: int
    total_controls: int
    assessor_name: Optional[str] = None
    notes: Optional[str] = None


# Dashboard Schemas
class SecurityPostureResponse(BaseModel):
    overall_score: float
    risk_level: str
    critical_alerts: int
    open_vulnerabilities: int
    active_incidents: int
    compliance_score: float
    trend_data: List[dict] = []


class DashboardStatsResponse(BaseModel):
    total_vulnerabilities: int
    critical_vulnerabilities: int
    open_incidents: int
    critical_incidents: int
    compliance_frameworks: int
    compliant_frameworks: int
    security_score: float
    compliance_score: float


