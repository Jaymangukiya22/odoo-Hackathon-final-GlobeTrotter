const API_BASE_URL = 'http://localhost:3000';

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
  travel_dates: string;
  description?: string;
  city: string;
  country: string;
  budget?: number;
  travelers?: number;
  trip_type?: string;
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
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

  // Authentication (placeholder - you can implement proper auth later)
  async login(loginData: LoginData): Promise<{ message: string; user?: User }> {
    // For now, this is a mock implementation
    // In a real app, you'd have proper authentication endpoints
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.email === loginData.email);
      
      if (user) {
        return { message: 'Login successful', user };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  }
}

export const apiService = new ApiService();
