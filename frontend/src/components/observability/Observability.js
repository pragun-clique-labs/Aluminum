import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Observability = () => {
  const [metrics, setMetrics] = useState({
    requests: 0,
    avgLatency: 0,
    errorRate: 0,
    uptime: 100
  });

  const [realtimeData, setRealtimeData] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [traces, setTraces] = useState([]);

  useEffect(() => {
    // Simulate real-time metrics
    const interval = setInterval(() => {
      setMetrics(prev => ({
        requests: prev.requests + Math.floor(Math.random() * 5),
        avgLatency: 150 + Math.random() * 100,
        errorRate: Math.random() * 2,
        uptime: 99.8 + Math.random() * 0.2
      }));

      // Add new data point for charts
      const now = new Date();
      const newDataPoint = {
        time: now.toLocaleTimeString(),
        timestamp: now.getTime(),
        requests: Math.floor(Math.random() * 20) + 10,
        latency: 120 + Math.random() * 80,
        errors: Math.floor(Math.random() * 3)
      };

      setRealtimeData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-20); // Keep last 20 data points
      });
    }, 3000);

    // Generate initial data
    const initialData = [];
    for (let i = 19; i >= 0; i--) {
      const time = new Date(Date.now() - i * 3000);
      initialData.push({
        time: time.toLocaleTimeString(),
        timestamp: time.getTime(),
        requests: Math.floor(Math.random() * 20) + 10,
        latency: 120 + Math.random() * 80,
        errors: Math.floor(Math.random() * 3)
      });
    }
    setRealtimeData(initialData);

    // Sample error logs
    setErrorLogs([
      {
        id: 1,
        timestamp: '2024-01-15 14:30:45',
        level: 'ERROR',
        message: 'Rate limit exceeded for API key',
        source: '/chat endpoint',
        count: 3
      },
      {
        id: 2,
        timestamp: '2024-01-15 14:25:12',
        level: 'WARN',
        message: 'High latency detected',
        source: 'LLM request',
        count: 1
      }
    ]);

    // Sample Laminar traces
    setTraces([
      {
        id: 1,
        traceId: 'trace_abc123',
        timestamp: '2024-01-15 14:32:10',
        operation: 'chat_completion',
        duration: '245ms',
        status: 'success',
        model: 'gpt-4',
        tokens: 150,
        cost: '$0.003'
      },
      {
        id: 2,
        traceId: 'trace_def456',
        timestamp: '2024-01-15 14:31:55',
        operation: 'tool_call',
        duration: '89ms',
        status: 'success',
        model: 'gpt-4',
        tokens: 45,
        cost: '$0.001'
      },
      {
        id: 3,
        traceId: 'trace_ghi789',
        timestamp: '2024-01-15 14:31:40',
        operation: 'chat_completion',
        duration: '1.2s',
        status: 'error',
        model: 'gpt-4',
        tokens: 0,
        cost: '$0.000'
      }
    ]);

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      title: 'Total Requests',
      value: metrics.requests.toLocaleString(),
      change: '+12%',
      icon: Activity,
      color: 'text-muted-foreground',
      bgColor: 'bg-accent'
    },
    {
      title: 'Avg Latency',
      value: `${Math.round(metrics.avgLatency)}ms`,
      change: '-5%',
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-accent'
    },
    {
      title: 'Error Rate',
      value: `${metrics.errorRate.toFixed(2)}%`,
      change: '+0.1%',
      icon: AlertTriangle,
      color: 'text-muted-foreground',
      bgColor: 'bg-accent'
    },
    {
      title: 'Uptime',
      value: `${metrics.uptime.toFixed(1)}%`,
      change: '0%',
      icon: CheckCircle,
      color: 'text-muted-foreground',
      bgColor: 'bg-accent'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-muted-foreground" />
            Observability Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time monitoring and AI tracing with Laminar integration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2 animate-pulse"></div>
            Live
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="bg-card overflow-hidden shadow rounded-lg border">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">{metric.title}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-card-foreground">{metric.value}</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-muted-foreground">
                          <TrendingUp className="self-center flex-shrink-0 h-3 w-3 mr-1" />
                          {metric.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Volume Chart */}
        <div className="bg-card shadow rounded-lg border p-6">
          <h3 className="text-lg font-medium text-card-foreground mb-4">Request Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '6px',
                  color: 'hsl(var(--card-foreground))'
                }} 
              />
              <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Chart */}
        <div className="bg-card shadow rounded-lg border p-6">
          <h3 className="text-lg font-medium text-card-foreground mb-4">Response Latency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '6px',
                  color: 'hsl(var(--card-foreground))'
                }} 
              />
              <Line type="monotone" dataKey="latency" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Laminar AI Tracing */}
      <div className="bg-card shadow rounded-lg border">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-card-foreground flex items-center">
              <Zap className="mr-2 h-5 w-5 text-muted-foreground" />
              AI Traces (Laminar)
            </h2>
            <div className="text-sm text-muted-foreground">
              Real-time LLM observability
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Trace ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Operation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {traces.map((trace) => (
                <tr key={trace.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <code className="text-sm font-mono text-card-foreground">{trace.traceId}</code>
                      <button className="ml-2 text-muted-foreground hover:text-card-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {trace.operation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {trace.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                      {trace.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {trace.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {trace.tokens}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {trace.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Logs */}
      <div className="bg-card shadow rounded-lg border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-card-foreground">Recent Errors</h2>
        </div>
        <div className="divide-y divide-border">
          {errorLogs.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <CheckCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              No errors in the last 24 hours
            </div>
          ) : (
            errorLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-secondary text-secondary-foreground">
                        {log.level}
                      </span>
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                      {log.count > 1 && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {log.count}x
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-card-foreground mb-1">{log.message}</p>
                    <p className="text-xs text-muted-foreground">Source: {log.source}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Observability;
