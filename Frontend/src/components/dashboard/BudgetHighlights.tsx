import { Card, CardContent } from "@/components/ui/card";
import { Wallet, CalendarDays, PiggyBank } from "lucide-react";

const BudgetHighlights = () => {
  const items = [
    { icon: Wallet, label: "Total Budget", value: "$4,250" },
    { icon: CalendarDays, label: "Upcoming Spend", value: "$1,180" },
    { icon: PiggyBank, label: "Saved vs Plan", value: "$310" },
  ];

  return (
    <section aria-labelledby="budget" className="mt-10">
      <h2 id="budget" className="text-2xl font-bold tracking-tight mb-4">Budget highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="glass-panel hover:shadow-elevated transition-shadow">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="p-3 rounded-full bg-accent">
                <Icon className="text-foreground/80" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-semibold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BudgetHighlights;