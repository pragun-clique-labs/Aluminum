const express = require('express');
const { verifyToken } = require('./auth');
const router = express.Router();

// In-memory metrics store (replace with time-series database in production)
let metrics = [];
let traces = [];
let logs = [];

// Generate mock metrics data
const generateMockMetrics = () => {
  const now = new Date();
  return {
    timestamp: now.toISOString(),
    requests: Math.floor(Math.random() * 50) + 10,
    latency: Math.floor(Math.random() * 200) + 100,
    errors: Math.floor(Math.random() * 3),
    cpuUsage: Math.random() * 80 + 10,
    memoryUsage: Math.random() * 60 + 20,
    uptime: 99.8 + Math.random() * 0.2
  };
};

// Initialize with some mock data
const initializeMockData = () => {
  // Generate last 24 hours of metrics (1 point per hour)
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(Date.now() - i * 60 * 60 * 1000);
    metrics.push({
      ...generateMockMetrics(),
      timestamp: timestamp.toISOString()
    });
  }

  // Generate mock traces (Laminar-style)
  const operations = ['chat_completion', 'tool_call', 'embedding', 'function_call'];
  const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3'];
  const statuses = ['success', 'error'];

  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
    traces.push({
      id: `trace_${Date.now()}_${i}`,
      traceId: `tr_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: timestamp.toISOString(),
      operation: operations[Math.floor(Math.random() * operations.length)],
      duration: Math.floor(Math.random() * 2000) + 100,
      status: Math.random() > 0.9 ? 'error' : 'success',
      model: models[Math.floor(Math.random() * models.length)],
      tokens: Math.floor(Math.random() * 500) + 50,
      cost: (Math.random() * 0.01).toFixed(4),
      metadata: {
        userId: 'user_123',
        sessionId: `session_${Math.random().toString(36).substr(2, 6)}`,
        temperature: 0.7,
        maxTokens: 1000
      }
    });
  }

  // Generate mock logs
  const logLevels = ['info', 'warn', 'error'];
  const logMessages = [
    'Request processed successfully',
    'High latency detected',
    'Rate limit exceeded',
    'Cache miss for key',
    'Database connection restored',
    'Deployment completed'
  ];

  for (let i = 0; i < 15; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    logs.push({
      id: `log_${Date.now()}_${i}`,
      timestamp: timestamp.toISOString(),
      level,
      message: logMessages[Math.floor(Math.random() * logMessages.length)],
      source: `/api/${['chat', 'health', 'tools'][Math.floor(Math.random() * 3)]}`,
      userId: 'user_123',
      metadata: {
        requestId: `req_${Math.random().toString(36).substr(2, 8)}`,
        duration: Math.floor(Math.random() * 1000) + 50
      }
    });
  }
};

// Initialize mock data
initializeMockData();

// Get real-time metrics
router.get('/metrics', verifyToken, (req, res) => {
  try {
    const { timeRange = '24h', deploymentId } = req.query;

    // Filter metrics by time range
    let filteredMetrics = metrics;
    const now = Date.now();
    
    switch (timeRange) {
      case '1h':
        filteredMetrics = metrics.filter(m => 
          new Date(m.timestamp).getTime() > now - 60 * 60 * 1000
        );
        break;
      case '6h':
        filteredMetrics = metrics.filter(m => 
          new Date(m.timestamp).getTime() > now - 6 * 60 * 60 * 1000
        );
        break;
      case '24h':
      default:
        filteredMetrics = metrics.filter(m => 
          new Date(m.timestamp).getTime() > now - 24 * 60 * 60 * 1000
        );
        break;
    }

    // Calculate aggregated metrics
    const totalRequests = filteredMetrics.reduce((sum, m) => sum + m.requests, 0);
    const avgLatency = filteredMetrics.reduce((sum, m) => sum + m.latency, 0) / filteredMetrics.length;
    const errorRate = (filteredMetrics.reduce((sum, m) => sum + m.errors, 0) / totalRequests) * 100;
    const avgUptime = filteredMetrics.reduce((sum, m) => sum + m.uptime, 0) / filteredMetrics.length;

    res.json({
      timeRange,
      aggregated: {
        totalRequests: Math.floor(totalRequests),
        avgLatency: Math.floor(avgLatency),
        errorRate: Math.round(errorRate * 100) / 100,
        uptime: Math.round(avgUptime * 100) / 100
      },
      timeSeries: filteredMetrics.map(m => ({
        timestamp: m.timestamp,
        requests: m.requests,
        latency: m.latency,
        errors: m.errors,
        cpuUsage: m.cpuUsage,
        memoryUsage: m.memoryUsage
      }))
    });
  } catch (error) {
    console.error('Metrics retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

// Get AI traces (Laminar-style)
router.get('/traces', verifyToken, (req, res) => {
  try {
    const { limit = 50, operation, status, timeRange = '24h' } = req.query;

    let filteredTraces = traces;
    const now = Date.now();

    // Filter by time range
    switch (timeRange) {
      case '1h':
        filteredTraces = filteredTraces.filter(t => 
          new Date(t.timestamp).getTime() > now - 60 * 60 * 1000
        );
        break;
      case '6h':
        filteredTraces = filteredTraces.filter(t => 
          new Date(t.timestamp).getTime() > now - 6 * 60 * 60 * 1000
        );
        break;
      case '24h':
      default:
        filteredTraces = filteredTraces.filter(t => 
          new Date(t.timestamp).getTime() > now - 24 * 60 * 60 * 1000
        );
        break;
    }

    // Filter by operation
    if (operation) {
      filteredTraces = filteredTraces.filter(t => t.operation === operation);
    }

    // Filter by status
    if (status) {
      filteredTraces = filteredTraces.filter(t => t.status === status);
    }

    // Sort by timestamp (newest first) and limit
    filteredTraces = filteredTraces
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, parseInt(limit));

    res.json({
      traces: filteredTraces,
      total: filteredTraces.length,
      filters: { operation, status, timeRange, limit }
    });
  } catch (error) {
    console.error('Traces retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve traces' });
  }
});

// Get trace details
router.get('/traces/:traceId', verifyToken, (req, res) => {
  try {
    const trace = traces.find(t => t.traceId === req.params.traceId);
    
    if (!trace) {
      return res.status(404).json({ error: 'Trace not found' });
    }

    // Add detailed span information
    const traceDetails = {
      ...trace,
      spans: [
        {
          id: 'span_1',
          name: 'HTTP Request',
          startTime: trace.timestamp,
          duration: 50,
          tags: { 'http.method': 'POST', 'http.url': '/chat' }
        },
        {
          id: 'span_2',
          name: 'LLM Call',
          startTime: new Date(new Date(trace.timestamp).getTime() + 50).toISOString(),
          duration: trace.duration - 100,
          tags: { 'llm.model': trace.model, 'llm.tokens': trace.tokens }
        },
        {
          id: 'span_3',
          name: 'Response Processing',
          startTime: new Date(new Date(trace.timestamp).getTime() + trace.duration - 50).toISOString(),
          duration: 50,
          tags: { 'processing.type': 'response_formatting' }
        }
      ]
    };

    res.json({ trace: traceDetails });
  } catch (error) {
    console.error('Trace details retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve trace details' });
  }
});

// Get logs
router.get('/logs', verifyToken, (req, res) => {
  try {
    const { limit = 100, level, timeRange = '24h', search } = req.query;

    let filteredLogs = logs;
    const now = Date.now();

    // Filter by time range
    switch (timeRange) {
      case '1h':
        filteredLogs = filteredLogs.filter(l => 
          new Date(l.timestamp).getTime() > now - 60 * 60 * 1000
        );
        break;
      case '6h':
        filteredLogs = filteredLogs.filter(l => 
          new Date(l.timestamp).getTime() > now - 6 * 60 * 60 * 1000
        );
        break;
      case '24h':
      default:
        filteredLogs = filteredLogs.filter(l => 
          new Date(l.timestamp).getTime() > now - 24 * 60 * 60 * 1000
        );
        break;
    }

    // Filter by log level
    if (level) {
      filteredLogs = filteredLogs.filter(l => l.level === level);
    }

    // Search in messages
    if (search) {
      filteredLogs = filteredLogs.filter(l => 
        l.message.toLowerCase().includes(search.toLowerCase()) ||
        l.source.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by timestamp (newest first) and limit
    filteredLogs = filteredLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, parseInt(limit));

    res.json({
      logs: filteredLogs,
      total: filteredLogs.length,
      filters: { level, timeRange, search, limit }
    });
  } catch (error) {
    console.error('Logs retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// Health check for specific deployment
router.get('/health/:deploymentId', verifyToken, (req, res) => {
  try {
    const { deploymentId } = req.params;

    // Mock health check
    const healthStatus = {
      deploymentId,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        api: { status: 'pass', responseTime: Math.floor(Math.random() * 100) + 50 },
        database: { status: 'pass', connectionPool: Math.floor(Math.random() * 10) + 5 },
        llm: { status: 'pass', apiKey: 'valid', rateLimit: '90%' },
        memory: { status: 'pass', usage: Math.floor(Math.random() * 30) + 40 },
        cpu: { status: 'pass', usage: Math.floor(Math.random() * 20) + 30 }
      },
      uptime: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400), // Random uptime in seconds
      version: '1.0.0'
    };

    res.json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Add new metric (for testing)
router.post('/metrics', verifyToken, (req, res) => {
  try {
    const newMetric = {
      ...generateMockMetrics(),
      ...req.body,
      timestamp: new Date().toISOString()
    };

    metrics.push(newMetric);

    // Keep only last 1000 metrics
    if (metrics.length > 1000) {
      metrics = metrics.slice(-1000);
    }

    res.status(201).json({ message: 'Metric added', metric: newMetric });
  } catch (error) {
    console.error('Metric addition error:', error);
    res.status(500).json({ error: 'Failed to add metric' });
  }
});

// Get deployment summary
router.get('/summary/:deploymentId', verifyToken, (req, res) => {
  try {
    const { deploymentId } = req.params;

    // Generate summary from recent metrics
    const recentMetrics = metrics.slice(-24); // Last 24 data points
    const recentTraces = traces.slice(-50);
    const recentLogs = logs.filter(l => l.level === 'error').slice(-10);

    const summary = {
      deploymentId,
      period: '24h',
      metrics: {
        totalRequests: recentMetrics.reduce((sum, m) => sum + m.requests, 0),
        avgLatency: Math.round(recentMetrics.reduce((sum, m) => sum + m.latency, 0) / recentMetrics.length),
        errorRate: Math.round((recentLogs.length / recentMetrics.reduce((sum, m) => sum + m.requests, 0)) * 10000) / 100,
        uptime: Math.round(recentMetrics.reduce((sum, m) => sum + m.uptime, 0) / recentMetrics.length * 100) / 100
      },
      ai: {
        totalTraces: recentTraces.length,
        successfulTraces: recentTraces.filter(t => t.status === 'success').length,
        avgDuration: Math.round(recentTraces.reduce((sum, t) => sum + t.duration, 0) / recentTraces.length),
        totalTokens: recentTraces.reduce((sum, t) => sum + t.tokens, 0),
        totalCost: recentTraces.reduce((sum, t) => sum + parseFloat(t.cost), 0).toFixed(4)
      },
      errors: recentLogs.length,
      alerts: recentLogs.length > 5 ? ['High error rate detected'] : []
    };

    res.json(summary);
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;
