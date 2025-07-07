import { NavLink } from "react-router-dom";
import { BarChart3, Film, Plus, Settings } from "lucide-react";
import { Disc } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: BarChart3, label: "Dashboard" },
    { to: "/library", icon: Film, label: "Library" },
    { to: "/add-media", icon: Plus, label: "Add New" },
    { to: "/burn", icon: Disc, label: "Burn" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="bg-surface-elevated border-b border-border">
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
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden grid grid-cols-5 py-2 border-t border-border">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
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
      </div>
    </nav>
  );
};

export default Navigation;