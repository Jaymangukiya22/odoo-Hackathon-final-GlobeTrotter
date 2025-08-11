import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TripCardProps {
  title: string;
  image: string;
  alt: string;
  date?: string;
  budget?: string;
  ctaLabel?: string;
  href?: string;
}

const TripCard = ({ title, image, alt, date, budget, ctaLabel = "View", href = "#" }: TripCardProps) => {
  return (
    <article className="h-full">
      <Card className="overflow-hidden hover:shadow-elevated-lg transition-shadow duration-300">
        <CardHeader className="p-0">
          <img src={image} alt={alt} loading="lazy" className="w-full h-40 object-cover" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-lg">{title}</CardTitle>
          {(date || budget) && (
            <p className="text-sm text-muted-foreground mt-1">
              {date && <span>{date}</span>}
              {date && budget && <span> • </span>}
              {budget && <span>Budget: {budget}</span>}
            </p>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <a className="text-sm text-primary hover:underline" href={href} aria-label={`${ctaLabel} ${title}`}>
            {ctaLabel}
          </a>
        </CardFooter>
      </Card>
    </article>
  );
};

export default TripCard;
