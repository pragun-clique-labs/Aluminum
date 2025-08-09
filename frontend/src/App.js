import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components based on workflow
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import CreateProject from './components/projects/CreateProject';
import ProjectCanvas from './components/projects/ProjectCanvas';
import ServiceCanvas from './components/services/ServiceCanvas';
// Temporarily disabled components
// import CreateService from './components/services/CreateService';
// import PromptBox from './components/config/PromptBox';
// import BundleSelector from './components/bundle/BundleSelector';
// import Deploy from './components/deploy/Deploy';
import Observability from './components/observability/Observability';
// import Endpoints from './components/endpoints/Endpoints';

// Layout
import Layout from './components/layout/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Bypass auth for demo
  const [currentStep, setCurrentStep] = useState('dashboard');

  return (
    <Router>
              <div className="min-h-screen bg-background">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Authentication Route - Redirect to dashboard for demo */}
          <Route 
            path="/login" 
            element={<Navigate to="/dashboard" replace />}
          />
          
          {/* Protected Routes */}
          <Route 
            path="/*" 
            element={
              isAuthenticated ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects/create" element={<CreateProject />} />
                    <Route path="/project/:projectName/canvas" element={<ProjectCanvas />} />
                    <Route path="/project/:projectName/services/canvas" element={<ServiceCanvas />} />
                    {/* Temporarily disabled routes */}
                    {/* <Route path="/services/create" element={<CreateService />} /> */}
                    {/* <Route path="/config" element={<PromptBox />} /> */}
                    {/* <Route path="/bundle" element={<BundleSelector />} /> */}
                    {/* <Route path="/deploy" element={<Deploy />} /> */}
                    {/* <Route path="/endpoints" element={<Endpoints />} /> */}
                    <Route path="/observability" element={<Observability />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
