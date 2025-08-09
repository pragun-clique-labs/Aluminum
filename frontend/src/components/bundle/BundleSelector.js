import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  Server, 
  ArrowRight, 
  Check,
  Settings,
  Zap,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const BundleSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [bundleConfig, setBundleConfig] = useState({
    mcpServers: [],
    scaling: 'auto',
    environment: 'production'
  });

  const bundleOptions = [
    {
      id: 'single-service',
      name: 'Single Service',
      description: 'Deploy your configured service as a standalone application',
      icon: Server,
      color: 'bg-blue-100 text-blue-600',
      features: ['Single container', 'Fast deployment', 'Simple monitoring'],
      pricing: 'Free tier available'
    },
    {
      id: 'mcp-bundle',
      name: 'MCP Server Bundle',
      description: 'Bundle multiple MCP servers together for complex workflows',
      icon: Package,
      color: 'bg-purple-100 text-purple-600',
      features: ['Multiple MCP servers', 'Service mesh', 'Advanced routing'],
      pricing: 'Pay per service'
    },
    {
      id: 'ai-agent-stack',
      name: 'AI Agent Stack',
      description: 'Full stack with agent, tools, and observability',
      icon: Zap,
      color: 'bg-green-100 text-green-600',
      features: ['Agent + tools', 'Vector database', 'Full observability'],
      pricing: 'Premium features'
    }
  ];

  const availableMCPServers = [
    { id: 'weather', name: 'Weather API', description: 'Get weather information' },
    { id: 'search', name: 'Web Search', description: 'Search the web for information' },
    { id: 'calculator', name: 'Calculator', description: 'Perform mathematical calculations' },
    { id: 'files', name: 'File Operations', description: 'Read and write files' }
  ];

  const handleBundleSelect = (bundle) => {
    setSelectedBundle(bundle);
    if (bundle.id === 'single-service') {
      setBundleConfig({
        ...bundleConfig,
        mcpServers: []
      });
    }
  };

  const toggleMCPServer = (serverId) => {
    setBundleConfig(prev => ({
      ...prev,
      mcpServers: prev.mcpServers.includes(serverId)
        ? prev.mcpServers.filter(id => id !== serverId)
        : [...prev.mcpServers, serverId]
    }));
  };

  const handleContinueToDeploy = () => {
    if (!selectedBundle) {
      toast.error('Please select a bundle type');
      return;
    }

    const deployConfig = {
      ...location.state,
      bundle: selectedBundle,
      bundleConfig: bundleConfig
    };

    toast.success('Bundle configured successfully!');
    // navigate('/deploy', { state: deployConfig }); // Deploy temporarily disabled
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-medium text-card-foreground">Bundle Selection</h1>
        <p className="mt-2 text-sm text-card-foreground">
          Choose how to package and deploy your service
        </p>
      </div>

      {/* Bundle Options */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-card-foreground mb-4">What is bundle for?</h2>
        <p className="text-sm text-card-foreground mb-6">
          Bundles determine how your service is packaged, deployed, and scaled. Choose based on your complexity needs.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {bundleOptions.map((bundle) => {
            const Icon = bundle.icon;
            const isSelected = selectedBundle?.id === bundle.id;
            
            return (
              <div
                key={bundle.id}
                className={`relative cursor-pointer rounded-lg border p-6 focus:outline-none transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary shadow-md'
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                }`}
                onClick={() => handleBundleSelect(bundle)}
              >
                <div className="text-center">
                  <div className={`mx-auto w-12 h-12 rounded-lg ${bundle.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-card-foreground mb-2">
                    {bundle.name}
                  </h3>
                  <p className="text-sm text-card-foreground mb-4">
                    {bundle.description}
                  </p>
                  
                  <div className="space-y-2">
                    {bundle.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-card-foreground">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-xs text-card-foreground">
                    {bundle.pricing}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MCP Server Selection */}
      {selectedBundle && (selectedBundle.id === 'mcp-bundle' || selectedBundle.id === 'ai-agent-stack') && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-card-foreground mb-4">Select MCP Server Configuration</h2>
          <p className="text-sm text-card-foreground mb-4">
            Choose which MCP servers to include in your bundle
          </p>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {availableMCPServers.map((server) => {
              const isSelected = bundleConfig.mcpServers.includes(server.id);
              
              return (
                <div
                  key={server.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? 'border-primary-500 bg-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => toggleMCPServer(server.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary-500 bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-card-foreground">
                        {server.name}
                      </h3>
                      <p className="text-xs text-card-foreground">
                        {server.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bundle Configuration */}
      {selectedBundle && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-card-foreground mb-4">Bundle Configuration</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Scaling Strategy
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={bundleConfig.scaling}
                onChange={(e) => setBundleConfig({...bundleConfig, scaling: e.target.value})}
              >
                <option value="auto">Auto Scaling</option>
                <option value="fixed">Fixed Instances</option>
                <option value="manual">Manual Scaling</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Environment
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={bundleConfig.environment}
                onChange={(e) => setBundleConfig({...bundleConfig, environment: e.target.value})}
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Continue to Deploy */}
      {selectedBundle && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Ready for Deployment</h3>
                <p className="text-sm text-green-700">
                  Bundle configured with {selectedBundle.name}
                  {bundleConfig.mcpServers.length > 0 && ` and ${bundleConfig.mcpServers.length} MCP servers`}
                </p>
              </div>
            </div>
            <button
              onClick={handleContinueToDeploy}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Deploy Bundle
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleSelector;
