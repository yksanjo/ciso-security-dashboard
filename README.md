# CISO Security Risk Dashboard

A comprehensive security risk management platform designed for Chief Information Security Officers (CISOs) to monitor, analyze, and report on organizational security posture.

## Features

### 1. Security Posture Dashboard
- Real-time security score calculation
- Risk heat maps and visualizations
- Trend analysis over time
- Critical alert notifications

### 2. Compliance Management
- Multi-framework support (ISO 27001, NIST, SOC 2, GDPR)
- Compliance status tracking
- Gap analysis and remediation tracking
- Audit trail

### 3. Vulnerability Management
- Vulnerability aggregation from multiple sources
- Risk-based prioritization (CVSS scoring)
- Remediation tracking
- SLA monitoring

### 4. Incident Management
- Incident tracking and categorization
- Response time metrics
- Post-incident analysis
- Lessons learned repository

### 5. Executive Reporting
- Automated report generation
- Customizable dashboards
- Export capabilities (PDF, Excel)
- Scheduled report delivery

## Technology Stack

- **Frontend**: React + TypeScript, Recharts, Tailwind CSS
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication
- **Deployment**: Docker containers

## Project Structure

```
ciso-security-dashboard/
├── backend/              # FastAPI backend
│   ├── src/
│   │   ├── api/         # API routes
│   │   ├── models/      # Database models
│   │   ├── core/        # Core configuration
│   │   └── main.py      # Application entry point
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API clients
│   │   └── contexts/    # React contexts
│   └── package.json
├── database/            # Database migrations
└── docs/               # Documentation
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Docker and Docker Compose (optional)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Run database migrations:
```bash
# Create database tables
python -c "from src.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

6. Start the backend server:
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Docker Setup (Alternative)

1. Start all services with Docker Compose:
```bash
docker-compose up -d
```

2. Access the application:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user info

### Dashboard
- `GET /api/dashboard/posture` - Get security posture
- `GET /api/dashboard/stats` - Get dashboard statistics

### Vulnerabilities
- `GET /api/vulnerabilities` - List vulnerabilities
- `GET /api/vulnerabilities/{id}` - Get vulnerability details
- `POST /api/vulnerabilities` - Create vulnerability
- `PATCH /api/vulnerabilities/{id}` - Update vulnerability
- `DELETE /api/vulnerabilities/{id}` - Delete vulnerability

### Incidents
- `GET /api/incidents` - List incidents
- `GET /api/incidents/{id}` - Get incident details
- `POST /api/incidents` - Create incident
- `PATCH /api/incidents/{id}` - Update incident
- `DELETE /api/incidents/{id}` - Delete incident

### Compliance
- `GET /api/compliance/frameworks` - List compliance frameworks
- `GET /api/compliance/frameworks/{id}` - Get framework details
- `GET /api/compliance/frameworks/{id}/controls` - Get framework controls
- `PATCH /api/compliance/controls/{id}` - Update control status
- `POST /api/compliance/assessments` - Create compliance assessment

## Default Credentials

After first setup, you'll need to register a user through the API or create one manually in the database.

## Development

### Backend Development
- Run tests: `pytest`
- Format code: `black src/`
- Lint code: `flake8 src/`

### Frontend Development
- Run tests: `npm test`
- Build for production: `npm run build`
- Lint code: `npm run lint`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Security

For security concerns, please email security@example.com or create a private security advisory on GitHub.

## Support

For support, please open an issue on GitHub or contact the development team.


