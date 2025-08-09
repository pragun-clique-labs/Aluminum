import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings,
  HelpCircle
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header - Railway style */}
      <header className="bg-card border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between h-14 px-6">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/logo/GGEmoji_Steel_1500x1500-1100x1100.webp" 
                alt="Aluminum Logo" 
                className="h-6 w-6"
              />
              <h1 className="text-xl text-card-foreground no-lowercase" style={{fontWeight: 500}}>Aluminum</h1>
            </Link>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center pl-4 border-l border-border">
              <div className="text-left">
                <p className="text-sm font-normal text-card-foreground">punit vats</p>
                <p className="text-xs font-normal text-muted-foreground">30 days or $5.00</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
