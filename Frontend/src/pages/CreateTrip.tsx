import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ItineraryBuilder, { type Stop } from "./Itinerary";

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    tripName: "",
    country: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "1",
    description: "",
    tripType: "leisure"
  });

  // In a real application, you would get the user ID from authentication context
  // For now, we'll use a valid user ID from the database
  const userId = "b42c2100-c448-43ca-9cfb-520e5ec45d50";
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [itineraryData, setItineraryData] = useState<Stop[]>([]);
  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleItinerarySave = (stops: Stop[]) => {
    setItineraryData(stops);
    setIsItineraryModalOpen(false);
    toast.success("Itinerary added to trip!", {
      description: `Added ${stops.length} stops to your trip.`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, create the trip
      const tripData = {
        trip_name: formData.tripName,
        user_id: userId,
        travel_dates: `${formData.startDate} to ${formData.endDate}`,
        description: formData.description,
        country: formData.country,
        city: formData.country, // Temporary dummy value using country as city
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        travelers: parseInt(formData.travelers) || 1,
        trip_type: formData.tripType
      };

      const createdTrip = await apiService.createTrip(tripData);
      
      // If there's itinerary data, create the itinerary and related stops/activities
      if (itineraryData.length > 0) {
        // Create itinerary for the trip
        const itinerary = await apiService.createItinerary({
          trip_id: createdTrip.trip_id!
        });

        // Create stops and activities
        for (const stop of itineraryData) {
          const createdStop = await apiService.createStop({
            itinerary_id: itinerary.itinerary_id!,
            city: stop.city,
            start_date: stop.startDate ? stop.startDate.toISOString().split('T')[0] : '',
            end_date: stop.endDate ? stop.endDate.toISOString().split('T')[0] : ''
          });

          // Create activities for this stop
          for (const activity of stop.activities) {
            await apiService.createActivity({
              stop_id: createdStop.stop_id!,
              description: activity.title,
              time: activity.time,
              notes: activity.notes
            });
          }
        }
      }
      
      toast.success("Trip created successfully!", {
        description: itineraryData.length > 0 
          ? `Your trip with ${itineraryData.length} stops has been created.`
          : "Your new trip has been added to your dashboard."
      });
      
      navigate("/");
    } catch (error) {
      toast.error("Failed to create trip", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Trip Information</h2>
              <p className="text-gray-600">Let's start with the essentials</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tripName">Trip Name</Label>
                <Input id="tripName" name="tripName" placeholder="e.g., Summer Adventure in Europe" value={formData.tripName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" placeholder="e.g., France" value={formData.country} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Details</h2>
              <p className="text-gray-600">Tell us more about your trip</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input id="budget" name="budget" type="number" placeholder="e.g., 2000" value={formData.budget} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Input id="travelers" name="travelers" type="number" min="1" value={formData.travelers} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Trip Description</Label>
              <Textarea id="description" name="description" placeholder="Describe your trip..." value={formData.description} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tripType">Trip Type</Label>
              <select id="tripType" name="tripType" value={formData.tripType} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                <option value="leisure">Leisure</option>
                <option value="business">Business</option>
                <option value="family">Family</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Review Your Trip</h2>
              <p className="text-gray-600">One last look before you save.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Summary</h3>
              <div className="space-y-2 text-gray-700">
                <div><span className="font-medium">Trip Name:</span> {formData.tripName || "N/A"}</div>
                <div><span className="font-medium">Country:</span> {formData.country || "N/A"}</div>
                <div><span className="font-medium">Dates:</span> {formData.startDate && formData.endDate ? `${formData.startDate} to ${formData.endDate}` : "N/A"}</div>
                <div><span className="font-medium">Budget:</span> {formData.budget ? `$${formData.budget}` : "N/A"}</div>
                <div><span className="font-medium">Travelers:</span> {formData.travelers}</div>
                <div><span className="font-medium">Type:</span> {formData.tripType}</div>
                <div><span className="font-medium">Itinerary:</span> {itineraryData.length > 0 ? `${itineraryData.length} stops planned` : "No itinerary added"}</div>
              </div>
            </div>
            {itineraryData.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
                <h4 className="text-md font-semibold text-blue-800 mb-2">Planned Stops</h4>
                <div className="space-y-1 text-blue-700">
                  {itineraryData.map((stop, index) => (
                    <div key={stop.id} className="text-sm">
                      {index + 1}. {stop.city} ({stop.activities.length} activities)
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 text-center">
              <Button type="button" variant="secondary" onClick={() => setIsItineraryModalOpen(true)}>
                {itineraryData.length > 0 ? "Edit Itinerary" : "Add Itinerary"}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isItineraryModalOpen} onOpenChange={setIsItineraryModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Itinerary Planner</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-6">
            <ItineraryBuilder onSave={handleItinerarySave} />
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create a New Trip</h1>
            <p className="text-lg text-gray-600">Plan your perfect adventure in just a few steps</p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-20 h-1 mx-2 ${
                        step < currentStep ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Basic Info</span>
              <span>Details</span>
              <span>Review</span>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="text-center">
                <div className="text-sm text-blue-600 font-medium">Step {currentStep} of {totalSteps}</div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                {renderStep()}
                
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create Trip
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreateTrip;
