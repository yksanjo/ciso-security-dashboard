from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class IncidentType(str, enum.Enum):
    DATA_BREACH = "data_breach"
    MALWARE = "malware"
    PHISHING = "phishing"
    DDoS = "ddos"
    UNAUTHORIZED_ACCESS = "unauthorized_access"
    INSIDER_THREAT = "insider_threat"
    OTHER = "other"


class IncidentStatus(str, enum.Enum):
    DETECTED = "detected"
    INVESTIGATING = "investigating"
    CONTAINED = "contained"
    RESOLVED = "resolved"
    CLOSED = "closed"


class IncidentSeverity(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    incident_type = Column(Enum(IncidentType), nullable=False, index=True)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.DETECTED, index=True)
    severity = Column(Enum(IncidentSeverity), nullable=False, index=True)
    detected_at = Column(DateTime, default=datetime.utcnow, index=True)
    contained_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    response_time_minutes = Column(Integer, nullable=True)
    resolution_time_minutes = Column(Integer, nullable=True)
    affected_assets = Column(Text, nullable=True)
    root_cause = Column(Text, nullable=True)
    lessons_learned = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


