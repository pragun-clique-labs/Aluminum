import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Rocket, 
  Cloud, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const Deploy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deployment, setDeployment] = useState({
    status: 'pending',
    progress: 0,
    logs: [],
    url: null
  });
  const [selectedCloud, setSelectedCloud] = useState('gcp');
  const [isDeploying, setIsDeploying] = useState(false);

  const cloudProviders = [
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      service: 'Cloud Run',
      icon: '🔵',
      description: 'Serverless containers with auto-scaling'
    },
    {
      id: 'aws',
      name: 'Amazon Web Services',
      service: 'Lambda + ECS',
      icon: '🟠',
      description: 'Serverless functions and container service'
    }
  ];

  const deploymentSteps = [
    { id: 1, name: 'Building container', status: 'pending' },
    { id: 2, name: 'Pushing to registry', status: 'pending' },
    { id: 3, name: 'Creating cloud resources', status: 'pending' },
    { id: 4, name: 'Deploying service', status: 'pending' },
    { id: 5, name: 'Setting up monitoring', status: 'pending' },
    { id: 6, name: 'Generating endpoints', status: 'pending' }
  ];

  const [steps, setSteps] = useState(deploymentSteps);

  const simulateDeployment = async () => {
    setIsDeploying(true);
    setDeployment({ ...deployment, status: 'deploying', logs: [] });

    const totalSteps = steps.length;
    
    for (let i = 0; i < totalSteps; i++) {
      // Update step status
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'running' } : step
      ));

      // Add log entry
      const logEntry = {
        timestamp: new Date().toLocaleTimeString(),
        message: `${steps[i].name}...`,
        type: 'info'
      };
      setDeployment(prev => ({
        ...prev,
        logs: [...prev.logs, logEntry],
        progress: ((i + 1) / totalSteps) * 100
      }));

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Complete step
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' } : step
      ));
    }

    // Deployment complete
    const finalUrl = `https://${location.state?.service?.name || 'my-service'}-${Math.random().toString(36).substr(2, 9)}.run.app`;
    
    setDeployment(prev => ({
      ...prev,
      status: 'success',
      url: finalUrl,
      logs: [...prev.logs, {
        timestamp: new Date().toLocaleTimeString(),
        message: `Deployment successful! Service available at ${finalUrl}`,
        type: 'success'
      }]
    }));

    setIsDeploying(false);
    toast.success('Deployment completed successfully!');
  };

  const handleDeploy = () => {
    simulateDeployment();
  };

  const handleViewEndpoints = () => {
    navigate('/endpoints', { 
      state: { 
        ...location.state, 
        deployment: deployment,
        cloudProvider: selectedCloud
      } 
    });
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Rocket className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-medium text-card-foreground">Deploy to Cloud</h1>
        <p className="mt-2 text-sm text-card-foreground">
          Deploy your {location.state?.service?.name || 'service'} to production
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Configuration */}
        <div className="space-y-6">
          {/* Cloud Provider Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-card-foreground mb-4">Cloud Provider</h2>
            <div className="space-y-3">
              {cloudProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    selectedCloud === provider.id
                      ? 'border-primary-500 bg-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedCloud(provider.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-card-foreground">
                        {provider.name}
                      </h3>
                      <p className="text-xs text-card-foreground">
                        {provider.service} • {provider.description}
                      </p>
                    </div>
                    {selectedCloud === provider.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-card-foreground mb-4">Deployment Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-card-foreground">Service Type:</span>
                <span className="font-medium">{location.state?.service?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-card-foreground">Framework:</span>
                <span className="font-medium">{location.state?.config?.framework || 'Default'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-card-foreground">Bundle:</span>
                <span className="font-medium">{location.state?.bundle?.name || 'Single Service'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-card-foreground">Cloud:</span>
                <span className="font-medium">{cloudProviders.find(p => p.id === selectedCloud)?.name}</span>
              </div>
              {location.state?.bundleConfig?.mcpServers?.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-card-foreground">MCP Servers:</span>
                  <span className="font-medium">{location.state.bundleConfig.mcpServers.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Deploy Button */}
          {!isDeploying && deployment.status === 'pending' && (
            <button
              onClick={handleDeploy}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Deploy to {cloudProviders.find(p => p.id === selectedCloud)?.name}
            </button>
          )}

          {/* Success Actions */}
          {deployment.status === 'success' && (
            <div className="space-y-3">
              <button
                onClick={handleViewEndpoints}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                View Endpoints
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              {deployment.url && (
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-card-foreground bg-white hover:bg-card"
                >
                  Open Service
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Deployment Progress */}
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-card-foreground mb-4">Deployment Progress</h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-card-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(deployment.progress)}%</span>
              </div>
              <div className="w-full bg-card rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${deployment.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-3">
                  {getStepIcon(step.status)}
                  <span className={`text-sm ${
                    step.status === 'completed' ? 'text-green-700' :
                    step.status === 'running' ? 'text-blue-700' :
                    'text-card-foreground'
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Logs */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-card-foreground mb-4">Deployment Logs</h2>
            <div className="bg-card rounded-lg p-4 h-64 overflow-y-auto">
              {deployment.logs.length === 0 ? (
                <p className="text-card-foreground text-sm">No logs yet...</p>
              ) : (
                <div className="space-y-1">
                  {deployment.logs.map((log, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-card-foreground">{log.timestamp}</span>
                      <span className={`ml-2 ${
                        log.type === 'success' ? 'text-green-400' :
                        log.type === 'error' ? 'text-red-400' :
                        'text-card-foreground'
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deploy;
