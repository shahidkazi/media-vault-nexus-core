import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BarChart3, Film, Plus, Settings, Menu, X, LogOut } from "lucide-react";
import { Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navItems = [
    { to: "/", icon: BarChart3, label: "Dashboard" },
    { to: "/library", icon: Film, label: "Library" },
    { to: "/add-media", icon: Plus, label: "New" },
    { to: "/burn", icon: Disc, label: "Burn" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Media Vault
            </h1>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
            
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation - collapsible */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-2 border-t border-border space-y-2">
            <div className="grid grid-cols-5 gap-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex flex-col items-center space-y-1 p-2 rounded-md text-xs transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;