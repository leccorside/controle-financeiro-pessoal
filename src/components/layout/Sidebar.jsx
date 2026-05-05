import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Tags, 
  Settings, 
  ChevronLeft, 
  Wallet,
  ShieldCheck,
  BarChart3,
  X
} from 'lucide-react';
import { cn } from '../../services/utils';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ArrowLeftRight, label: 'Transações', path: '/transactions' },
  { icon: Tags, label: 'Categorias', path: '/categories' },
  { icon: BarChart3, label: 'Relatórios', path: '/reports' },
];

export function Sidebar({ isOpen, onClose }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 backdrop-blur-sm",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside 
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 h-screen border-r border-border bg-card flex flex-col transition-all duration-300 shadow-2xl md:shadow-none",
          isCollapsed ? "w-20" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
              <Wallet size={20} />
            </div>
            {(!isCollapsed || isOpen) && (
              <span className="font-heading font-bold text-xl tracking-tight">Financeiro Pro</span>
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon size={20} />
              {(!isCollapsed || isOpen) && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}

          <div className="h-px bg-border my-2 mx-3" />
          
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              onClick={() => onClose()}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <ShieldCheck size={20} />
              {(!isCollapsed || isOpen) && <span className="font-medium">Painel Admin</span>}
            </NavLink>
          )}

          <NavLink
            to="/settings"
            onClick={() => onClose()}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings size={20} />
            {(!isCollapsed || isOpen) && <span className="font-medium">Configurações</span>}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-border hidden md:block">
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
    </>
  );
}
