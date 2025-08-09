import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ArrowLeft,
  Plus,
  Settings,
  GitBranch,
  Database,
  Globe,
  MessageSquare,
  Package,
  Rocket,
  Eye,
  Activity,
  Clock,
  User,
  Shield,
  CheckCircle
} from 'lucide-react';
import ServicePanel from './ServicePanel';

// Custom Node Component
const ServiceNode = ({ data, selected }) => {
  const Icon = data.icon;
  
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-card w-[220px] h-[80px] flex flex-col justify-center cursor-pointer hover:shadow-xl transition-shadow relative ${
        selected ? 'border-primary' : 'border-input hover:border-primary/50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${data.color} flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.type}</div>
        </div>
      </div>
      {/* Deployment Status Indicator */}
      {data.status === 'deployed' && (
        <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

const ServiceCanvas = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [nodeId, setNodeId] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [activities, setActivities] = useState([
    { id: 1, type: 'deployment', message: 'new environment', user: 'punit vats', time: '5 seconds ago' },
    { id: 2, type: 'service', message: 'mcp server created', user: 'punit vats', time: '2 minutes ago' },
    { id: 3, type: 'connection', message: 'database connected', user: 'punit vats', time: '5 minutes ago' }
  ]);

  // Load existing project data on mount
  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('aluminumProjects') || '[]');
    const existingProject = savedProjects.find(p => p.name === projectName);
    
    if (existingProject && existingProject.nodes) {
      setNodes(existingProject.nodes);
      // Set nodeId based on existing nodes
      const maxNodeId = existingProject.nodes.reduce((max, node) => {
        const match = node.id.match(/node-(\d+)/);
        return match ? Math.max(max, parseInt(match[1])) : max;
      }, 0);
      setNodeId(maxNodeId + 1);
    }
  }, [projectName]);

  const nodeTypes = useMemo(() => ({
    serviceNode: ServiceNode,
  }), []);

  const servicePanels = [
    {
      title: 'MCP & Bundle',
      services: [
        {
          id: 'mcp-server',
          name: 'MCP Server',
          description: 'Model Control Protocol server',
          icon: GitBranch,
          enabled: true
        },
        {
          id: 'bundle-mcp',
          name: 'Bundle MCP',
          description: 'Bundled MCP services',
          icon: Package,
          enabled: nodes.some(node => node.data.serviceType === 'mcp-server')
        }
      ]
    },
    {
      title: 'Agent',
      services: [
        {
          id: 'ai-agent',
          name: 'AI Agent',
          description: 'LangGraph/CrewAI multi-agent',
          icon: MessageSquare,
          enabled: true
        }
      ]
    },
    {
      title: 'Security',
      services: [
        {
          id: 'secrets-manager',
          name: 'Secrets Manager',
          description: 'API keys & credentials',
          icon: Shield,
          enabled: true
        }
      ]
    }
  ];

  // Calculate matrix position for new nodes
  const getMatrixPosition = useCallback((index) => {
    const itemsPerRow = 3;
    const cardWidth = 220;
    const cardHeight = 80;
    const paddingX = 40;
    const paddingY = 30;
    
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    
    return {
      x: col * (cardWidth + paddingX) + paddingX,
      y: row * (cardHeight + paddingY) + paddingY
    };
  }, []);

  const formatProjectName = (name) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const saveProject = useCallback(() => {
    const savedProjects = JSON.parse(localStorage.getItem('aluminumProjects') || '[]');
    const projectData = {
      name: projectName,
      displayName: projectName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      nodes: nodes,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    const existingIndex = savedProjects.findIndex(p => p.name === projectName);
    if (existingIndex !== -1) {
      savedProjects[existingIndex] = projectData;
    } else {
      savedProjects.push(projectData);
    }
    
    localStorage.setItem('aluminumProjects', JSON.stringify(savedProjects));
  }, [nodes, projectName]);

  const addNode = useCallback((serviceType) => {
    const serviceId = `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNode = {
      id: `node-${nodeId}`,
      type: 'serviceNode',
      position: getMatrixPosition(nodes.length),
      data: {
        id: serviceId,
        label: `${serviceType.name} ${nodeId}`,
        type: serviceType.description,
        icon: serviceType.icon,
        color: 'bg-muted',
        serviceType: serviceType.id,
        status: 'not-deployed'
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeId(nodeId + 1);
    
    // Add activity
    const newActivity = {
      id: Date.now(),
      type: 'service',
      message: `${serviceType.name.toLowerCase()} added`,
      user: 'punit vats',
      time: 'just now'
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
  }, [nodeId, setNodes, getMatrixPosition, nodes.length]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedService(node.data);
  }, []);

  const onServiceUpdate = useCallback((updatedService) => {
    // Update the node with new status
    setNodes((nds) => 
      nds.map((node) => 
        node.data.id === updatedService.id 
          ? { ...node, data: { ...node.data, ...updatedService } }
          : node
      )
    );
    
    // Update selected service if it's the same
    if (selectedService?.id === updatedService.id) {
      setSelectedService(updatedService);
    }
    
    // Save to localStorage
    saveProject();
  }, [selectedService, saveProject]);

  // Save project when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      saveProject();
    }
  }, [nodes, saveProject]);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border flex-shrink-0 z-10">
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(`/project/${projectName}/canvas`)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <img 
                src="/logo/GGEmoji_Steel_1500x1500-1100x1100.webp" 
                alt="Project Logo" 
                className="h-6 w-6"
              />
              <h1 className="text-lg font-normal text-foreground">
                {formatProjectName(projectName)} • service canvas
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* React Flow Canvas */}
      <div className="flex-1 min-h-0 relative">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          style={{ width: '100%', height: '100%' }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background 
            variant="dots" 
            gap={20} 
            size={1}
            className="bg-background"
          />
          <Controls className="bg-card border border-input" />
          <MiniMap 
            className="bg-card border border-input"
            nodeColor="#6366f1"
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          
          {/* Service Palette Panel */}
          <Panel position="top-right" className="bg-card border border-input rounded-lg p-3 m-2 shadow-lg min-w-[220px] max-w-[280px]">
            <h3 className="text-sm font-medium text-foreground mb-3">add services</h3>
            <div className="space-y-4">
              {servicePanels.map((panel, panelIndex) => (
                <div key={panelIndex} className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {panel.title}
                  </h4>
                  <div className="space-y-1">
                    {panel.services.map((service) => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => service.enabled ? addNode(service) : null}
                          disabled={!service.enabled}
                          className={`flex items-center space-x-2 w-full p-2 text-left rounded-md transition-colors group ${
                            service.enabled 
                              ? 'hover:bg-accent cursor-pointer' 
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex-shrink-0 w-5 h-5 rounded bg-muted flex items-center justify-center">
                            <Icon className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-normal text-foreground group-hover:text-accent-foreground">
                              {service.name.toLowerCase()}
                            </div>
                          </div>
                          <Plus className={`h-3 w-3 ${service.enabled ? 'text-muted-foreground group-hover:text-accent-foreground' : 'text-muted-foreground/30'}`} />
                        </button>
                      );
                    })}
                  </div>
                  {panelIndex < servicePanels.length - 1 && (
                    <div className="border-b border-border pt-1" />
                  )}
                </div>
              ))}
            </div>
          </Panel>

          {/* Activity Panel */}
          <Panel position="top-left" className="bg-card border border-input rounded-lg p-3 m-2 shadow-lg max-w-[280px]">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-normal text-foreground">activity</h3>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-2 p-2 hover:bg-accent/50 rounded-md transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {activity.type === 'deployment' && <Rocket className="h-3 w-3 text-muted-foreground" />}
                    {activity.type === 'service' && <Settings className="h-3 w-3 text-muted-foreground" />}
                    {activity.type === 'connection' && <Globe className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">{activity.message}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <User className="h-2 w-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <Clock className="h-2 w-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">no recent activity</p>
                </div>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Service Configuration Panel */}
      {selectedService && (
        <ServicePanel 
          service={selectedService} 
          onClose={() => setSelectedService(null)}
          onServiceUpdate={onServiceUpdate}
        />
      )}
    </div>
  );
};

export default ServiceCanvas;
