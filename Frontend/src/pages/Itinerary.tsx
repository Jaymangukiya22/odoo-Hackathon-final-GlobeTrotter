import React, { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

export interface Activity {
  id: string;
  title: string;
  time?: string;
  notes?: string;
}

export interface Stop {
  id: string;
  city: string;
  startDate?: Date;
  endDate?: Date;
  activities: Activity[];
}

interface ItineraryBuilderProps {
  onSave?: (stops: Stop[]) => void;
}

const featuredCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Lucknow",
  "Surat",
  "Ahmedabad",
  "Gandhinagar",
];

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const DateButton = ({ label, date }: { label: string; date?: Date }) => (
  <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground")}> 
    <CalendarIcon className="mr-2 h-4 w-4" />
    {date ? format(date, "PPP") : <span>{label}</span>}
  </Button>
);

const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ onSave }) => {
  const [stops, setStops] = useState<Stop[]>([]);

  const addStop = () => {
    setStops((s) => [
      ...s,
      { id: uid("stop"), city: "", activities: [], startDate: undefined, endDate: undefined },
    ]);
  };

  const removeStop = (id: string) => {
    setStops((s) => s.filter((t) => t.id !== id));
  };

  const moveStop = (id: string, dir: -1 | 1) => {
    setStops((s) => {
      const idx = s.findIndex((x) => x.id === id);
      if (idx < 0) return s;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= s.length) return s;
      const clone = [...s];
      const [item] = clone.splice(idx, 1);
      clone.splice(newIdx, 0, item);
      return clone;
    });
  };

  const updateStop = (id: string, patch: Partial<Stop>) => {
    setStops((s) => s.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const addActivity = (stopId: string) => {
    setStops((s) =>
      s.map((t) =>
        t.id === stopId
          ? {
              ...t,
              activities: [
                ...t.activities,
                { id: uid("act"), title: "", time: "", notes: "" },
              ],
            }
          : t
      )
    );
  };

  const updateActivity = (stopId: string, actId: string, patch: Partial<Activity>) => {
    setStops((s) =>
      s.map((t) =>
        t.id === stopId
          ? {
              ...t,
              activities: t.activities.map((a) => (a.id === actId ? { ...a, ...patch } : a)),
            }
          : t
      )
    );
  };

  const removeActivity = (stopId: string, actId: string) => {
    setStops((s) =>
      s.map((t) =>
        t.id === stopId
          ? { ...t, activities: t.activities.filter((a) => a.id !== actId) }
          : t
      )
    );
  };

  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Trip Itinerary",
      itemListElement: stops.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristAttraction",
          name: s.city || `Stop ${i + 1}`,
          startDate: s.startDate?.toISOString?.(),
          endDate: s.endDate?.toISOString?.(),
        },
      })),
    };
  }, [stops]);

  const save = () => {
    // Call the onSave callback if provided
    if (onSave) {
      onSave(stops);
      toast.success("Itinerary saved successfully!");
    } else {
      // Fallback for standalone usage
      console.log("itinerary", stops);
      toast.success("Itinerary data logged to console");
    }
  };

  return (
    <>
      <Seo
        title="Plan Trip Itinerary | GlobeTrotter"
        description="Add cities, pick dates, and assign activities for every stop. Build your trip day by day."
        canonical="/itinerary"
        jsonLd={jsonLd}
      />

      <main className="container py-8">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Plan Your Trip Itinerary</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Add stops, set travel dates, and plan activities. Reorder cities to shape the perfect route.
          </p>
        </header>

        <section aria-labelledby="builder" className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="default" onClick={addStop}>
              <Plus className="mr-2 h-4 w-4" /> Add Stop
            </Button>
            <Button variant="secondary" asChild>
              <a href="/">Back to Dashboard</a>
            </Button>
            <div className="ml-auto">
              <Button onClick={save}>Save Itinerary</Button>
            </div>
          </div>

          {stops.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                Start by adding your first stop.
              </CardContent>
            </Card>
          )}

          <ol className="space-y-4">
            {stops.map((stop, idx) => (
              <li key={stop.id} className="list-none">
                <Card className="overflow-hidden">
                  <CardHeader className="flex gap-3 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-sm font-medium select-none">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm text-muted-foreground">Stop {idx + 1}</p>
                        <p className="font-medium">{stop.city || "Select a city"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => moveStop(stop.id, -1)} disabled={idx === 0} aria-label="Move up">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => moveStop(stop.id, 1)} disabled={idx === stops.length - 1} aria-label="Move down">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removeStop(stop.id)} aria-label="Remove stop">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`city-${stop.id}`}>City</Label>
                        <Select
                          value={stop.city || undefined}
                          onValueChange={(v) => updateStop(stop.id, { city: v })}
                        >
                          <SelectTrigger id={`city-${stop.id}`} className="mt-1">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent>
                            {featuredCities.map((c) => (
                              <SelectItem value={c} key={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col">
                        <Label>Start date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="mt-1">
                              <DateButton label="Pick a date" date={stop.startDate} />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={stop.startDate}
                              onSelect={(d) => updateStop(stop.id, { startDate: d || undefined })}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex flex-col">
                        <Label>End date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="mt-1">
                              <DateButton label="Pick a date" date={stop.endDate} />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={stop.endDate}
                              onSelect={(d) => updateStop(stop.id, { endDate: d || undefined })}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Activities</Label>
                        <Button variant="outline" size="sm" onClick={() => addActivity(stop.id)}>
                          <Plus className="mr-2 h-4 w-4" /> Add Activity
                        </Button>
                      </div>

                      {stop.activities.length === 0 && (
                        <p className="text-sm text-muted-foreground">No activities yet. Add your first one.</p>
                      )}

                      <div className="space-y-3">
                        {stop.activities.map((a) => (
                          <div key={a.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                            <div className="md:col-span-4">
                              <Input
                                placeholder="Activity title (e.g., Louvre Museum)"
                                value={a.title}
                                onChange={(e) => updateActivity(stop.id, a.id, { title: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Input
                                placeholder="Time (e.g., 10:00)"
                                value={a.time || ""}
                                onChange={(e) => updateActivity(stop.id, a.id, { time: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-5">
                              <Textarea
                                placeholder="Notes"
                                value={a.notes || ""}
                                onChange={(e) => updateActivity(stop.id, a.id, { notes: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-1 flex">
                              <Button variant="outline" size="icon" className="ml-auto" onClick={() => removeActivity(stop.id, a.id)} aria-label="Remove activity">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </>
  );
};

export default ItineraryBuilder;
