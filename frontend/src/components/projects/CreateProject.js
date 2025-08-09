import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, ArrowRight, Folder, GitBranch, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);





  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Project created successfully!');
      navigate(`/project/${project.name.toLowerCase().replace(/\s+/g, '-')}/services/canvas`);
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      {/* Railway-style centered layout */}
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-6 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/logo/GGEmoji_Steel_1500x1500-1100x1100.webp" 
              alt="Aluminum Logo" 
              className="mx-auto h-16 w-16 mb-4"
            />
            <h1 className="text-2xl font-normal text-foreground">create new project</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              set up a new project for your ai agents or mcp servers
            </p>
          </div>

          {/* Form */}
          <div className="bg-card shadow rounded-lg border">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-normal text-card-foreground mb-2">
                project name
              </label>
              <input
                type="text"
                required
                className="block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                placeholder="my-awesome-agent"
                value={project.name}
                onChange={(e) => setProject({...project, name: e.target.value})}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-normal text-card-foreground mb-2">
                description
              </label>
              <textarea
                rows={3}
                className="block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                placeholder="Brief description of your project"
                value={project.description}
                onChange={(e) => setProject({...project, description: e.target.value})}
              />
            </div>





            {/* Submit */}
            <div className="flex justify-between space-x-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-normal hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 flex items-center transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CreateProject;
