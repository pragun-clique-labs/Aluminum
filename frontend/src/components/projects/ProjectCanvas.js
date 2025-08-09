import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus,
  Settings,
  ArrowLeft,
  MoreHorizontal
} from 'lucide-react';

const ProjectCanvas = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();

  const formatProjectName = (name) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };



  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between h-14 px-6">
          {/* Left side - Back button and project name */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
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
                {formatProjectName(projectName)}
              </h1>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Canvas Content */}
        <div className="relative h-full flex items-center justify-center p-8">
          {/* Railway-style Add Service Card */}
          <button
            onClick={() => navigate(`/project/${projectName}/services/canvas`)}
            className="bg-card border-2 border-dashed border-muted rounded-lg p-8 max-w-md mx-auto hover:border-primary transition-colors group block"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-normal text-foreground">
                  add a service
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  ⌘k → new service
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  or top-right button is fine too.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCanvas;
