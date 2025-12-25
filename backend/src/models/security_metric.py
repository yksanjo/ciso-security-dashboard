from sqlalchemy import Column, Integer, Float, String, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class MetricType(str, enum.Enum):
    SECURITY_SCORE = "security_score"
    RISK_LEVEL = "risk_level"
    THREAT_COUNT = "threat_count"
    INCIDENT_COUNT = "incident_count"
    VULNERABILITY_COUNT = "vulnerability_count"
    COMPLIANCE_SCORE = "compliance_score"


class SecurityMetric(Base):
    __tablename__ = "security_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_type = Column(Enum(MetricType), nullable=False, index=True)
    value = Column(Float, nullable=False)
    category = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


