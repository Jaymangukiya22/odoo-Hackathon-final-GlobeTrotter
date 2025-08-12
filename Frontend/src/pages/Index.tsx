import Seo from "../components/Seo";
import WelcomeHero from "../components/dashboard/WelcomeHero";
import SearchBar from "../components/dashboard/SearchBar";
import TripCard from "../components/dashboard/TripCard";
import BudgetHighlights from "../components/dashboard/BudgetHighlights";
import paris from "../assets/city-paris.jpg";
import tokyo from "../assets/city-tokyo.jpg";
import nyc from "../assets/city-nyc.jpg";
import bali from "../assets/city-bali.jpg";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "GlobeTrotter Dashboard",
    description: "Plan, track, and explore trips with GlobeTrotter.",
    applicationCategory: "TravelApplication",
    url: "/",
  };

  const handlePlan = () => {
    navigate("/create-trip");
  };

  const handleViewTrips = () => {
    navigate("/trips");
  };

  const recentTrips = [
    { title: "Spring in Paris", image: paris, alt: "Paris skyline with Eiffel Tower", date: "Apr 12–18", budget: "$1,450" },
    { title: "Tokyo Street Food", image: tokyo, alt: "Tokyo skyline with Tokyo Tower", date: "May 3–10", budget: "$2,200" },
    { title: "NYC Weekend", image: nyc, alt: "Manhattan skyline at sunset", date: "Jun 8–10", budget: "$620" },
  ];

  const recommendations = [
    { title: "Bali Retreat", image: bali, alt: "Tropical beach in Bali", budget: "from $900" },
    { title: "Paris Classics", image: paris, alt: "Eiffel Tower in Paris", budget: "from $1,100" },
    { title: "Tokyo Lights", image: tokyo, alt: "Tokyo skyline", budget: "from $1,600" },
    { title: "New York Icons", image: nyc, alt: "NYC skyline", budget: "from $700" },
  ];

  return (
    <>
      <Seo
        title="GlobeTrotter Dashboard — Plan trips smarter"
        description="Central hub for upcoming trips, recommended destinations, and budget highlights."
        canonical="/"
        jsonLd={jsonLd}
      />

      {/* Page content */}

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeHero onPlan={handlePlan} onViewTrips={handleViewTrips} />
        <SearchBar />

        <section aria-labelledby="recent" className="mt-6">
          <h2 id="recent" className="text-2xl font-bold tracking-tight mb-4">Your recent trips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentTrips.map((t) => (
              <TripCard key={t.title} {...t} ctaLabel="Open" href="#" />
            ))}
          </div>
        </section>

        <section id="recommended" aria-labelledby="destinations" className="mt-10">
          <h2 id="destinations" className="text-2xl font-bold tracking-tight mb-4">Recommended destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map((r) => (
              <TripCard key={r.title} {...r} ctaLabel="Explore" href="#" />
            ))}
          </div>
        </section>

        <BudgetHighlights />
      </main>
    </>
  );
};

export default Index;
