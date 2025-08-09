import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
        });
        if (error) throw error;
        toast.success('Sign up successful. Check your email to confirm.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });
        if (error) throw error;
        if (data.session) {
          toast.success('Signed in');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Auth failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl shadow-lg border">
        <div className="text-center">
          <img 
            src="/logo/GGEmoji_Steel_1500x1500-1100x1100.webp" 
            alt="Aluminum Logo" 
            className="mx-auto h-20 w-20 mb-4"
          />
          <h1 className="text-4xl sm:text-5xl font-normal text-foreground no-lowercase">Aluminum</h1>
          <p className="mt-2 text-sm font-normal text-muted-foreground">
            deploy ai agents & mcp servers with ease
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-normal text-card-foreground">email</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  className="pl-10 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  placeholder="enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-normal text-card-foreground">password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  className="pl-10 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  placeholder="enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-normal text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {mode === 'signup' ? 'sign up' : 'sign in'}
              </>
            )}
          </button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === 'signin' ? (
              <button type="button" onClick={() => setMode('signup')} className="underline">
                create an account
              </button>
            ) : (
              <button type="button" onClick={() => setMode('signin')} className="underline">
                already have an account? sign in
              </button>
            )}
          </div>
        </form>
        
        
      </div>
    </div>
  );
};

export default Login;
