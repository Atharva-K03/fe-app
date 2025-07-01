import React, { useState } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Route, Clock, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const RouteManagementDashboard = ({ onCreateRoute, onUpdateRoute, onDeleteRoute }) => {
  const { routes, assignments } = usePickup();

  const totalRoutes = routes.length;
  const totalRoutesAssignedForAssignment = new Set(assignments.map(assignment => assignment.routeId)).size;
  const avgEstimatedTime = routes.length > 0 
    ? (routes.reduce((sum, route) => {
        const timeParts = route.estimatedTime.match(/(\d+)\s*(hour|minute)s?/);
        if (timeParts) {
          const value = parseInt(timeParts[1]);
          const unit = timeParts[2];
          return sum + (unit === 'hour' ? value * 60 : value);
        }
        return sum;
      }, 0) / routes.length).toFixed(0) + ' minutes'
    : 'N/A';

  const stats = [
    {
      title: 'Total Routes',
      value: totalRoutes,
      icon: Route,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Routes Assigned for Assignment',
      value: totalRoutesAssignedForAssignment,
      icon: ClipboardList,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Avg. Estimated Time',
      value: avgEstimatedTime,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
  ];

  return (
    <div className="p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Route Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
        <Button onClick={onCreateRoute} className="flex-1 h-12 text-lg text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Create Route
        </Button>
        <Button onClick={() => onUpdateRoute()} className="flex-1 h-12 text-lg text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-500 hover:bg-yellow-600">
          <Edit className="mr-2 h-4 w-4" /> Update Route
        </Button>
        <Button onClick={() => onDeleteRoute()} className="flex-1 h-12 text-lg text-white transition-all duration-200 hover:scale-105 bg-red-500 hover:bg-red-700">
          <Trash2 className="mr-2 h-4 w-4" /> Delete Route
        </Button>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route ID</TableHead>
                  <TableHead>Zone ID</TableHead>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Path Details</TableHead>
                  <TableHead>Avg. Est. Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No routes available.
                    </TableCell>
                  </TableRow>
                ) : (
                  routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>{route.id}</TableCell>
                      <TableCell>{route.zoneId}</TableCell>
                      <TableCell>{route.name}</TableCell>
                      <TableCell>{route.pathDetails}</TableCell>
                      <TableCell>{route.estimatedTime}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => onUpdateRoute(route.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => onDeleteRoute(route.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
  </div>
  );
};

export default RouteManagementDashboard;


