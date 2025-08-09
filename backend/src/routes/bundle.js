const express = require('express');
const { verifyToken } = require('./auth');
const router = express.Router();

// In-memory bundles store
let bundles = [];

// Bundle templates
const bundleTemplates = {
  'single-service': {
    name: 'Single Service',
    description: 'Deploy your configured service as a standalone application',
    features: ['Single container', 'Fast deployment', 'Simple monitoring'],
    pricing: 'Free tier available',
    requirements: {
      minCpu: '0.5',
      minMemory: '512Mi',
      maxInstances: 10
    }
  },
  'mcp-bundle': {
    name: 'MCP Server Bundle',
    description: 'Bundle multiple MCP servers together for complex workflows',
    features: ['Multiple MCP servers', 'Service mesh', 'Advanced routing'],
    pricing: 'Pay per service',
    requirements: {
      minCpu: '1',
      minMemory: '1Gi',
      maxInstances: 50
    }
  },
  'ai-agent-stack': {
    name: 'AI Agent Stack',
    description: 'Full stack with agent, tools, and observability',
    features: ['Agent + tools', 'Vector database', 'Full observability'],
    pricing: 'Premium features',
    requirements: {
      minCpu: '2',
      minMemory: '2Gi',
      maxInstances: 100
    }
  }
};

// Available MCP servers for bundling
const availableMCPServers = {
  'weather': {
    name: 'Weather API',
    description: 'Get weather information',
    image: 'aluminum/mcp-weather:latest',
    port: 3001,
    endpoints: ['/weather', '/forecast']
  },
  'search': {
    name: 'Web Search',
    description: 'Search the web for information',
    image: 'aluminum/mcp-search:latest',
    port: 3002,
    endpoints: ['/search', '/suggestions']
  },
  'calculator': {
    name: 'Calculator',
    description: 'Perform mathematical calculations',
    image: 'aluminum/mcp-calculator:latest',
    port: 3003,
    endpoints: ['/calculate', '/evaluate']
  },
  'files': {
    name: 'File Operations',
    description: 'Read and write files',
    image: 'aluminum/mcp-files:latest',
    port: 3004,
    endpoints: ['/read', '/write', '/list']
  }
};

// Get bundle templates
router.get('/templates', (req, res) => {
  res.json({ 
    templates: bundleTemplates,
    mcpServers: availableMCPServers 
  });
});

// Create bundle configuration
router.post('/create', verifyToken, (req, res) => {
  try {
    const { 
      serviceId, 
      bundleType, 
      mcpServers = [], 
      scaling = 'auto', 
      environment = 'production' 
    } = req.body;

    if (!serviceId || !bundleType) {
      return res.status(400).json({ error: 'Service ID and bundle type are required' });
    }

    const bundleTemplate = bundleTemplates[bundleType];
    if (!bundleTemplate) {
      return res.status(400).json({ error: 'Invalid bundle type' });
    }

    // Generate bundle configuration
    const bundleConfig = {
      id: `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.userId,
      serviceId,
      type: bundleType,
      template: bundleTemplate,
      mcpServers: mcpServers.map(serverId => availableMCPServers[serverId]).filter(Boolean),
      configuration: {
        scaling,
        environment,
        resources: bundleTemplate.requirements,
        networking: {
          loadBalancer: bundleType !== 'single-service',
          ssl: environment === 'production'
        }
      },
      status: 'configured',
      createdAt: new Date().toISOString()
    };

    bundles.push(bundleConfig);

    // Generate Docker Compose or Kubernetes manifests
    const deploymentConfig = generateDeploymentConfig(bundleConfig);

    res.status(201).json({
      message: 'Bundle created successfully',
      bundle: bundleConfig,
      deploymentConfig
    });
  } catch (error) {
    console.error('Bundle creation error:', error);
    res.status(500).json({ error: 'Failed to create bundle' });
  }
});

// Get bundle by ID
router.get('/:bundleId', verifyToken, (req, res) => {
  const bundle = bundles.find(b => 
    b.id === req.params.bundleId && b.userId === req.user.userId
  );

  if (!bundle) {
    return res.status(404).json({ error: 'Bundle not found' });
  }

  res.json({ bundle });
});

// Update bundle configuration
router.put('/:bundleId', verifyToken, (req, res) => {
  try {
    const bundleIndex = bundles.findIndex(b => 
      b.id === req.params.bundleId && b.userId === req.user.userId
    );

    if (bundleIndex === -1) {
      return res.status(404).json({ error: 'Bundle not found' });
    }

    const { mcpServers, scaling, environment } = req.body;
    const bundle = bundles[bundleIndex];

    // Update configuration
    if (mcpServers) {
      bundle.mcpServers = mcpServers.map(serverId => availableMCPServers[serverId]).filter(Boolean);
    }
    if (scaling) bundle.configuration.scaling = scaling;
    if (environment) bundle.configuration.environment = environment;

    bundle.updatedAt = new Date().toISOString();
    bundles[bundleIndex] = bundle;

    // Regenerate deployment config
    const deploymentConfig = generateDeploymentConfig(bundle);

    res.json({
      message: 'Bundle updated successfully',
      bundle,
      deploymentConfig
    });
  } catch (error) {
    console.error('Bundle update error:', error);
    res.status(500).json({ error: 'Failed to update bundle' });
  }
});

// Generate deployment configuration
const generateDeploymentConfig = (bundle) => {
  if (bundle.type === 'single-service') {
    return {
      type: 'single-container',
      dockerfile: `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
      `,
      cloudRun: {
        cpu: bundle.configuration.resources.minCpu,
        memory: bundle.configuration.resources.minMemory,
        maxInstances: bundle.configuration.resources.maxInstances
      }
    };
  } else if (bundle.type === 'mcp-bundle') {
    return {
      type: 'docker-compose',
      compose: generateDockerCompose(bundle),
      kubernetes: generateKubernetesManifest(bundle)
    };
  } else if (bundle.type === 'ai-agent-stack') {
    return {
      type: 'full-stack',
      compose: generateDockerCompose(bundle),
      kubernetes: generateKubernetesManifest(bundle),
      observability: {
        prometheus: true,
        grafana: true,
        jaeger: true
      }
    };
  }
};

const generateDockerCompose = (bundle) => {
  const services = {
    'main-service': {
      build: '.',
      ports: ['3000:3000'],
      environment: [
        'NODE_ENV=${NODE_ENV}',
        'OPENAI_API_KEY=${OPENAI_API_KEY}'
      ],
      depends_on: bundle.mcpServers.map(server => server.name.toLowerCase().replace(/\s+/g, '-'))
    }
  };

  // Add MCP servers
  bundle.mcpServers.forEach(server => {
    const serviceName = server.name.toLowerCase().replace(/\s+/g, '-');
    services[serviceName] = {
      image: server.image,
      ports: [`${server.port}:${server.port}`],
      environment: ['NODE_ENV=${NODE_ENV}']
    };
  });

  return {
    version: '3.8',
    services
  };
};

const generateKubernetesManifest = (bundle) => {
  return {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: `${bundle.serviceId}-deployment`,
      labels: {
        app: bundle.serviceId,
        bundleType: bundle.type
      }
    },
    spec: {
      replicas: bundle.configuration.scaling === 'auto' ? 3 : 1,
      selector: {
        matchLabels: {
          app: bundle.serviceId
        }
      },
      template: {
        metadata: {
          labels: {
            app: bundle.serviceId
          }
        },
        spec: {
          containers: [
            {
              name: 'main-service',
              image: `aluminum/${bundle.serviceId}:latest`,
              ports: [{ containerPort: 3000 }],
              resources: {
                requests: {
                  cpu: bundle.configuration.resources.minCpu,
                  memory: bundle.configuration.resources.minMemory
                }
              }
            },
            ...bundle.mcpServers.map(server => ({
              name: server.name.toLowerCase().replace(/\s+/g, '-'),
              image: server.image,
              ports: [{ containerPort: server.port }]
            }))
          ]
        }
      }
    }
  };
};

module.exports = router;
