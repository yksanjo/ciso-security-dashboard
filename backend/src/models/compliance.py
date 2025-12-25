from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class FrameworkType(str, enum.Enum):
    ISO_27001 = "iso_27001"
    NIST_CSF = "nist_csf"
    SOC_2 = "soc_2"
    GDPR = "gdpr"
    HIPAA = "hipaa"
    PCI_DSS = "pci_dss"


class ControlStatus(str, enum.Enum):
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    PARTIALLY_COMPLIANT = "partially_compliant"
    NOT_APPLICABLE = "not_applicable"
    NOT_ASSESSED = "not_assessed"


class ComplianceFramework(Base):
    __tablename__ = "compliance_frameworks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    framework_type = Column(Enum(FrameworkType), nullable=False, index=True)
    version = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    overall_score = Column(Float, default=0.0)
    last_assessed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    controls = relationship("ComplianceControl", back_populates="framework", cascade="all, delete-orphan")
    assessments = relationship("ComplianceAssessment", back_populates="framework")


class ComplianceControl(Base):
    __tablename__ = "compliance_controls"
    
    id = Column(Integer, primary_key=True, index=True)
    framework_id = Column(Integer, ForeignKey("compliance_frameworks.id"), nullable=False)
    control_id = Column(String, nullable=False)  # e.g., "A.5.1.1" for ISO 27001
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ControlStatus), default=ControlStatus.NOT_ASSESSED, index=True)
    evidence = Column(Text, nullable=True)
    remediation_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    framework = relationship("ComplianceFramework", back_populates="controls")


class ComplianceAssessment(Base):
    __tablename__ = "compliance_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    framework_id = Column(Integer, ForeignKey("compliance_frameworks.id"), nullable=False)
    assessed_at = Column(DateTime, default=datetime.utcnow, index=True)
    overall_score = Column(Float, nullable=False)
    compliant_controls = Column(Integer, default=0)
    non_compliant_controls = Column(Integer, default=0)
    total_controls = Column(Integer, default=0)
    assessor_name = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    framework = relationship("ComplianceFramework", back_populates="assessments")


