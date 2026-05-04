import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Tags, 
  Settings, 
  ChevronLeft, 
  Wallet
} from 'lucide-react';
import { cn } from '../../services/utils';
import { Button } from '../ui/Button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ArrowLeftRight, label: 'Transações', path: '/transactions' },
  { icon: Tags, label: 'Categorias', path: '/categories' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside 
      className={cn(
        "h-screen border-r border-border bg-card flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
          <Wallet size={20} />
        </div>
        {!isCollapsed && (
          <span className="font-heading font-bold text-xl tracking-tight">Financeiro Pro</span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon size={20} />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={cn("transition-transform", isCollapsed && "rotate-180")} size={20} />
          {!isCollapsed && <span>Recolher</span>}
        </Button>
      </div>
    </aside>
  );
}
