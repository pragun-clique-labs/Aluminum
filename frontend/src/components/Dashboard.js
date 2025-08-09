import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye,
  MoreVertical,
  Rocket,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  GitBranch,
  MessageSquare,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('aluminumProjects') || '[]');
    
    // Transform saved projects to dashboard format
    const transformedProjects = savedProjects.map(project => {
      const services = project.nodes.map(node => ({
        type: node.data.serviceType,
        name: node.data.label,
        status: node.data.status || 'not-deployed'
      }));
      
      const hasDeployedServices = services.some(s => s.status === 'deployed');
      const allDeployed = services.length > 0 && services.every(s => s.status === 'deployed');
      
      return {
        id: project.name,
        name: project.name,
        displayName: project.displayName,
        description: `${services.length} service${services.length !== 1 ? 's' : ''}`,
        services: services,
        status: allDeployed ? 'deployed' : hasDeployedServices ? 'partial' : 'not-deployed',
        environment: 'production',
        lastDeployed: hasDeployedServices ? 'recently' : 'not deployed',
        region: 'us-west-2',
        createdAt: project.createdAt || new Date().toISOString(),
        lastUpdated: project.lastUpdated
      };
    });
    
    setProjects(transformedProjects);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'deploying':
        return <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed':
        return 'text-green-600 bg-green-50';
      case 'partial':
        return 'text-yellow-600 bg-yellow-50';
      case 'deploying':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'mcp-server':
        return GitBranch;
      case 'ai-agent':
        return MessageSquare;
      case 'bundle-mcp':
        return Package;
      case 'secrets-manager':
        return Shield;
      default:
        return Package;
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Main Content - Railway style */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Header with user name */}
          <div className="mb-8">
            <h1 className="text-2xl font-normal text-foreground">
              punit vats's Projects
              <span className="ml-4 text-sm text-muted-foreground uppercase tracking-wider">TRIAL</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              30 days or $5.00 · Your trial expires in 30 days or when you've out of credits. Upgrade to keep your services online.
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Existing Projects */}
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-card border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-md cursor-pointer min-h-[280px] flex flex-col"
                  onClick={() => navigate(`/project/${project.name}/canvas`)}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium text-foreground truncate">{project.displayName}</h3>
                        <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                      </div>
                      <button 
                        className="text-muted-foreground hover:text-foreground flex-shrink-0 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle menu
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Services */}
                    <div className="flex flex-wrap gap-2 mb-6 flex-1">
                      {project.services.slice(0, 3).map((service, idx) => {
                        const Icon = getServiceIcon(service.type);
                        return (
                          <div key={idx} className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded h-fit">
                            <Icon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{service.name}</span>
                          </div>
                        );
                      })}
                      {project.services.length > 3 && (
                        <div className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground h-fit">
                          +{project.services.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Deployment Status - Moved to bottom */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(project.status)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                          {project.status === 'deployed' ? 'all deployed' : 
                           project.status === 'partial' ? 'partially deployed' : 
                           'not deployed'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {project.lastDeployed}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-muted/50 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.environment}</span>
                      <span>{project.region}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Project Card */}
              <Link
                to="/projects/create"
                className="bg-card border-2 border-dashed border-muted rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center p-6 min-h-[280px] group"
              >
                <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-4">
                  <img 
                    src="/logo/GGEmoji_Steel_1500x1500-1100x1100.webp" 
                    alt="Aluminum Logo" 
                    className="h-12 w-12 opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <h3 className="text-lg font-normal text-foreground group-hover:text-primary transition-colors">
                  Create New Project
                </h3>
                <p className="mt-2 text-sm text-muted-foreground text-center">
                  Deploy AI agents, MCP servers, or start from a template
                </p>
              </Link>
            </div>
          ) : (
            /* Empty State - First Project */
            <div className="bg-card border-2 border-dashed border-muted rounded-lg hover:border-primary transition-colors">
              <Link
                to="/projects/create"
                className="block p-16 text-center group"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <img 
                      src="/logo/GGEmoji_Steel_1500x1500-1100x1100.webp" 
                      alt="Aluminum Logo" 
                      className="h-20 w-20 opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-normal text-foreground group-hover:text-primary transition-colors">
                      Create a New Project
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Deploy a GitHub Repository, Provision a Database, or create an Empty Project to start from local.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Bottom actions */}
          <div className="mt-8">
            <div className="flex items-center space-x-4">
              <Link 
                to="/observability" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
              >
                <Eye className="h-4 w-4 mr-1" />
                Observability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;