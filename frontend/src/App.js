import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { checkSupabaseConnectivity } from './lib/supabaseClient';
import { supabase } from './lib/supabaseClient';

// Components based on workflow
import Dashboard from './components/Dashboard';
import Login from './components/auth/Login';
import CreateProject from './components/projects/CreateProject';
import ServiceCanvas from './components/services/ServiceCanvas';
import Bundles from './components/bundles/Bundles';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check Supabase connectivity once on app mount
  useEffect(() => {
    (async () => {
      const result = await checkSupabaseConnectivity();
      if (result.ok) {
        console.info('Supabase connectivity OK:', result.data);
        toast.success('Connected to Supabase');
      } else {
        console.warn('Supabase connectivity failed:', result.error);
        toast.error('Supabase connection failed');
      }
    })();
  }, []);

  // Initialize auth state and listen to changes
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setIsAuthenticated(!!data.session);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
              <div className="min-h-screen bg-background">
        <Toaster position="top-right" />
        
        {authChecked && (
        <Routes>
          {/* Authentication Route */}
          <Route 
            path="/login" 
            element={<Login />}
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
                    {/* Removed: ProjectCanvas route - users now go directly to services/canvas */}
                    {/* <Route path="/project/:projectName/canvas" element={<ProjectCanvas />} /> */}
                    <Route path="/project/:projectName/services/canvas" element={<ServiceCanvas />} />
                    {/* Temporarily disabled routes */}
                    {/* <Route path="/services/create" element={<CreateService />} /> */}
                    {/* <Route path="/config" element={<PromptBox />} /> */}
                    {/* <Route path="/bundle" element={<BundleSelector />} /> */}
                    {/* <Route path="/deploy" element={<Deploy />} /> */}
                    {/* <Route path="/endpoints" element={<Endpoints />} /> */}
                    <Route path="/observability" element={<Observability />} />
                    <Route path="/bundles" element={<Bundles />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
