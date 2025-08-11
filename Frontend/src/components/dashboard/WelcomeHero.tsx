import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import hero from "@/assets/hero-travel.jpg";
import { useCallback } from "react";
import ProfileIcon from "./ProfileIcon";

const WelcomeHero = ({ onPlan }: { onPlan?: () => void }) => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--x", `${x}%`);
    e.currentTarget.style.setProperty("--y", `${y}%`);
  }, []);

  return (
    <section aria-labelledby="welcome" className="mb-10">
      <header className="mb-4 flex justify-between items-start">
        <div>
          <h1 id="welcome" className="text-3xl md:text-4xl font-extrabold tracking-tight">
            GlobeTrotter Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Plan, track, and get inspired for your next adventure.
          </p>
        </div>
        <div className="mt-2">
          <ProfileIcon />
        </div>
      </header>

      <Card className="overflow-hidden border-none shadow-elevated spotlight" onMouseMove={handleMouseMove}>
        <div className="relative">
          <img
            src={hero}
            alt="Illustrated world travel banner with iconic landmarks"
            loading="eager"
            className="w-full h-56 md:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-background/30 to-transparent" />
          <CardContent className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <p className="text-xl font-semibold">Let’s build your perfect trip</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="default" size="lg" className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl" onClick={onPlan}>Plan New Trip</Button>
                <Button variant="secondary" size="lg" asChild>
                  <a href="#recommended" aria-label="Explore recommended destinations">Explore Destinations</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
};

export default WelcomeHero;
