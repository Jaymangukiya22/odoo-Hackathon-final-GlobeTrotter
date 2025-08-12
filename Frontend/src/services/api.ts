const API_BASE_URL = 'http://localhost:3001'; // Using working test server with real DB

export interface User {
  user_id?: string;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  city?: string;
  country?: string;
  additional_info?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Trip {
  trip_id?: string;
  trip_name: string;
  user_id: string;
  travel_dates: string; // Primary field used by backend
  start_date?: string; // Computed field for frontend use
  end_date?: string; // Computed field for frontend use
  description?: string;
  city: string;
  country: string;
  budget?: number;
  travelers?: number;
  trip_type?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string; // Keep for backward compatibility
  updatedAt?: string; // Keep for backward compatibility
}

export interface Itinerary {
  itinerary_id?: string;
  trip_id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Stop {
  stop_id?: string;
  itinerary_id: string;
  city?: string;
  start_date: string;
  end_date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  activity_id?: string;
  stop_id: string;
  description?: string;
  time?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Ensure endpoint starts with / and doesn't have double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;
    
    console.log('\n🔥 === FRONTEND API REQUEST ===');
    console.log('🎯 Making request to:', url);
    console.log('📋 Request method:', options.method || 'GET');
    console.log('📦 Request body:', options.body || 'No body');
    console.log('🔍 Request headers:', options.headers || 'Default headers');
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log('⚙️ Final config:', JSON.stringify(config, null, 2));

    try {
      console.log('📡 Sending request...');
      const response = await fetch(url, config);
      
      console.log('📨 Response received!');
      console.log('✅ Response status:', response.status);
      console.log('📋 Response headers:', response.headers);
      
      if (!response.ok) {
        console.log('❌ Response not OK!');
        const errorData = await response.json().catch(() => ({}));
        console.log('💥 Error data:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('📤 Response data:', JSON.stringify(responseData, null, 2));
      console.log('=== END FRONTEND API REQUEST ===\n');
      
      return responseData;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User CRUD operations
  async createUser(userData: Omit<User, 'user_id'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Trip CRUD operations
  async createTrip(tripData: Omit<Trip, 'trip_id'>): Promise<Trip> {
    return this.request<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async getAllTrips(): Promise<Trip[]> {
    return this.request<Trip[]>('/trips');
  }

  async getTripsByUserId(userId: string): Promise<Trip[]> {
    return this.request<Trip[]>(`/trips/user/${userId}`);
  }

  async getTripById(tripId: string): Promise<Trip> {
    return this.request<Trip>(`/trips/${tripId}`);
  }

  async updateTrip(tripId: string, tripData: Partial<Trip>): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(tripId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/trips/${tripId}`, {
      method: 'DELETE',
    });
  }

  // Test method for debugging
  async testConnection(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/test', {
      method: 'POST',
      body: JSON.stringify({ test: true }),
    });
  }

  // Itinerary CRUD operations
  async getAllItineraries(): Promise<Itinerary[]> {
    return this.request<Itinerary[]>('/itineraries');
  }

  async createItinerary(itineraryData: Omit<Itinerary, 'itinerary_id'>): Promise<Itinerary> {
    return this.request<Itinerary>('/itineraries', {
      method: 'POST',
      body: JSON.stringify(itineraryData),
    });
  }

  async getItineraryById(itineraryId: string): Promise<Itinerary> {
    return this.request<Itinerary>(`/itineraries/${itineraryId}`);
  }

  async updateItinerary(itineraryId: string, itineraryData: Partial<Itinerary>): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/itineraries/${itineraryId}`, {
      method: 'PUT',
      body: JSON.stringify(itineraryData),
    });
  }

  async deleteItinerary(itineraryId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/itineraries/${itineraryId}`, {
      method: 'DELETE',
    });
  }

  // Stop CRUD operations
  async getAllStops(): Promise<Stop[]> {
    return this.request<Stop[]>('/stops');
  }

  async createStop(stopData: Omit<Stop, 'stop_id'>): Promise<Stop> {
    return this.request<Stop>('/stops', {
      method: 'POST',
      body: JSON.stringify(stopData),
    });
  }

  async getStopById(stopId: string): Promise<Stop> {
    return this.request<Stop>(`/stops/${stopId}`);
  }

  async updateStop(stopId: string, stopData: Partial<Stop>): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/stops/${stopId}`, {
      method: 'PUT',
      body: JSON.stringify(stopData),
    });
  }

  async deleteStop(stopId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/stops/${stopId}`, {
      method: 'DELETE',
    });
  }

  // Activity CRUD operations
  async getAllActivities(): Promise<Activity[]> {
    return this.request<Activity[]>('/activities');
  }

  async createActivity(activityData: Omit<Activity, 'activity_id'>): Promise<Activity> {
    return this.request<Activity>('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async getActivityById(activityId: string): Promise<Activity> {
    return this.request<Activity>(`/activities/${activityId}`);
  }

  async updateActivity(activityId: string, activityData: Partial<Activity>): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/activities/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  }

  async deleteActivity(activityId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/activities/${activityId}`, {
      method: 'DELETE',
    });
  }

  // Authentication (placeholder - you can implement proper auth later)
  async login(loginData: LoginData): Promise<{ message: string; user?: User }> {
    // For now, this is a mock implementation
    // In a real app, you'd have proper authentication endpoints
    try {
      // Mock successful login
      return { message: 'Login successful' };
    } catch (error) {
      throw new Error('Login failed');
    }
  }
}

export const apiService = new ApiService();
