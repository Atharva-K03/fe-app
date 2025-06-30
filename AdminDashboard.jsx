import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Moon, Sun, LayoutDashboard, Users, Truck, MapPin, CalendarDays, Route, ClipboardList, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import WorkerManagementDashboard from './WorkerManagementDashboard';
import CreateWorker from './CreateWorker';
import UpdateWorker from './UpdateWorker';

import ZoneManagementDashboard from './ZoneManagementDashboard';
import CreateZone from './CreateZone';
import UpdateZone from './UpdateZone';
import DeleteZone from './DeleteZone';

const AdminDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [currentAdminView, setCurrentAdminView] = useState('adminDashboard'); // 'adminDashboard', 'workerManagement', 'createWorker', 'updateWorker', 'zoneManagement', 'createZone', 'updateZone', 'deleteZone'
  const [zoneToUpdateId, setZoneToUpdateId] = useState(null); // For updating a specific zone from table
  const [zoneToDeleteId, setZoneToDeleteId] = useState(null); // For deleting a specific zone from table

  const handleNavigation = (module) => {
    setCurrentAdminView(module);
    setIsMobileSidebarOpen(false); // Close mobile sidebar after navigation
    setZoneToUpdateId(null); // Clear any specific zone ID for update
    setZoneToDeleteId(null); // Clear any specific zone ID for delete
  };

  // Worker Management Handlers
  const handleCreateWorker = () => {
    setCurrentAdminView('createWorker');
  };

  const handleUpdateWorker = () => {
    setCurrentAdminView('updateWorker');
  };

  const handleWorkerSuccess = () => {
    setCurrentAdminView('workerManagement');
  };

  // Zone Management Handlers
  const handleCreateZone = () => {
    setCurrentAdminView('createZone');
  };

  const handleUpdateZone = (zoneId = null) => {
    setZoneToUpdateId(zoneId);
    setCurrentAdminView('updateZone');
  };

  const handleDeleteZone = (zoneId = null) => {
    setZoneToDeleteId(zoneId);
    setCurrentAdminView('deleteZone');
  };

  const handleZoneSuccess = () => {
    setCurrentAdminView('zoneManagement');
  };

  let content;
  switch (currentAdminView) {
    case 'workerManagement':
      content = (
        <WorkerManagementDashboard
          onCreateWorker={handleCreateWorker}
          onUpdateWorker={handleUpdateWorker}
        />
      );
      break;
    case 'createWorker':
      content = <CreateWorker onBack={() => setCurrentAdminView('workerManagement')} onSuccess={handleWorkerSuccess} />;
      break;
    case 'updateWorker':
      content = <UpdateWorker onBack={() => setCurrentAdminView('workerManagement')} onSuccess={handleWorkerSuccess} />;
      break;
    case 'zoneManagement':
      content = (
        <ZoneManagementDashboard
          onCreateZone={handleCreateZone}
          onUpdateZone={handleUpdateZone}
          onDeleteZone={handleDeleteZone}
        />
      );
      break;
    case 'createZone':
      content = <CreateZone onBack={() => setCurrentAdminView('zoneManagement')} onSuccess={handleZoneSuccess} />;
      break;
    case 'updateZone':
      content = <UpdateZone onBack={() => setCurrentAdminView('zoneManagement')} onSuccess={handleZoneSuccess} initialZoneId={zoneToUpdateId} />;
      break;
    case 'deleteZone':
      content = <DeleteZone onBack={() => setCurrentAdminView('zoneManagement')} onSuccess={handleZoneSuccess} initialZoneId={zoneToDeleteId} />;
      break;
    case 'adminDashboard':
    default:
      content = (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">Hello, Admin!</h2>
          <p className="text-xl text-muted-foreground">Your dashboard is coming soon.</p>
        </motion.div>
      );
      break;
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'adminDashboard' },
    { name: 'Worker', icon: Users, view: 'workerManagement' },
    { name: 'Zone', icon: MapPin, view: 'zoneManagement' },
    { name: 'Route', icon: Route, view: 'routeManagement' },
    { name: 'Vehicle', icon: Truck, view: 'vehicleManagement' },
    { name: 'Assignment', icon: ClipboardList, view: 'assignmentManagement' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-black-50 dark:from-gray-950 dark:to-gray-800">
      {/* Header */}
      <header className="bg-green-600 dark:bg-green-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* Hamburger menu for mobile and desktop sidebar toggle */}
              <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
                  <h2 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-400">Admin Menu</h2>
                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start text-lg"
                        onClick={() => handleNavigation(item.view)}
                      >
                        <item.icon className="mr-2 h-5 w-5" /> {item.name}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              
              {/* Desktop sidebar toggle button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
                className="hidden lg:block text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>

              <h1 className="text-2xl lg:text-3xl font-bold flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-white" />
                <span>WasteWise</span>
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="transition-all duration-200 hover:scale-105 text-gray-800 dark:text-white rounded-full h-8 w-8"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <Badge variant="secondary" className="bg-green-700 text-white/80">{user?.role}</Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="transition-all duration-200 hover:scale-105 text-gray-800 dark:text-white h-8 w-8"
              >
                <LogOut className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block ${isDesktopSidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-100 dark:bg-gray-900 p-4 shadow-lg min-h-[calc(100vh-64px)] transition-all duration-300 ease-in-out`}>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start text-lg"
                onClick={() => handleNavigation(item.view)}
              >
                <item.icon className={`${isDesktopSidebarCollapsed ? 'mx-auto' : 'mr-2'} h-5 w-5`} />
                {!isDesktopSidebarCollapsed && item.name}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {content}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
