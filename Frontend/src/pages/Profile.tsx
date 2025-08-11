import { useState } from "react";
import paris from "@/assets/city-paris.jpg";
import tokyo from "@/assets/city-tokyo.jpg";
import nyc from "@/assets/city-nyc.jpg";
import bali from "@/assets/city-bali.jpg";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"preplanned" | "previous">("preplanned");

  // Sample data for trips
  const preplannedTrips = [
    { id: 1, title: "European Adventure", image: paris, budget: "$3,500", duration: "14 days" },
    { id: 2, title: "Asian Exploration", image: tokyo, budget: "$4,200", duration: "10 days" },
    { id: 3, title: "American Road Trip", image: nyc, budget: "$2,800", duration: "7 days" },
    { id: 4, title: "Tropical Getaway", image: bali, budget: "$1,900", duration: "5 days" },
  ];

  const previousTrips = [
    { id: 1, title: "Mediterranean Cruise", image: paris, budget: "$2,100", date: "June 2023" },
    { id: 2, title: "Mountain Hiking", image: tokyo, budget: "$1,200", date: "March 2023" },
    { id: 3, title: "City Break", image: nyc, budget: "$950", date: "January 2023" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="flex items-center mb-10 p-6 bg-white rounded-lg shadow">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl mr-6">
          JD
        </div>
        <div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-muted-foreground mb-2">john.doe@example.com</p>
          <p className="text-sm">Member since January 2023</p>
          <p className="text-sm">5 trips planned</p>
        </div>
      </div>

      {/* Trip Carousels */}
      <div className="mb-8">
        <div className="flex border-b mb-4">
          <button
            className={`pb-2 px-4 font-medium ${activeTab === "preplanned" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("preplanned")}
          >
            Preplanned Trips
          </button>
          <button
            className={`pb-2 px-4 font-medium ${activeTab === "previous" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("previous")}
          >
            Previous Trips
          </button>
        </div>

        {/* Carousel Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTab === "preplanned" ? (
            preplannedTrips.map((trip) => (
              <div key={trip.id} className="border rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={trip.image} 
                  alt={trip.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-1">{trip.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{trip.duration}</p>
                  <p className="font-semibold">{trip.budget}</p>
                </div>
              </div>
            ))
          ) : (
            previousTrips.map((trip) => (
              <div key={trip.id} className="border rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={trip.image} 
                  alt={trip.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-1">{trip.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{trip.date}</p>
                  <p className="font-semibold">{trip.budget}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
