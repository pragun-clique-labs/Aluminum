const express = require('express');
const { verifyToken } = require('./auth');
const router = express.Router();

// In-memory services store
let services = [];

// Service templates
const serviceTemplates = {
  'mcp-server': {
    frameworks: ['TypeScript', 'Python', 'Node.js'],
    templates: ['Basic Chat', 'File Operations', 'Web Scraper', 'API Gateway'],
    defaultPorts: [3000, 8000, 5000],
    defaultEndpoints: ['/health', '/mcp', '/tools']
  },
  'bundle-mcp': {
    frameworks: ['Docker Compose', 'Kubernetes'],
    templates: ['Multi-Tool Agent', 'Microservices Bundle', 'API Gateway + Tools'],
    defaultPorts: [80, 443],
    defaultEndpoints: ['/health', '/status', '/services']
  },
  'ai-agent': {
    frameworks: ['LangChain', 'LangGraph', 'CrewAI', 'AutoGen'],
    templates: ['Chat Assistant', 'Research Agent', 'Code Generator', 'Data Analyst'],
    defaultPorts: [8080, 3000],
    defaultEndpoints: ['/chat', '/health', '/status', '/tools']
  },
  'secrets-manager': {
    frameworks: ['Environment Variables', 'HashiCorp Vault', 'AWS Secrets'],
    templates: ['API Keys Store', 'Database Credentials', 'OAuth Tokens', 'Custom Secrets'],
    defaultPorts: [8200, 3000],
    defaultEndpoints: ['/health', '/secrets', '/config']
  }
};

// Get service templates
router.get('/templates', (req, res) => {
  res.json({ templates: serviceTemplates });
});

// Get all services for user
router.get('/', verifyToken, (req, res) => {
  const userServices = services.filter(s => s.userId === req.user.userId);
  res.json({ services: userServices });
});

// Create new service
router.post('/', verifyToken, (req, res) => {
  try {
    const { name, type, framework, template, projectId } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const serviceTemplate = serviceTemplates[type];
    if (!serviceTemplate) {
      return res.status(400).json({ error: 'Invalid service type' });
    }

    const service = {
      id: `svc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.userId,
      projectId: projectId || null,
      name,
      type,
      framework: framework || serviceTemplate.frameworks[0],
      template: template || serviceTemplate.templates[0],
      status: 'created',
      configuration: {
        port: serviceTemplate.defaultPorts[0],
        endpoints: serviceTemplate.defaultEndpoints,
        environment: {},
        secrets: {}
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    services.push(service);

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Service creation error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Get service by ID
router.get('/:serviceId', verifyToken, (req, res) => {
  const service = services.find(s => 
    s.id === req.params.serviceId && s.userId === req.user.userId
  );

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json({ service });
});

// Update service configuration
router.put('/:serviceId', verifyToken, (req, res) => {
  try {
    const serviceIndex = services.findIndex(s => 
      s.id === req.params.serviceId && s.userId === req.user.userId
    );

    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = services[serviceIndex];
    const { configuration, aiConfig, status } = req.body;

    // Update configuration
    if (configuration) {
      service.configuration = { ...service.configuration, ...configuration };
    }

    // Add AI configuration
    if (aiConfig) {
      service.aiConfig = aiConfig;
    }

    // Update status
    if (status) {
      service.status = status;
    }

    service.updatedAt = new Date().toISOString();
    services[serviceIndex] = service;

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Service update error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
router.delete('/:serviceId', verifyToken, (req, res) => {
  try {
    const serviceIndex = services.findIndex(s => 
      s.id === req.params.serviceId && s.userId === req.user.userId
    );

    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    services.splice(serviceIndex, 1);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Service deletion error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
