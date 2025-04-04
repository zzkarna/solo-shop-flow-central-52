
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, FileText, ListTodo, NotebookPen, Search, Shield, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isOpen: boolean;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  
  const NavItem = ({ icon: Icon, label, href, isActive, isOpen }: NavItemProps) => {
    return (
      <Link to={href} className="block">
        <div
          className={cn(
            "flex items-center px-3 py-2 my-1 rounded-md group transition-colors",
            isActive 
              ? "bg-sidebar-primary text-sidebar-primary-foreground" 
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-3 whitespace-nowrap overflow-hidden"
            >
              {label}
            </motion.span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar h-full border-r border-border transition-all duration-300 ease-in-out",
        isOpen ? "w-52" : "w-16"
      )}
    >
      <div className="flex items-center justify-between h-16 px-3">
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 text-center font-semibold text-sidebar-foreground"
          >
            ShopFlow
          </motion.div>
        ) : (
          <div className="flex-1 text-center">
            <span className="text-xl font-bold text-sidebar-foreground">SF</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        <NavItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          href="/" 
          isActive={location.pathname === '/'} 
          isOpen={isOpen} 
        />
        <NavItem 
          icon={FileText} 
          label="Files" 
          href="/files" 
          isActive={location.pathname === '/files'} 
          isOpen={isOpen} 
        />
        <NavItem 
          icon={ListTodo} 
          label="Tasks" 
          href="/tasks" 
          isActive={location.pathname === '/tasks'} 
          isOpen={isOpen} 
        />
        <NavItem 
          icon={Calendar} 
          label="Calendar" 
          href="/calendar" 
          isActive={location.pathname === '/calendar'} 
          isOpen={isOpen} 
        />
        <NavItem 
          icon={NotebookPen} 
          label="Notes" 
          href="/notes" 
          isActive={location.pathname === '/notes'} 
          isOpen={isOpen} 
        />
        <NavItem 
          icon={Shield} 
          label="Compliance" 
          href="/compliance" 
          isActive={location.pathname === '/compliance'} 
          isOpen={isOpen} 
        />
      </nav>

      <div className="p-2 mt-auto">
        <div
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "transition-colors cursor-pointer"
          )}
        >
          <Search className="h-5 w-5 shrink-0" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-3 whitespace-nowrap"
            >
              Quick Search
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
