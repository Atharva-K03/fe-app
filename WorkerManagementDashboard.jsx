import React, { useState, useEffect } from 'react';
import { usePickup } from '../contexts/PickupContext'; // Reusing PickupContext for worker data
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Users, UserCheck, UserMinus, UserX } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerManagementDashboard = ({ onCreateWorker, onUpdateWorker }) => {
  const { workers, getWorkerName } = usePickup(); // Assuming workers are now managed here
  const [occupiedWorkers, setOccupiedWorkers] = useState(0);
  const [availableWorkers, setAvailableWorkers] = useState(0);
  const [absentWorkers, setAbsentWorkers] = useState(0);

  useEffect(() => {
    // Calculate worker statuses based on dummy data for now
    // In a real app, this would come from a backend or more complex logic
    const occupied = workers.filter(w => w.status === 'occupied').length;
    const available = workers.filter(w => w.status === 'available').length;
    const absent = workers.filter(w => w.status === 'absent').length;

    setOccupiedWorkers(occupied);
    setAvailableWorkers(available);
    setAbsentWorkers(absent);
  }, [workers]);

  const stats = [
    {
      title: 'Occupied Workers',
      value: occupiedWorkers,
      icon: UserX,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900'
    },
    {
      title: 'Available Workers',
      value: availableWorkers,
      icon: UserCheck,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Absent Workers',
      value: absentWorkers,
      icon: UserMinus,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ];

  return (
    <div className="p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
      >
        Worker Management
      </motion.h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <Button
          onClick={onCreateWorker}
          className="flex-1 h-12 text-lg text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Worker
        </Button>
        <Button
          onClick={onUpdateWorker}
          className="flex-1 h-12 text-lg text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-600 hover:bg-yellow-600"
        >
          <Edit className="h-5 w-5 mr-2" />
          Update Worker
        </Button>
      </motion.div>

      {/* Workers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>All Workers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone No.</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No workers found. Create a new worker to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    workers.map((worker) => (
                      <TableRow key={worker.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{worker.id}</TableCell>
                        <TableCell>{worker.name}</TableCell>
                        <TableCell>{worker.phone}</TableCell>
                        <TableCell>{worker.email}</TableCell>
                        <TableCell>{worker.roleId}</TableCell>
                        <TableCell>{worker.status}</TableCell>
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

export default WorkerManagementDashboard;

