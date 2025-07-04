// API utility functions for WasteWise backend integration

const API_BASE_URL = 'http://localhost:8090';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/wastewise/login',
    LOGOUT: '/wastewise/logout',
    REFRESH: '/wastewise/refresh'
  },
  
  // Waste Collection Logs
  WASTE_LOGS: {
    START: '/wastewise/admin/wastelogs/start',
    END: '/wastewise/admin/wastelogs/end',
    ZONE_REPORTS: '/wastewise/admin/wastelogs/reports/zone',
    VEHICLE_REPORTS: '/wastewise/admin/wastelogs/reports/vehicle',
    WEEKLY_COLLECTIONS: '/wastewise/admin/wastelogs/reports/totalCollections/weekly',
    MONTHLY_COLLECTIONS: '/wastewise/admin/wastelogs/reports/totalCollections/monthly',
    WEEKLY_WEIGHT: '/wastewise/admin/wastelogs/reports/totalWeight/weekly',
    MONTHLY_WEIGHT: '/wastewise/admin/wastelogs/reports/totalWeight/monthly',
    RECENT_LOGS: '/wastewise/admin/wastelogs/reports/recentLogs'
  },
  
  // Vehicle Management
  VEHICLES: {
    BASE: '/wastewise/admin/vehicle-management',
    PICKUP_TRUCKS: '/wastewise/admin/vehicle-management/filter/pickuptruck',
    ROUTE_TRUCKS: '/wastewise/admin/vehicle-management/filter/routetruck'
  },
  
  // Zone Management
  ZONES: {
    CREATE: '/wastewise/admin/zones/create',
    UPDATE: '/wastewise/admin/zones/update',
    DELETE: '/wastewise/admin/zones/delete',
    LIST: '/wastewise/admin/zones/list',
    BASE: '/wastewise/admin/zones',
    EXISTS: '/wastewise/admin/zones/{zoneId}/exists',
    NAMES_AND_IDS: '/wastewise/admin/zones/namesandids'
  },
  
  // Worker Management
  WORKERS: {
    BASE: '/wastewise/admin/workers',
    BY_ROLE: '/wastewise/admin/workers/role/{roleId}',
    AVAILABLE: '/wastewise/admin/workers/available'
  },
  
  // Route Management
  ROUTES: {
    BASE: '/wastewise/admin/routes',
    BY_ZONE: '/wastewise/admin/routes/zone/{zoneId}'
  },
  
  // Assignment Management
  ASSIGNMENTS: {
    BASE: '/wastewise/admin/assignments',
    BY_ID: '/wastewise/admin/assignments/{assignmentId}'
  }
};

const TOKEN_KEY = 'token';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Create headers with auth token
const createHeaders = (additionalHeaders = {}) => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...additionalHeaders
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(options.headers),
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || data.error || data || 'Request failed',
        response: { data, status: response.status }
      };
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: (credentials) => apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  logout: () => apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST'
  })
};

// Waste Collection Logs API calls
export const wasteLogsAPI = {
  startCollection: (data) => apiRequest(API_ENDPOINTS.WASTE_LOGS.START, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  endCollection: (data) => apiRequest(API_ENDPOINTS.WASTE_LOGS.END, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  getZoneReports: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`${API_ENDPOINTS.WASTE_LOGS.ZONE_REPORTS}?${queryString}`);
  },
  
  getVehicleReports: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`${API_ENDPOINTS.WASTE_LOGS.VEHICLE_REPORTS}?${queryString}`);
  },
  
  getWeeklyCollections: () => apiRequest(API_ENDPOINTS.WASTE_LOGS.WEEKLY_COLLECTIONS),
  getMonthlyCollections: () => apiRequest(API_ENDPOINTS.WASTE_LOGS.MONTHLY_COLLECTIONS),
  getWeeklyWeight: () => apiRequest(API_ENDPOINTS.WASTE_LOGS.WEEKLY_WEIGHT),
  getMonthlyWeight: () => apiRequest(API_ENDPOINTS.WASTE_LOGS.MONTHLY_WEIGHT),
  
  getRecentLogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`${API_ENDPOINTS.WASTE_LOGS.RECENT_LOGS}?${queryString}`);
  }
};

// Vehicle Management API calls
export const vehiclesAPI = {
  getAll: () => apiRequest(API_ENDPOINTS.VEHICLES.BASE),
  
  getById: (id) => apiRequest(`${API_ENDPOINTS.VEHICLES.BASE}/${id}`),
  
  create: (data) => apiRequest(API_ENDPOINTS.VEHICLES.BASE, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: (id, data) => apiRequest(`${API_ENDPOINTS.VEHICLES.BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (id) => apiRequest(`${API_ENDPOINTS.VEHICLES.BASE}/${id}`, {
    method: 'DELETE'
  }),
  
  getPickupTrucks: () => apiRequest(API_ENDPOINTS.VEHICLES.PICKUP_TRUCKS),
  getRouteTrucks: () => apiRequest(API_ENDPOINTS.VEHICLES.ROUTE_TRUCKS)
};

// Zone Management API calls
export const zonesAPI = {
  getAll: () => apiRequest(API_ENDPOINTS.ZONES.LIST),
  
  getById: (id) => apiRequest(`${API_ENDPOINTS.ZONES.BASE}/${id}`),
  
  create: (data) => apiRequest(API_ENDPOINTS.ZONES.CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: (id, data) => apiRequest(`${API_ENDPOINTS.ZONES.UPDATE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (id) => apiRequest(`${API_ENDPOINTS.ZONES.DELETE}/${id}`, {
    method: 'DELETE'
  }),
  
  exists: (id) => apiRequest(API_ENDPOINTS.ZONES.EXISTS.replace('{zoneId}', id)),
  
  getNamesAndIds: () => apiRequest(API_ENDPOINTS.ZONES.NAMES_AND_IDS)
};

// Worker Management API calls
export const workersAPI = {
  getAll: () => apiRequest(API_ENDPOINTS.WORKERS.BASE),
  
  getById: (id) => apiRequest(`${API_ENDPOINTS.WORKERS.BASE}/${id}`),
  
  create: (data) => apiRequest(API_ENDPOINTS.WORKERS.BASE, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: (id, data) => apiRequest(`${API_ENDPOINTS.WORKERS.BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (id) => apiRequest(`${API_ENDPOINTS.WORKERS.BASE}/${id}`, {
    method: 'DELETE'
  }),
  
  getByRole: (roleId) => apiRequest(API_ENDPOINTS.WORKERS.BY_ROLE.replace('{roleId}', roleId)),
  
  getAvailable: () => apiRequest(API_ENDPOINTS.WORKERS.AVAILABLE)
};

// Route Management API calls
export const routesAPI = {
  getAll: () => apiRequest(API_ENDPOINTS.ROUTES.BASE),
  
  getById: (id) => apiRequest(`${API_ENDPOINTS.ROUTES.BASE}/${id}`),
  
  create: (data) => apiRequest(API_ENDPOINTS.ROUTES.BASE, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: (id, data) => apiRequest(`${API_ENDPOINTS.ROUTES.BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (id) => apiRequest(`${API_ENDPOINTS.ROUTES.BASE}/${id}`, {
    method: 'DELETE'
  }),
  
  getByZone: (zoneId) => apiRequest(API_ENDPOINTS.ROUTES.BY_ZONE.replace('{zoneId}', zoneId))
};

// Assignment Management API calls
export const assignmentsAPI = {
  getAll: () => apiRequest(API_ENDPOINTS.ASSIGNMENTS.BASE),
  
  getById: (id) => apiRequest(API_ENDPOINTS.ASSIGNMENTS.BY_ID.replace('{assignmentId}', id)),
  
  create: (data) => apiRequest(API_ENDPOINTS.ASSIGNMENTS.BASE, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: (id, data) => apiRequest(`${API_ENDPOINTS.ASSIGNMENTS.BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (id) => apiRequest(`${API_ENDPOINTS.ASSIGNMENTS.BASE}/${id}`, {
    method: 'DELETE'
  })
};

// Pickup Management API calls (Scheduler endpoints)
export const pickupsAPI = {
  getAll: () => apiRequest('/wastewise/scheduler/pickups'),
  
  getById: (id) => apiRequest(`/wastewise/scheduler/pickups/${id}`),
  
  create: (data) => apiRequest('/wastewise/scheduler/pickups', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: (id, data) => apiRequest(`/wastewise/scheduler/pickups/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (id) => apiRequest(`/wastewise/scheduler/pickups/${id}`, {
    method: 'DELETE'
  })
};

// Error handling utility
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Handle authentication errors
  if (error.status === 401) {
    clearAuthToken();
    localStorage.removeItem('currentUser');
    // Don't redirect immediately, let the error handler in errorHandler.js handle it
    return 'Session expired. Please login again.';
  }
  
  // Handle different error formats
  if (typeof error.message === 'string') {
    return error.message;
  }
  
  if (error.response?.data) {
    const data = error.response.data;
    
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message) {
      return data.message;
    }
    
    if (data.error) {
      return data.error;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Utility to check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Utility to set auth token
export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Utility to clear auth token
export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

