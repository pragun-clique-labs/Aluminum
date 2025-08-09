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

## 🏗️ Project Structure

```
aluminum-paas/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilities
├── backend/                 # Express API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Backend utilities
├── observability/          # Monitoring configuration
│   ├── prometheus/
│   └── grafana/
└── docker-compose.yml      # Local development setup
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aluminum-paas
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Option 1: Using npm scripts
   npm run dev

   # Option 2: Using Docker Compose
   docker-compose up --build
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Grafana: http://localhost:3001 (admin/admin123)
   - Prometheus: http://localhost:9090

### Development Commands

```bash
# Install dependencies for all services
npm run install:all

# Start frontend and backend concurrently
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Usage

### Creating Your First Agent

1. **Login** with any email/password (demo mode)
2. **Create a new project** with your preferred settings
3. **Create a service** and choose your type:
   - **MCP Server**: For tool integrations
   - **AI Agent**: For intelligent conversations
   - **Bundle**: For complex multi-service setups
4. **Use AI Chat** to configure your service automatically
5. **Select a bundle** type for deployment
6. **Deploy** to your preferred cloud provider
7. **Monitor** your service through the observability dashboard

### API Usage

Once deployed, your services will have REST endpoints:

```bash
# Chat with your AI agent
curl -X POST https://your-service.run.app/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"message": "Hello, AI!"}'

# Health check
curl https://your-service.run.app/health

# Service status
curl https://your-service.run.app/status
```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```bash
# Backend
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key

# OpenAI (for AI configuration chat)
OPENAI_API_KEY=your-openai-key

# Cloud Providers
GCP_PROJECT_ID=your-gcp-project
AWS_ACCESS_KEY_ID=your-aws-key

# Observability
LAMINAR_API_KEY=your-laminar-key
```

### Cloud Provider Setup

#### Google Cloud Platform
1. Create a GCP project
2. Enable Cloud Run API
3. Create a service account with Cloud Run permissions
4. Download the service account key JSON file
5. Set `GOOGLE_APPLICATION_CREDENTIALS` to the file path

#### Amazon Web Services
1. Create an IAM user with Lambda and ECS permissions
2. Generate access keys
3. Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

## 📊 Observability

### Laminar Integration

Aluminum PaaS integrates with [Laminar](https://lmnr.ai) for AI-specific observability:

- **LLM Tracing**: Automatic tracing of OpenAI, Anthropic calls
- **Token Usage**: Track token consumption and costs
- **Performance Monitoring**: Latency and error tracking
- **Real-time Dashboards**: Live metrics and alerts

### Metrics & Monitoring

- **Application Metrics**: Request rates, latency, errors
- **Infrastructure Metrics**: CPU, memory, scaling events
- **AI Metrics**: Token usage, model performance, costs
- **Custom Dashboards**: Grafana dashboards for visualization

## 🚦 Deployment

### Local Development
```bash
docker-compose up --build
```

### Production Deployment

#### Using Docker
```bash
# Build images
docker build -t aluminum-frontend ./frontend
docker build -t aluminum-backend ./backend

# Deploy to your preferred container platform
```

#### Using Cloud Providers
The platform supports one-click deployment to:
- **Google Cloud Run**: Serverless containers
- **AWS Lambda + ECS**: Serverless functions and containers
- **Railway**: Simple PaaS deployment
- **Vercel**: Frontend deployment

## 🧪 Hackathon Mode

This project is optimized for hackathons with:

- **6-hour build time**: All features can be implemented in 6 hours
- **Demo-ready**: Pre-configured with mock data and examples
- **Minimal setup**: Single command to get running
- **Extensible**: Easy to add new features and integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Railway](https://railway.app) for PaaS inspiration
- [Laminar](https://lmnr.ai) for AI observability
- [LangChain](https://langchain.com) for AI framework integration
- [Model Context Protocol](https://modelcontextprotocol.io) for MCP standards

## 📞 Support

- 📧 Email: support@aluminum-paas.dev
- 💬 Discord: [Join our community](https://discord.gg/aluminum-paas)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/aluminum-paas/issues)
- 📖 Docs: [Documentation](https://docs.aluminum-paas.dev)

---

Built with ❤️ for the AI community
