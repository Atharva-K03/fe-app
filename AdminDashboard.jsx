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

import VehicleManagementDashboard from './VehicleManagementDashboard';
import CreateVehicle from './CreateVehicle';
import UpdateVehicle from './UpdateVehicle';
import DeleteVehicle from './DeleteVehicle';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { logs, zones, vehicles, getWeeklySummary, getMonthlySummary, getZoneDailyCollections, getVehicleDailyWeight } = usePickup();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [currentAdminView, setCurrentAdminView] = useState('adminDashboard'); // 'adminDashboard', 'workerManagement', 'createWorker', 'updateWorker', 'zoneManagement', 'createZone', 'updateZone', 'deleteZone', 'routeManagement', 'createRoute', 'updateRoute', 'deleteRoute', 'vehicleManagement', 'createVehicle', 'updateVehicle', 'deleteVehicle'
  const [zoneToUpdateId, setZoneToUpdateId] = useState(null); // For updating a specific zone from table
  const [zoneToDeleteId, setZoneToDeleteId] = useState(null); // For deleting a specific zone from table
  const [routeToUpdateId, setRouteToUpdateId] = useState(null); // For updating a specific route from table
  const [routeToDeleteId, setRouteToDeleteId] = useState(null); // For deleting a specific route from table
  const [vehicleToUpdateId, setVehicleToUpdateId] = useState(null); // For updating a specific vehicle from table
  const [vehicleToDeleteId, setVehicleToDeleteId] = useState(null); // For deleting a specific vehicle from table

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
    setVehicleToUpdateId(null); // Clear any specific vehicle ID for update
    setVehicleToDeleteId(null); // Clear any specific vehicle ID for delete
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

  // Vehicle Management Handlers
  const handleCreateVehicle = () => {
    setCurrentAdminView('createVehicle');
  };

  const handleUpdateVehicle = (vehicleId = null) => {
    setVehicleToUpdateId(vehicleId);
    setCurrentAdminView('updateVehicle');
  };

  const handleDeleteVehicle = (vehicleId = null) => {
    setVehicleToDeleteId(vehicleId);
    setCurrentAdminView('deleteVehicle');
  };

  const handleVehicleSuccess = () => {
    setCurrentAdminView('vehicleManagement');
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
    case 'vehicleManagement':
      content = (
        <VehicleManagementDashboard
          onBack={() => setCurrentAdminView('adminDashboard')}
          onCreateVehicle={handleCreateVehicle}
          onUpdateVehicle={handleUpdateVehicle}
          onDeleteVehicle={handleDeleteVehicle}
        />
      );
      break;
    case 'createVehicle':
      content = <CreateVehicle onBack={() => setCurrentAdminView('vehicleManagement')} onSuccess={handleVehicleSuccess} />;
      break;
    case 'updateVehicle':
      content = <UpdateVehicle onBack={() => setCurrentAdminView('vehicleManagement')} onSuccess={handleVehicleSuccess} vehicleId={vehicleToUpdateId} />;
      break;
    case 'deleteVehicle':
      content = <DeleteVehicle onBack={() => setCurrentAdminView('vehicleManagement')} onSuccess={handleVehicleSuccess} vehicleId={vehicleToDeleteId} />;
      break;
    case 'adminDashboard':
    default:
      content = (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-2 sm:p-4 lg:p-6 max-w-full overflow-hidden"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg w-full">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Weight Collected Weekly</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold">{weeklySummary.totalWeight} kg</p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0 ml-2">
                      <Weight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg w-full">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Collections Weekly</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold">{weeklySummary.totalCollections}</p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0 ml-2">
                      <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg w-full">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Collections Monthly</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold">{monthlySummary.totalCollections}</p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-full bg-purple-100 dark:bg-purple-900 flex-shrink-0 ml-2">
                      <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Log Report Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            {/* Log Report Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="w-full h-full flex flex-col">
                <CardHeader className="p-3 sm:p-4 lg:p-6 pb-1 sm:pb-2 lg:pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg">
                    <BarChart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Generate Log Report</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-2 sm:pt-3 lg:pt-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="logType" className="text-xs sm:text-sm font-medium">Report Type</Label>
                      <Select value={logType} onValueChange={setLogType}>
                        <SelectTrigger className="h-7 text-xs sm:text-sm">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zone">Zone Logs</SelectItem>
                          <SelectItem value="vehicle">Vehicle Logs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="selectId" className="text-xs sm:text-sm font-medium">{logType === 'zone' ? 'Zone ID' : 'Vehicle ID'}</Label>
                      <Select value={selectedId} onValueChange={setSelectedId}>
                        <SelectTrigger className="h-7 text-xs sm:text-sm">
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
                    <div className="space-y-1">
                      <Label htmlFor="startDate" className="text-xs sm:text-sm font-medium">Start Date</Label>
                      <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-7 text-xs sm:text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="endDate" className="text-xs sm:text-sm font-medium">End Date</Label>
                      <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-7 text-xs sm:text-sm" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={handleGenerateReport} className="w-full h-7 text-xs sm:text-sm">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Log Report Graphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Card className="w-full h-full flex flex-col">
                <CardHeader className="p-3 sm:p-4 lg:p-6 pb-1 sm:pb-2 lg:pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg">
                    <BarChart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Report Visualization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-2 sm:pt-3 lg:pt-3 flex-1 flex flex-col">
                  {zoneChartData && logType === 'zone' && (
                    <div className="flex-1 flex flex-col space-y-2">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold">Zone {selectedId} Daily Collections & Weight</h3>
                      <div className="flex-1 w-full overflow-hidden min-h-[200px]">
                        <Bar
                          data={zoneChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'top' },
                              title: { display: true, text: 'Daily Collections and Weight' }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {vehicleChartData && logType === 'vehicle' && (
                    <div className="flex-1 flex flex-col space-y-2">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold">Vehicle {selectedId} Daily Weight Collected</h3>
                      <div className="flex-1 w-full overflow-hidden min-h-[200px]">
                        <Bar
                          data={vehicleChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'top' },
                              title: { display: true, text: 'Daily Weight Collected' }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {!zoneChartData && !vehicleChartData && (
                    <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                      <p className="text-xs sm:text-sm">Select a report type and generate a report to see the visualization.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Logs Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="w-full">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Recent Collection Logs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-3 lg:p-6 sm:pt-0 lg:pt-0">
                <div className="overflow-x-auto w-full">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Zone ID</TableHead>
                        <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">Vehicle ID</TableHead>
                        <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden md:table-cell">Start Time</TableHead>
                        <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden lg:table-cell">End Time</TableHead>
                        <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Weight (kg)</TableHead>
                        <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
                            No recent logs available.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentLogs.map((log, index) => (
                          <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap font-medium">{log.zoneId}</TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden sm:table-cell">{log.vehicleId}</TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden md:table-cell">{format(new Date(log.collectionStartTime), 'MMM dd, yyyy, hh:mm a')}</TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden lg:table-cell">{log.collectionEndTime ? format(new Date(log.collectionEndTime), 'MMM dd, yyyy, hh:mm a') : 'N/A'}</TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">{log.weightCollected ?? 'N/A'}</TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
                              <Badge variant={log.status === 'Completed' ? 'success' : 'secondary'} className="text-xs">
                                {log.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile-friendly log cards for very small screens */}
                <div className="block sm:hidden mt-4">
                  {recentLogs.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground px-3">Log Details</h3>
                      {recentLogs.map((log, index) => (
                        <Card key={`mobile-${index}`} className="mx-3">
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm">Zone: {log.zoneId}</p>
                                  <p className="text-xs text-muted-foreground">Vehicle: {log.vehicleId}</p>
                                </div>
                                <Badge variant={log.status === 'Completed' ? 'success' : 'secondary'} className="text-xs ml-2">
                                  {log.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>⚖️ Weight: {log.weightCollected ?? 'N/A'} kg</p>
                                <p>🕐 Start: {format(new Date(log.collectionStartTime), 'MMM dd, hh:mm a')}</p>
                                {log.collectionEndTime && (
                                  <p>🕑 End: {format(new Date(log.collectionEndTime), 'MMM dd, hh:mm a')}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-black-50 dark:from-gray-950 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 dark:bg-green-800 text-white sticky top-0 z-40 shadow-md flex-shrink-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              {/* Hamburger Menu for Mobile */}
              <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="primary" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                    <Menu className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start text-sm sm:text-lg"
                        onClick={() => handleNavigation(item.view)}
                      >
                        <item.icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> {item.name}
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
                className="hidden lg:block text-white h-8 w-8 sm:h-10 sm:w-10"
              >
                <Menu className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>

              <div className="text-lg sm:text-2xl lg:text-3xl font-bold flex items-center space-x-2">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <span className="text-lg sm:text-2xl font-bold text-white-800 dark:text-white">WasteWise</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="transition-all duration-200 hover:scale-105 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full h-6 w-6 sm:h-8 sm:w-8"
              >
                {theme === 'light' ? <Moon className="h-3 w-3 sm:h-4 sm:w-4" /> : <Sun className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs sm:text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <Badge variant="secondary" className="bg-green-700 text-white/80 text-xs">{user?.role}</Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="transition-all duration-200 hover:scale-105 bg-green-100 dark:bg-green-900 text-green-600 dark:text-white-400 rounded-full h-6 w-6 sm:h-8 sm:w-8 p-0"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Fixed */}
        <aside className={`hidden lg:block ${isDesktopSidebarCollapsed ? 'w-16 sm:w-20' : 'w-48 sm:w-64'} bg-gray-100 dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out flex-shrink-0`}>
          <div className="h-full overflow-y-auto p-2 sm:p-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start text-sm sm:text-lg"
                  onClick={() => handleNavigation(item.view)}
                >
                  <item.icon className={`${isDesktopSidebarCollapsed ? 'mx-auto' : 'mr-2'} h-4 w-4 sm:h-5 sm:w-5`} />
                  {!isDesktopSidebarCollapsed && item.name}
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-2 sm:p-4 lg:p-8">
            {content}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

