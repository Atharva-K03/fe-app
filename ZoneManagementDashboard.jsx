import React, { useState } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, MapPin, Route, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ZoneManagementDashboard = ({ onCreateZone, onUpdateZone, onDeleteZone }) => {
  const { zones, routes, getRoutesByZoneId } = usePickup();

  const totalZones = zones.length;
  const zonesWithRoutes = new Set(routes.map(route => route.zoneId)).size;
  // This logic assumes unassigned routes are those that exist but are not linked to any zone.
  // If a route's zoneId is not found in the current zones list, it's considered unassigned.
  const unassignedRoutes = routes.filter(route => !zones.some(zone => zone.id === route.zoneId)).length;

  const stats = [
    {
      title: 'Total Zones',
      value: totalZones,
      icon: MapPin,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Zones with Routes',
      value: zonesWithRoutes,
      icon: Route,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Unassigned Routes',
      value: unassignedRoutes,
      icon: Activity,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
  ];

  return (
    <div className="p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"
      >
        Zone Management
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
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
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex justify-center mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
          <Button
            onClick={onCreateZone}
            className="flex-1 h-12 text-lg text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Zone
          </Button>
          <Button
            onClick={() => onUpdateZone(null)} // Pass null to indicate general update from button
            className="flex-1 h-12 text-lg text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-500 hover:bg-yellow-600"
          >
            <Edit className="h-5 w-5 mr-2" />
            Update Zone
          </Button>
          <Button
            onClick={() => onDeleteZone(null)} // Pass null to indicate general delete from button
            className="flex-1 h-12 text-lg text-white transition-all duration-200 hover:scale-105 bg-red-500 hover:bg-red-700"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Delete Zone
          </Button>
        </div>
      </motion.div>

      {/* Zones Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>All Zones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone ID</TableHead>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Area Coverage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No zones created yet. Create your first zone to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    zones.map((zone) => (
                      <TableRow key={zone.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{zone.id}</TableCell>
                        <TableCell>{zone.name}</TableCell>
                        <TableCell>{zone.areaCoverage}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateZone(zone.id)} // Pass zone ID for direct update
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteZone(zone.id)} // Pass zone ID for direct delete
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

export default ZoneManagementDashboard;
