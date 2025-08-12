import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, DollarSign, Eye, MapPin, Plane, X, Clock, Users } from 'lucide-react';
import { apiService, type Trip } from '@/services/api';
import { toast } from 'sonner';
import SEO from '@/components/Seo';

interface TripWithStatus extends Trip {
  status: 'upcoming' | 'ongoing' | 'past';
}

// Simple Badge component
const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

const TripsView: React.FC = () => {
  const [trips, setTrips] = useState<TripWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<TripWithStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [itinerary, setItinerary] = useState<any>(null);
  const [stops, setStops] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchItinerary = async (tripId: string) => {
    try {
      setLoadingItinerary(true);
      console.log('🎯 Fetching itinerary for trip:', tripId);
      
      // Get all itineraries and find the one for this trip
      const allItineraries = await apiService.getAllItineraries();
      const tripItinerary = allItineraries.find((itin: any) => itin.trip_id === tripId);
      
      if (tripItinerary) {
        setItinerary(tripItinerary);
        console.log('✅ Found itinerary:', tripItinerary);
        
        // Get all stops and filter by itinerary_id
        const allStops = await apiService.getAllStops();
        const itineraryStops = allStops.filter((stop: any) => stop.itinerary_id === tripItinerary.itinerary_id);
        setStops(itineraryStops);
        console.log('✅ Found stops:', itineraryStops);
        
        // Get all activities and filter by stop_ids
        const allActivities = await apiService.getAllActivities();
        const stopIds = itineraryStops.map((stop: any) => stop.stop_id);
        const itineraryActivities = allActivities.filter((activity: any) => 
          stopIds.includes(activity.stop_id)
        );
        setActivities(itineraryActivities);
        console.log('✅ Found activities:', itineraryActivities);
        
        setShowItinerary(true);
        toast.success('Itinerary loaded successfully!');
      } else {
        toast.info('No itinerary found for this trip');
        setItinerary(null);
        setStops([]);
        setActivities([]);
      }
    } catch (error) {
      console.error('❌ Error fetching itinerary:', error);
      toast.error('Failed to load itinerary');
    } finally {
      setLoadingItinerary(false);
    }
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching trips from backend...');
      
      const fetchedTrips = await apiService.getAllTrips();
      console.log('✅ Fetched trips:', fetchedTrips);
      
      // Add status based on travel dates
      const tripsWithStatus: TripWithStatus[] = fetchedTrips.map(trip => {
        // Parse travel_dates string (assuming format like "2024-07-15 to 2024-07-25" or similar)
        const dates = trip.travel_dates.split(' to ');
        const startDate = dates[0] ? new Date(dates[0]) : new Date();
        const endDate = dates[1] ? new Date(dates[1]) : new Date();
        const now = new Date();
        
        let status: 'upcoming' | 'ongoing' | 'past';
        if (now < startDate) {
          status = 'upcoming';
        } else if (now >= startDate && now <= endDate) {
          status = 'ongoing';
        } else {
          status = 'past';
        }
        
        // Add computed start_date and end_date for display
        const tripWithDates = {
          ...trip,
          start_date: dates[0] || trip.travel_dates,
          end_date: dates[1] || trip.travel_dates,
          status
        };
        
        return tripWithDates;
      });
      
      setTrips(tripsWithStatus);
      toast.success(`Loaded ${tripsWithStatus.length} trips`);
    } catch (error) {
      console.error('❌ Error fetching trips:', error);
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'past': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterTripsByStatus = (status: 'upcoming' | 'ongoing' | 'past') => {
    return trips.filter(trip => trip.status === status);
  };

  const TripCard: React.FC<{ trip: TripWithStatus }> = ({ trip }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{trip.trip_name}</CardTitle>
          <Badge className={getStatusColor(trip.status)}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{trip.country}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="w-4 h-4" />
          <span>{trip.start_date && trip.end_date ? `${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}` : trip.travel_dates}</span>
        </div>
        
        {trip.budget && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>${trip.budget.toLocaleString()}</span>
          </div>
        )}
        
        {trip.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{trip.description}</p>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              setSelectedTrip(trip);
              setIsModalOpen(true);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState: React.FC<{ status: string }> = ({ status }) => (
    <div className="text-center py-12">
      <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No {status} trips</h3>
      <p className="text-gray-500">
        {status === 'upcoming' && "You don't have any upcoming trips planned."}
        {status === 'ongoing' && "You don't have any ongoing trips."}
        {status === 'past' && "You don't have any past trips."}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <SEO 
          title="My Trips - GlobeTrotter"
          description="View and manage your travel trips"
        />
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your trips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <SEO 
        title="My Trips - GlobeTrotter"
        description="View and manage your travel trips"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
          <p className="text-gray-600">Manage and view all your travel adventures</p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Upcoming</p>
                    <p className="text-xl font-semibold">{filterTripsByStatus('upcoming').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Plane className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ongoing</p>
                    <p className="text-xl font-semibold">{filterTripsByStatus('ongoing').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-xl font-semibold">{filterTripsByStatus('past').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Trips</p>
                    <p className="text-xl font-semibold">{trips.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trips Tabs */}
        <div className="w-full">
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
            <button
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({filterTripsByStatus('upcoming').length})
            </button>
            <button
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'ongoing'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('ongoing')}
            >
              Ongoing ({filterTripsByStatus('ongoing').length})
            </button>
            <button
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past ({filterTripsByStatus('past').length})
            </button>
          </div>
          
          {activeTab === 'upcoming' && (
            <div className="mt-6">
              {filterTripsByStatus('upcoming').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterTripsByStatus('upcoming').map((trip) => (
                    <TripCard key={trip.trip_id} trip={trip} />
                  ))}
                </div>
              ) : (
                <EmptyState status="upcoming" />
              )}
            </div>
          )}
          
          {activeTab === 'ongoing' && (
            <div className="mt-6">
              {filterTripsByStatus('ongoing').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterTripsByStatus('ongoing').map((trip) => (
                    <TripCard key={trip.trip_id} trip={trip} />
                  ))}
                </div>
              ) : (
                <EmptyState status="ongoing" />
              )}
            </div>
          )}
          
          {activeTab === 'past' && (
            <div className="mt-6">
              {filterTripsByStatus('past').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterTripsByStatus('past').map((trip) => (
                    <TripCard key={trip.trip_id} trip={trip} />
                  ))}
                </div>
              ) : (
                <EmptyState status="past" />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Trip Details Modal */}
      {isModalOpen && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedTrip.trip_name}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Destination</h4>
                    <p className="text-sm">{selectedTrip.country}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Status</h4>
                    <Badge className={getStatusColor(selectedTrip.status)}>
                      {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Travel Dates</h4>
                  <p className="text-sm">{selectedTrip.start_date && selectedTrip.end_date ? `${formatDate(selectedTrip.start_date)} - ${formatDate(selectedTrip.end_date)}` : selectedTrip.travel_dates}</p>
                </div>
                
                {selectedTrip.budget && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Budget</h4>
                    <p className="text-sm">${selectedTrip.budget.toLocaleString()}</p>
                  </div>
                )}
                
                {selectedTrip.description && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Description</h4>
                    <p className="text-sm">{selectedTrip.description}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Trip Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Trip ID: {selectedTrip.trip_id}</p>
                    <p>Created: {formatDate(selectedTrip.created_at || new Date().toISOString())}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="secondary" 
                  onClick={() => fetchItinerary(selectedTrip.trip_id!)}
                  disabled={loadingItinerary}
                >
                  {loadingItinerary ? 'Loading...' : 'View Itinerary'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowItinerary(false);
                    setItinerary(null);
                    setStops([]);
                    setActivities([]);
                  }}
                >
                  Close
                </Button>
              </div>
              
              {/* Itinerary Section */}
              {showItinerary && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-lg mb-4">Trip Itinerary</h4>
                  
                  {itinerary ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Itinerary Details</h5>
                        <p className="text-sm text-gray-600">Itinerary ID: {itinerary.itinerary_id}</p>
                        <p className="text-sm text-gray-600">Created: {formatDate(itinerary.createdAt)}</p>
                      </div>
                      
                      {stops.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-3">Planned Stops ({stops.length})</h5>
                          <div className="space-y-3">
                            {stops.map((stop: any) => {
                              const stopActivities = activities.filter((activity: any) => activity.stop_id === stop.stop_id);
                              return (
                                <div key={stop.stop_id} className="bg-blue-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <h6 className="font-medium text-sm">{stop.city}</h6>
                                    <span className="text-xs text-gray-500">
                                      {stop.start_date} to {stop.end_date}
                                    </span>
                                  </div>
                                  
                                  {stopActivities.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-600 mb-1">Activities ({stopActivities.length}):</p>
                                      <div className="space-y-1">
                                        {stopActivities.map((activity: any) => (
                                          <div key={activity.activity_id} className="bg-white p-2 rounded text-xs">
                                            <p className="font-medium">{activity.activity_name || 'Activity'}</p>
                                            {activity.description && (
                                              <p className="text-gray-600 mt-1">{activity.description}</p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {stops.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No stops planned for this itinerary yet.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No itinerary available for this trip.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsView;
