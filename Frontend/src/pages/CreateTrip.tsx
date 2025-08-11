import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "1",
    description: "",
    tripType: "leisure"
  });

  // In a real application, you would get the user ID from authentication context
  // For now, we'll use a placeholder user ID
  const userId = "placeholder-user-id";
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Format the trip data to match the backend model
      const tripData = {
        trip_name: formData.tripName,
        user_id: userId,
        travel_dates: `${formData.startDate} to ${formData.endDate}`,
        description: formData.description,
        city: formData.destination.split(',')[0]?.trim() || formData.destination,
        country: formData.destination.split(',').slice(1).join(',').trim() || "Unknown",
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        travelers: parseInt(formData.travelers) || 1,
        trip_type: formData.tripType
      };

      // Save trip to backend
      await apiService.createTrip(tripData);
      
      toast.success("Trip created successfully!", {
        description: "Your new trip has been added to your dashboard."
      });
      
      // Navigate back to dashboard
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
                <Label htmlFor="tripName" className="text-sm font-medium text-gray-700">Trip Name</Label>
                <Input
                  id="tripName"
                  name="tripName"
                  placeholder="e.g., Summer Adventure in Europe"
                  value={formData.tripName}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium text-gray-700">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  placeholder="e.g., Paris, France"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
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
                <Label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget (USD)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-sm font-medium text-gray-700">Number of Travelers</Label>
                <Input
                  id="travelers"
                  name="travelers"
                  type="number"
                  min="1"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tripType" className="text-sm font-medium text-gray-700">Trip Type</Label>
                <select
                  id="tripType"
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="leisure">Leisure</option>
                  <option value="business">Business</option>
                  <option value="adventure">Adventure</option>
                  <option value="cultural">Cultural</option>
                  <option value="romantic">Romantic</option>
                  <option value="family">Family</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
              <p className="text-gray-600">Any special notes or preferences?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Trip Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your trip, special requirements, or preferences..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {/* Trip Summary */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Trip Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Trip Name:</span> {formData.tripName || "Not specified"}</div>
                  <div><span className="font-medium">Destination:</span> {formData.destination || "Not specified"}</div>
                  <div><span className="font-medium">Dates:</span> {formData.startDate && formData.endDate ? `${formData.startDate} to ${formData.endDate}` : "Not specified"}</div>
                  <div><span className="font-medium">Budget:</span> {formData.budget ? `$${formData.budget}` : "Not specified"}</div>
                  <div><span className="font-medium">Travelers:</span> {formData.travelers}</div>
                  <div><span className="font-medium">Type:</span> {formData.tripType}</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create a New Trip</h1>
          <p className="text-lg text-gray-600">Plan your perfect adventure in just a few steps</p>
        </div>

        {/* Progress Bar */}
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

        {/* Form Card */}
        <Card className="max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="text-center">
              <div className="text-sm text-blue-600 font-medium">Step {currentStep} of {totalSteps}</div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-2"
                >
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700"
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
  );
};

export default CreateTrip;
