import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Server, 
  Package, 
  Bot, 
  Key, 
  ArrowRight,
  Code,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedService, setSelectedService] = useState(null);
  const [serviceConfig, setServiceConfig] = useState({
    name: '',
    framework: '',
    template: ''
  });

  // Service types from the diagram
  const serviceTypes = [
    {
      id: 'mcp-server',
      name: 'MCP Server',
      description: 'Model Control Protocol server for AI tool integrations',
      icon: Server,
      color: 'bg-accent text-accent-foreground',
      frameworks: ['TypeScript', 'Python', 'Node.js'],
      templates: ['Basic Chat', 'File Operations', 'Web Scraper', 'API Gateway']
    },
    {
      id: 'bundle-mcp',
      name: 'Bundle MCP',
      description: 'Bundle multiple MCP servers together',
      icon: Package,
      color: 'bg-accent text-accent-foreground',
      frameworks: ['Docker Compose', 'Kubernetes'],
      templates: ['Multi-Tool Agent', 'Microservices Bundle', 'API Gateway + Tools']
    },
    {
      id: 'ai-agent',
      name: 'AI Agent',
      description: 'Intelligent agent with LangChain/LangGraph/CrewAI',
      icon: Bot,
      color: 'bg-accent text-accent-foreground',
      frameworks: ['LangChain', 'LangGraph', 'CrewAI', 'AutoGen'],
      templates: ['Chat Assistant', 'Research Agent', 'Code Generator', 'Data Analyst']
    },
    {
      id: 'secrets-manager',
      name: 'Secrets Manager',
      description: 'Secure configuration and secrets management',
      icon: Key,
      color: 'bg-red-100 text-red-600',
      frameworks: ['Environment Variables', 'HashiCorp Vault', 'AWS Secrets'],
      templates: ['API Keys Store', 'Database Credentials', 'OAuth Tokens', 'Custom Secrets']
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setServiceConfig({
      name: '',
      framework: service.frameworks[0],
      template: service.templates[0]
    });
  };

  const handleContinue = () => {
    if (!selectedService || !serviceConfig.name) {
      toast.error('Please select a service and provide a name');
      return;
    }

    toast.success('Service configured! Moving to configuration chat...');
    navigate('/config', { 
      state: { 
        service: selectedService,
        config: serviceConfig,
        projectId: location.state?.projectId
      } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Settings className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-medium text-card-foreground">create service</h1>
        <p className="mt-2 text-sm font-normal text-card-foreground">
          choose the type of service you want to deploy
        </p>
      </div>

      {/* Service Selection */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-card-foreground mb-4">select service type</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {serviceTypes.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService?.id === service.id;
            
            return (
              <div
                key={service.id}
                className={`relative cursor-pointer rounded-lg border p-6 focus:outline-none transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary shadow-md'
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                }`}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${service.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-card-foreground">
                      {service.name}
                    </h3>
                    <p className="text-sm text-card-foreground mt-1">
                      {service.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {service.frameworks.slice(0, 3).map((framework) => (
                        <span
                          key={framework}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-card text-card-foreground"
                        >
                          {framework}
                        </span>
                      ))}
                      {service.frameworks.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-card text-card-foreground">
                          +{service.frameworks.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration */}
      {selectedService && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-card-foreground mb-4">Configure {selectedService.name}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground">
                Service Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={`my-${selectedService.id}`}
                value={serviceConfig.name}
                onChange={(e) => setServiceConfig({...serviceConfig, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Framework
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={serviceConfig.framework}
                  onChange={(e) => setServiceConfig({...serviceConfig, framework: e.target.value})}
                >
                  {selectedService.frameworks.map((framework) => (
                    <option key={framework} value={framework}>
                      {framework}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Template
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={serviceConfig.template}
                  onChange={(e) => setServiceConfig({...serviceConfig, template: e.target.value})}
                >
                  {selectedService.templates.map((template) => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      {selectedService && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-primary">Next: AI Configuration</h3>
                <p className="text-sm text-primary">
                  Use our AI-powered chat to configure your {selectedService.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleContinue}
              disabled={!serviceConfig.name}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Continue to Config
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateService;
