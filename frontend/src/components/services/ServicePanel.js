import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Activity, 
  Variable, 
  Gauge,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  Link,
  Shield,
  Database,
  Clock,
  AlertCircle,
  Rocket,
  CheckCircle
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import toast from 'react-hot-toast';

const ServicePanel = ({ service, onClose, onServiceUpdate }) => {
  const [activeTab, setActiveTab] = useState('deployments');
  const [serviceData, setServiceData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  
  useEffect(() => {
    if (service?.id) {
      loadServiceData();
    } else {
      // For new services without ID, use default config
      setServiceData(getDefaultServiceConfig(service.serviceType));
      setMetrics(apiClient.getMockServiceMetrics(service.serviceType));
      setLoading(false);
    }
  }, [service]);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getService(service.id);
      setServiceData(data.service);
      setMetrics(apiClient.getMockServiceMetrics(service.serviceType));
    } catch (error) {
      console.error('Failed to load service data:', error);
      // Fallback to default config
      setServiceData(getDefaultServiceConfig(service.serviceType));
      setMetrics(apiClient.getMockServiceMetrics(service.serviceType));
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update service status
      const updatedService = { ...service, status: 'deployed' };
      
      // Save to localStorage for persistence
      const savedProjects = JSON.parse(localStorage.getItem('aluminumProjects') || '[]');
      const projectName = window.location.pathname.split('/')[2];
      const projectIndex = savedProjects.findIndex(p => p.name === projectName);
      
      if (projectIndex !== -1) {
        const nodeIndex = savedProjects[projectIndex].nodes.findIndex(n => n.data.id === service.id);
        if (nodeIndex !== -1) {
          savedProjects[projectIndex].nodes[nodeIndex].data.status = 'deployed';
          localStorage.setItem('aluminumProjects', JSON.stringify(savedProjects));
        }
      }
      
      toast.success(`${service.label} deployed successfully!`);
      if (onServiceUpdate) {
        onServiceUpdate(updatedService);
      }
    } catch (error) {
      toast.error('Failed to deploy service');
    } finally {
      setDeploying(false);
    }
  };

  if (!service) return null;

  // LangGraph and CrewAI specific configurations
  const getDefaultServiceConfig = (serviceType) => {
    switch (serviceType) {
      case 'mcp-server':
        return {
          variables: [
            { key: 'MCP_HOST', value: '0.0.0.0', description: 'Host address for MCP server' },
            { key: 'MCP_PORT', value: '8080', description: 'Port for MCP server' },
            { key: 'MCP_AUTH_TOKEN', value: '••••••••', description: 'Authentication token', sensitive: true },
            { key: 'MCP_MAX_CONNECTIONS', value: '100', description: 'Maximum concurrent connections' },
            { key: 'MCP_TIMEOUT', value: '30s', description: 'Request timeout' }
          ],
          settings: {
            framework: 'TypeScript',
            template: 'Basic Chat',
            healthcheck: '/health',
            restartPolicy: 'on-failure',
            maxRetries: 3,
            resources: { cpu: '0.5', memory: '512Mi' }
          }
        };
      
      case 'bundle-mcp':
        return {
          variables: [
            { key: 'BUNDLE_NAME', value: 'production-bundle', description: 'Bundle identifier' },
            { key: 'BUNDLE_VERSION', value: '1.0.0', description: 'Bundle version' },
            { key: 'BUNDLE_DEPENDENCIES', value: 'mcp-server', description: 'Required services' },
            { key: 'BUNDLE_REGISTRY', value: 'registry.aluminum.io', description: 'Bundle registry URL' }
          ],
          settings: {
            framework: 'Docker Compose',
            template: 'Multi-Tool Agent',
            autoDeploy: true,
            rollbackOnFailure: true,
            deploymentStrategy: 'rolling',
            resources: { cpu: '0.25', memory: '256Mi' }
          }
        };
      
      case 'ai-agent':
        return {
          variables: [
            { key: 'OPENAI_API_KEY', value: '••••••••', description: 'OpenAI API key', sensitive: true },
            { key: 'LANGCHAIN_API_KEY', value: '••••••••', description: 'LangChain API key', sensitive: true },
            { key: 'LANGGRAPH_CONFIG', value: 'multi-agent', description: 'LangGraph workflow configuration' },
            { key: 'CREWAI_TEAM_SIZE', value: '3', description: 'Number of agents in CrewAI team' },
            { key: 'CREWAI_WORKFLOW', value: 'sequential', description: 'CrewAI execution workflow' },
            { key: 'AGENT_MODEL', value: 'gpt-4o', description: 'AI model for LangGraph/CrewAI agents' },
            { key: 'AGENT_TEMPERATURE', value: '0.7', description: 'Model temperature' },
            { key: 'VECTOR_DB_URL', value: 'postgresql://localhost:5432', description: 'Vector database URL' }
          ],
          settings: {
            framework: 'LangGraph',
            template: 'Research Agent',
            enableTracing: true,
            logLevel: 'info',
            cacheEnabled: true,
            agentType: 'multi-agent',
            resources: { cpu: '1', memory: '1Gi' }
          }
        };
      
      case 'secrets-manager':
        return {
          variables: [
            { key: 'VAULT_URL', value: 'https://vault.aluminum.io', description: 'HashiCorp Vault URL' },
            { key: 'VAULT_TOKEN', value: '••••••••', description: 'Vault authentication token', sensitive: true },
            { key: 'ENCRYPTION_KEY', value: '••••••••', description: 'Data encryption key', sensitive: true },
            { key: 'BACKUP_SCHEDULE', value: '0 2 * * *', description: 'Backup cron schedule' },
            { key: 'ACCESS_LOG_LEVEL', value: 'info', description: 'Access logging level' },
            { key: 'ROTATION_INTERVAL', value: '30d', description: 'Secret rotation interval' }
          ],
          settings: {
            framework: 'HashiCorp Vault',
            template: 'API Keys Store',
            autoRotation: true,
            auditLogging: true,
            encryption: 'AES-256',
            resources: { cpu: '0.25', memory: '256Mi' }
          }
        };
      
      default:
        return { variables: [], settings: {} };
    }
  };

  const config = serviceData || getDefaultServiceConfig(service.serviceType);

  const tabs = [
    { id: 'deployments', label: 'Deployments', icon: Activity },
    { id: 'variables', label: 'Variables', icon: Variable },
    { id: 'metrics', label: 'Metrics', icon: Gauge },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDeployments = () => (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Active deployment</span>
          </div>
          <span className="text-xs text-muted-foreground">v1.0.0</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="text-green-500">Running</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Started</span>
            <span>2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Region</span>
            <span>us-west1</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
          <button className="flex items-center space-x-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs hover:bg-primary/90">
            <RefreshCw className="h-3 w-3" />
            <span>Restart</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80">
            <Pause className="h-3 w-3" />
            <span>Stop</span>
          </button>
        </div>
      </div>

      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No previous deployments</p>
      </div>
    </div>
  );

  const renderVariables = () => (
    <div className="space-y-4">
      {config.variables?.map((variable, index) => (
        <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <code className="text-sm font-mono text-primary">{variable.key}</code>
                {variable.sensitive && (
                  <Shield className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono text-muted-foreground">{variable.value}</code>
              {variable.sensitive && (
                <button className="text-xs text-primary hover:text-primary/80">
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      
      <button className="w-full py-2 border-2 border-dashed border-muted-foreground/30 rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
        + Add Variable
      </button>
    </div>
  );

  const renderMetrics = () => {
    if (!metrics) return <div className="text-center py-8 text-muted-foreground">Loading metrics...</div>;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">CPU Usage</span>
            </div>
            <p className="text-2xl font-medium">{metrics.cpu.current}%</p>
            <p className="text-xs text-muted-foreground">of {metrics.cpu.limit}% limit</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Memory</span>
            </div>
            <p className="text-2xl font-medium">{metrics.memory.current} MB</p>
            <p className="text-xs text-muted-foreground">of {metrics.memory.limit} MB</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Response Time</span>
          </div>
          <div className="h-32 flex items-end justify-between space-x-1">
            {metrics.responseTime.data.map((value, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/30 rounded-t"
                style={{ height: `${(value / Math.max(...metrics.responseTime.data)) * 100}%` }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Average: {metrics.responseTime.avg}ms</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Total Requests</p>
            <p className="text-lg font-medium">{metrics.requests?.total || 0}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="text-lg font-medium text-green-600">
              {metrics.requests ? Math.round((metrics.requests.success / metrics.requests.total) * 100) : 0}%
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Errors</p>
            <p className="text-lg font-medium text-red-600">{metrics.requests?.errors || 0}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Resource Limits</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">CPU</span>
            <input
              type="text"
              defaultValue={config.settings?.resources?.cpu || '0.5'}
              className="w-20 px-2 py-1 text-sm bg-muted rounded border border-input"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Memory</span>
            <input
              type="text"
              defaultValue={config.settings?.resources?.memory || '512Mi'}
              className="w-20 px-2 py-1 text-sm bg-muted rounded border border-input"
            />
          </div>
        </div>
      </div>

      {config.settings?.framework && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium">Framework Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Framework</span>
              <span className="text-sm">{config.settings.framework}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Template</span>
              <span className="text-sm">{config.settings.template}</span>
            </div>
          </div>
        </div>
      )}

      {service.serviceType === 'ai-agent' && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium">LangGraph & CrewAI Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked={config.settings?.enableTracing} className="rounded" />
              <span className="text-sm">Enable LangSmith tracing</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked={config.settings?.cacheEnabled} className="rounded" />
              <span className="text-sm">Cache agent responses</span>
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Agent Type</span>
              <select className="px-2 py-1 text-sm bg-muted rounded border border-input">
                <option value="single">Single Agent</option>
                <option value="multi-agent" selected={config.settings?.agentType === 'multi-agent'}>Multi-Agent (CrewAI)</option>
                <option value="graph">Graph Workflow (LangGraph)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border space-y-3">
        {/* Deploy Button - Like Bedrock/Vertex AI */}
        {service.status !== 'deployed' ? (
          <button 
            onClick={() => handleDeploy()}
            disabled={deploying}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deploying ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                <span>Deploy Service</span>
              </>
            )}
          </button>
        ) : (
          <div className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Deployed</span>
          </div>
        )}
        
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors text-sm">
          <Trash2 className="h-4 w-4" />
          <span>Delete service</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'deployments':
        return renderDeployments();
      case 'variables':
        return renderVariables();
      case 'metrics':
        return renderMetrics();
      case 'settings':
        return renderSettings();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 w-[480px] bg-card border-l border-border shadow-lg z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-card border-l border-border shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
            <service.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-medium">{service.label}</h2>
            <p className="text-xs text-muted-foreground">{service.type}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default ServicePanel;
