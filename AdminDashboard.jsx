import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Moon, Sun, LayoutDashboard, Users, Truck, MapPin, CalendarDays, Route, ClipboardList, Leaf, BarChart, Weight, CalendarCheck, CalendarDays as CalendarDaysIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

import WorkerManagementDashboard from './WorkerManagementDashboard';
import CreateWorker from './CreateWorker';
import UpdateWorker from './UpdateWorker';

import ZoneManagementDashboard from './ZoneManagementDashboard';
import CreateZone from './CreateZone';
import UpdateZone from './UpdateZone';
import DeleteZone from './DeleteZone';

import RouteManagementDashboard from './RouteManagementDashboard';
import CreateRoute from './CreateRoute';
import UpdateRoute from './UpdateRoute';
import DeleteRoute from './DeleteRoute';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { logs, zones, vehicles, getWeeklySummary, getMonthlySummary, getZoneDailyCollections, getVehicleDailyWeight } = usePickup();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [currentAdminView, setCurrentAdminView] = useState('adminDashboard'); // 'adminDashboard', 'workerManagement', 'createWorker', 'updateWorker', 'zoneManagement', 'createZone', 'updateZone', 'deleteZone', 'routeManagement', 'createRoute', 'updateRoute', 'deleteRoute'
  const [zoneToUpdateId, setZoneToUpdateId] = useState(null); // For updating a specific zone from table
  const [zoneToDeleteId, setZoneToDeleteId] = useState(null); // For deleting a specific zone from table
  const [routeToUpdateId, setRouteToUpdateId] = useState(null); // For updating a specific route from table
  const [routeToDeleteId, setRouteToDeleteId] = useState(null); // For deleting a specific route from table

  // Log Report States
  const [logType, setLogType] = useState('zone'); // 'zone' or 'vehicle'
  const [selectedId, setSelectedId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [zoneChartData, setZoneChartData] = useState(null);
  const [vehicleChartData, setVehicleChartData] = useState(null);

  const handleNavigation = (module) => {
    setCurrentAdminView(module);
    setIsMobileSidebarOpen(false); // Close mobile sidebar after navigation
    setZoneToUpdateId(null); // Clear any specific zone ID for update
    setZoneToDeleteId(null); // Clear any specific zone ID for delete
    setRouteToUpdateId(null); // Clear any specific route ID for update
    setRouteToDeleteId(null); // Clear any specific route ID for delete
    // Reset log report states when navigating away from adminDashboard
    if (module !== 'adminDashboard') {
      setSelectedId('');
      setStartDate('');
      setEndDate('');
      setZoneChartData(null);
      setVehicleChartData(null);
    }
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

  // Route Management Handlers
  const handleCreateRoute = () => {
    setCurrentAdminView('createRoute');
  };

  const handleUpdateRoute = (routeId = null) => {
    setRouteToUpdateId(routeId);
    setCurrentAdminView('updateRoute');
  };

  const handleDeleteRoute = (routeId = null) => {
    setRouteToDeleteId(routeId);
    setCurrentAdminView('deleteRoute');
  };

  const handleRouteSuccess = () => {
    setCurrentAdminView('routeManagement');
  };

  // Log Report Handlers
  const handleGenerateReport = () => {
    if (!selectedId || !startDate || !endDate) {
      alert('Please select an ID, start date, and end date.');
      return;
    }

    if (logType === 'zone') {
      const data = getZoneDailyCollections(selectedId, startDate, endDate);
      setZoneChartData({
        labels: data.map(d => format(new Date(d.date), 'MMM dd')),
        datasets: [
          {
            label: 'Total Collections',
            data: data.map(d => d.collections),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
            label: 'Total Weight Collected (kg)',
            data: data.map(d => d.weight),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          },
        ],
      });
      setVehicleChartData(null); // Clear vehicle chart data
    } else if (logType === 'vehicle') {
      const data = getVehicleDailyWeight(selectedId, startDate, endDate);
      setVehicleChartData({
        labels: data.map(d => format(new Date(d.date), 'MMM dd')),
        datasets: [
          {
            label: 'Total Weight Collected (kg)',
            data: data.map(d => d.weight),
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
          },
        ],
      });
      setZoneChartData(null); // Clear zone chart data
    }
  };

  const weeklySummary = useMemo(() => getWeeklySummary(), [logs, getWeeklySummary]);
  const monthlySummary = useMemo(() => getMonthlySummary(), [logs, getMonthlySummary]);

  const recentLogs = useMemo(() => {
    // Sort logs by collectionStartTime in descending order and take the latest 10
    return [...logs].sort((a, b) => new Date(b.collectionStartTime) - new Date(a.collectionStartTime)).slice(0, 10);
  }, [logs]);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'adminDashboard' },
    { name: 'Worker', icon: Users, view: 'workerManagement' },
    { name: 'Zone', icon: MapPin, view: 'zoneManagement' },
    { name: 'Route', icon: Route, view: 'routeManagement' },
    { name: 'Vehicle', icon: Truck, view: 'vehicleManagement' }, // Assuming a future vehicle management
    { name: 'Assignment', icon: ClipboardList, view: 'assignmentManagement' }, // Assuming a future assignment management
  ];

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
    case 'routeManagement':
      content = (
        <RouteManagementDashboard
          onCreateRoute={handleCreateRoute}
          onUpdateRoute={handleUpdateRoute}
          onDeleteRoute={handleDeleteRoute}
        />
      );
      break;
    case 'createRoute':
      content = <CreateRoute onBack={() => setCurrentAdminView('routeManagement')} onSuccess={handleRouteSuccess} />;
      break;
    case 'updateRoute':
      content = <UpdateRoute onBack={() => setCurrentAdminView('routeManagement')} onSuccess={handleRouteSuccess} initialRouteId={routeToUpdateId} />;
      break;
    case 'deleteRoute':
      content = <DeleteRoute onBack={() => setCurrentAdminView('routeManagement')} onSuccess={handleRouteSuccess} initialRouteId={routeToDeleteId} />;
      break;
    case 'adminDashboard':
    default:
      content = (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-4"
        >
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Weight Collected Weekly</p>
                    <p className="text-2xl font-bold">{weeklySummary.totalWeight} kg</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Weight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Collections Weekly</p>
                    <p className="text-2xl font-bold">{weeklySummary.totalCollections}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                    <CalendarCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Collections Monthly</p>
                    <p className="text-2xl font-bold">{monthlySummary.totalCollections}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                    <CalendarDaysIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Log Report Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Log Report Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="h-5 w-5" />
                  <span>Generate Log Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logType">Report Type</Label>
                    <Select value={logType} onValueChange={setLogType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zone">Zone Logs</SelectItem>
                        <SelectItem value="vehicle">Vehicle Logs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="selectId">{logType === 'zone' ? 'Zone ID' : 'Vehicle ID'}</Label>
                    <Select value={selectedId} onValueChange={setSelectedId}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select a ${logType === 'zone' ? 'Zone' : 'Vehicle'} ID`} />
                      </SelectTrigger>
                      <SelectContent>
                        {(logType === 'zone' ? zones : vehicles).map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.id} - {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                  <Button onClick={handleGenerateReport} className="w-full">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Log Report Graphs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="h-5 w-5" />
                  <span>Report Visualization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {zoneChartData && logType === 'zone' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Zone {selectedId} Daily Collections & Weight</h3>
                    <Bar data={zoneChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Daily Collections and Weight' } } }} />
                  </div>
                )}
                {vehicleChartData && logType === 'vehicle' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Vehicle {selectedId} Daily Weight Collected</h3>
                    <Bar data={vehicleChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Daily Weight Collected' } } }} />
                  </div>
                )}
                {!zoneChartData && !vehicleChartData && (
                  <div className="text-center text-muted-foreground py-12">
                    <p>Select a report type and generate a report to see the visualization.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Recent Collection Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone ID</TableHead>
                      <TableHead>Vehicle ID</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Weight (kg)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No recent logs available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.zoneId}</TableCell>
                          <TableCell>{log.vehicleId}</TableCell>
                          <TableCell>{format(new Date(log.collectionStartTime), 'MMM dd, yyyy, hh:mm a')}</TableCell>
                          <TableCell>{log.collectionEndTime ? format(new Date(log.collectionEndTime), 'MMM dd, yyyy, hh:mm a') : 'N/A'}</TableCell>
                          <TableCell>{log.weightCollected ?? 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={log.status === 'Completed' ? 'success' : 'secondary'}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-black-50 dark:from-gray-950 dark:to-gray-800">
      {/* Header */}
      <header className="bg-green-600 dark:bg-green-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* Hamburger Menu for Mobile */}
              <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="primary" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
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

              {/* Hamburger Menu for Desktop */}
              <Button
                variant="primary"
                size="icon"
                onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
                className="hidden lg:block text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>

              <div className="text-2xl lg:text-3xl font-bold flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-white" />
                <span className="text-2xl font-bold text-white-800 dark:text-white">WasteWise</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="transition-all duration-200 hover:scale-105 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full h-8 w-8"
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
                  {/* <p className="text-sm font-medium">{user?.name}</p> */}
                  <Badge variant="secondary" className="bg-green-700 text-white/80">{user?.role}</Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="transition-all duration-200 hover:scale-105 bg-green-100 dark:bg-green-900 text-green-600 dark:text-white-400 rounded-full h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
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


