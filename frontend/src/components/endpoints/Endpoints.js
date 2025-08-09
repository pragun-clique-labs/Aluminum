import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Globe, 
  Copy, 
  ExternalLink, 
  Play, 
  Code,
  Key,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Endpoints = () => {
  const location = useLocation();
  const [endpoints, setEndpoints] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    // Generate endpoints based on deployment configuration
    const baseUrl = location.state?.deployment?.url || 'https://my-service-abc123.run.app';
    const aiConfig = location.state?.aiConfig;
    
    const generatedEndpoints = [
      {
        id: 1,
        method: 'POST',
        path: '/chat',
        url: `${baseUrl}/chat`,
        description: 'Send a message to the AI agent',
        status: 'active',
        lastUsed: '2 minutes ago',
        requestCount: 0
      },
      {
        id: 2,
        method: 'GET',
        path: '/health',
        url: `${baseUrl}/health`,
        description: 'Check service health status',
        status: 'active',
        lastUsed: '30 seconds ago',
        requestCount: 0
      },
      {
        id: 3,
        method: 'GET',
        path: '/status',
        url: `${baseUrl}/status`,
        description: 'Get detailed service status and metrics',
        status: 'active',
        lastUsed: '1 minute ago',
        requestCount: 0
      }
    ];

    // Add endpoints based on AI configuration
    if (aiConfig?.endpoints) {
      aiConfig.endpoints.forEach((endpoint, index) => {
        if (!generatedEndpoints.find(e => e.path === endpoint)) {
          generatedEndpoints.push({
            id: generatedEndpoints.length + index + 1,
            method: 'POST',
            path: endpoint,
            url: `${baseUrl}${endpoint}`,
            description: `AI agent endpoint: ${endpoint}`,
            status: 'active',
            lastUsed: 'Never',
            requestCount: 0
          });
        }
      });
    }

    setEndpoints(generatedEndpoints);

    // Generate API keys
    setApiKeys([
      {
        id: 1,
        name: 'Production Key',
        key: 'al_' + Math.random().toString(36).substr(2, 32),
        created: '2024-01-15',
        lastUsed: '2 minutes ago',
        status: 'active'
      },
      {
        id: 2,
        name: 'Development Key',
        key: 'al_dev_' + Math.random().toString(36).substr(2, 28),
        created: '2024-01-15',
        lastUsed: 'Never',
        status: 'active'
      }
    ]);
  }, [location.state]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET':
        return 'bg-secondary text-secondary-foreground';
      case 'POST':
        return 'bg-secondary text-secondary-foreground';
      case 'PUT':
        return 'bg-secondary text-secondary-foreground';
      case 'DELETE':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'active' 
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Globe className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-medium text-card-foreground">API Endpoints</h1>
        <p className="mt-2 text-sm text-card-foreground">
          Your deployed service endpoints and API keys
        </p>
      </div>

      {/* Service Overview */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-primary">Service Deployed Successfully! 🎉</h2>
            <p className="text-sm text-primary mt-1">
              Your {location.state?.service?.name || 'service'} is now live and ready to use
            </p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-primary">
              <span>Base URL: {location.state?.deployment?.url || 'https://my-service-abc123.run.app'}</span>
              <button
                onClick={() => copyToClipboard(location.state?.deployment?.url || 'https://my-service-abc123.run.app')}
                className="flex items-center hover:text-primary"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-medium text-primary">{endpoints.length}</div>
            <div className="text-sm text-primary">Endpoints</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Endpoints */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-card-foreground">API Endpoints</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {endpoints.map((endpoint) => (
              <div key={endpoint.id} className="p-6 hover:bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-card-foreground">{endpoint.path}</code>
                      {getStatusIcon(endpoint.status)}
                    </div>
                    <p className="text-sm text-card-foreground mb-3">{endpoint.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-card-foreground">
                      <span>Last used: {endpoint.lastUsed}</span>
                      <span>Requests: {endpoint.requestCount}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(endpoint.url)}
                      className="p-2 text-card-foreground hover:text-card-foreground"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={endpoint.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-card-foreground hover:text-card-foreground"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-card-foreground">API Keys</h2>
              <button className="text-sm text-primary hover:text-primary">
                Generate New Key
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-6 hover:bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Key className="h-4 w-4 text-card-foreground" />
                      <span className="text-sm font-medium text-card-foreground">{apiKey.name}</span>
                      {getStatusIcon(apiKey.status)}
                    </div>
                    <div className="font-mono text-sm text-card-foreground bg-card p-2 rounded mb-3">
                      {apiKey.key.substring(0, 16)}...
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-card-foreground">
                      <span>Created: {apiKey.created}</span>
                      <span>Last used: {apiKey.lastUsed}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-2 text-card-foreground hover:text-card-foreground"
                      title="Copy API Key"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Example Usage */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-card-foreground mb-4 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Example Usage
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-2">cURL Example</h3>
            <div className="bg-card rounded-lg p-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
{`curl -X POST ${endpoints[0]?.url || 'https://my-service-abc123.run.app/chat'} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKeys[0]?.key || 'your-api-key'}" \\
  -d '{
    "message": "Hello, AI agent!",
    "stream": false
  }'`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-2">JavaScript Example</h3>
            <div className="bg-card rounded-lg p-4 overflow-x-auto">
              <code className="text-blue-400 text-sm">
{`const response = await fetch('${endpoints[0]?.url || 'https://my-service-abc123.run.app/chat'}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKeys[0]?.key || 'your-api-key'}'
  },
  body: JSON.stringify({
    message: 'Hello, AI agent!',
    stream: false
  })
});

const data = await response.json();
console.log(data);`}
              </code>
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-card-foreground bg-white hover:bg-card">
            <Play className="h-4 w-4 mr-2" />
            Test Endpoint
          </button>
          <button 
            onClick={() => copyToClipboard(endpoints[0]?.url || '')}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-card-foreground bg-white hover:bg-card"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Example
          </button>
        </div>
      </div>
    </div>
  );
};

export default Endpoints;
