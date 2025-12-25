from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import List
from ..core.database import get_db
from ..models.user import User
from ..models.security_metric import SecurityMetric, MetricType
from ..models.vulnerability import Vulnerability, Severity, Status as VulnStatus
from ..models.incident import Incident, IncidentStatus, IncidentSeverity
from ..models.compliance import ComplianceFramework
from ..api.dependencies import get_current_active_user
from ..api.schemas import SecurityPostureResponse, DashboardStatsResponse

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/posture", response_model=SecurityPostureResponse)
def get_security_posture(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get overall security posture"""
    # Get latest security score
    latest_score = db.query(SecurityMetric).filter(
        SecurityMetric.metric_type == MetricType.SECURITY_SCORE
    ).order_by(SecurityMetric.recorded_at.desc()).first()
    
    overall_score = latest_score.value if latest_score else 75.0
    
    # Calculate risk level
    if overall_score >= 90:
        risk_level = "low"
    elif overall_score >= 70:
        risk_level = "medium"
    elif overall_score >= 50:
        risk_level = "high"
    else:
        risk_level = "critical"
    
    # Count critical alerts (critical vulnerabilities + critical incidents)
    critical_vulns = db.query(Vulnerability).filter(
        and_(
            Vulnerability.severity == Severity.CRITICAL,
            Vulnerability.status.in_([VulnStatus.OPEN, VulnStatus.IN_PROGRESS])
        )
    ).count()
    
    critical_incidents = db.query(Incident).filter(
        and_(
            Incident.severity == IncidentSeverity.CRITICAL,
            Incident.status != IncidentStatus.RESOLVED
        )
    ).count()
    
    critical_alerts = critical_vulns + critical_incidents
    
    # Count open vulnerabilities
    open_vulnerabilities = db.query(Vulnerability).filter(
        Vulnerability.status.in_([VulnStatus.OPEN, VulnStatus.IN_PROGRESS])
    ).count()
    
    # Count active incidents
    active_incidents = db.query(Incident).filter(
        Incident.status != IncidentStatus.RESOLVED
    ).count()
    
    # Get compliance score
    latest_compliance = db.query(SecurityMetric).filter(
        SecurityMetric.metric_type == MetricType.COMPLIANCE_SCORE
    ).order_by(SecurityMetric.recorded_at.desc()).first()
    
    compliance_score = latest_compliance.value if latest_compliance else 0.0
    
    # Get trend data (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    trend_metrics = db.query(SecurityMetric).filter(
        and_(
            SecurityMetric.metric_type == MetricType.SECURITY_SCORE,
            SecurityMetric.recorded_at >= thirty_days_ago
        )
    ).order_by(SecurityMetric.recorded_at.asc()).all()
    
    trend_data = [
        {
            "date": metric.recorded_at.isoformat(),
            "value": metric.value
        }
        for metric in trend_metrics
    ]
    
    return SecurityPostureResponse(
        overall_score=overall_score,
        risk_level=risk_level,
        critical_alerts=critical_alerts,
        open_vulnerabilities=open_vulnerabilities,
        active_incidents=active_incidents,
        compliance_score=compliance_score,
        trend_data=trend_data
    )


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get dashboard statistics"""
    # Vulnerability stats
    total_vulnerabilities = db.query(Vulnerability).count()
    critical_vulnerabilities = db.query(Vulnerability).filter(
        Vulnerability.severity == Severity.CRITICAL
    ).count()
    
    # Incident stats
    open_incidents = db.query(Incident).filter(
        Incident.status != IncidentStatus.RESOLVED
    ).count()
    critical_incidents = db.query(Incident).filter(
        Incident.severity == IncidentSeverity.CRITICAL
    ).count()
    
    # Compliance stats
    compliance_frameworks = db.query(ComplianceFramework).count()
    compliant_frameworks = db.query(ComplianceFramework).filter(
        ComplianceFramework.overall_score >= 80.0
    ).count()
    
    # Security score
    latest_score = db.query(SecurityMetric).filter(
        SecurityMetric.metric_type == MetricType.SECURITY_SCORE
    ).order_by(SecurityMetric.recorded_at.desc()).first()
    security_score = latest_score.value if latest_score else 75.0
    
    # Compliance score
    latest_compliance = db.query(SecurityMetric).filter(
        SecurityMetric.metric_type == MetricType.COMPLIANCE_SCORE
    ).order_by(SecurityMetric.recorded_at.desc()).first()
    compliance_score = latest_compliance.value if latest_compliance else 0.0
    
    return DashboardStatsResponse(
        total_vulnerabilities=total_vulnerabilities,
        critical_vulnerabilities=critical_vulnerabilities,
        open_incidents=open_incidents,
        critical_incidents=critical_incidents,
        compliance_frameworks=compliance_frameworks,
        compliant_frameworks=compliant_frameworks,
        security_score=security_score,
        compliance_score=compliance_score
    )


