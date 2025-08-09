# Aluminum

A Railway-like Platform as a Service for deploying AI Agents and MCP (Model Control Protocol) servers with built-in observability.

## 🚀 Features

### Core Workflow
1. **Login** - Simple authentication system
2. **Create Project** - Initialize projects for your AI agents
3. **Create Service** - Choose from:
   - MCP Server (TypeScript/Python/Node.js)
   - Bundle MCP (Multiple MCP servers)
   - AI Agent (LangChain/LangGraph/CrewAI)
   - Secrets Manager
4. **AI Configuration Chat** - Use AI to configure your services
5. **BYOC Support** - Bring Your Own Code or use generated templates
6. **Bundle Selection** - Package services for deployment
7. **Deploy** - One-click deployment to GCP/AWS
8. **Endpoints** - Generated API endpoints with keys
9. **Observability** - Real-time monitoring with Laminar integration

### Technology Stack
- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Node.js, Express, JWT Authentication
- **Database**: SQLite (development), PostgreSQL (production)
- **Deployment**: Docker, GCP Cloud Run, AWS Lambda
- **Observability**: Laminar, Prometheus, Grafana
- **AI Integration**: OpenAI API for configuration generation
