import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

interface StarRatingDisplayProps {
  average: number | null;
  count: number;
  className?: string;
}

export function StarRatingDisplay({ average, count, className }: StarRatingDisplayProps) {
  if (average === null || count === 0) return null;

  const fullStars = Math.floor(average);
  const hasHalf = average - fullStars >= 0.25 && average - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className={cn("flex items-center gap-1", className)}>
      <span className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`f${i}`} className="size-3.5 fill-amber-400 text-amber-400" />
        ))}
        {hasHalf && (
          <span className="relative inline-block size-3.5">
            <Star className="absolute inset-0 size-3.5 text-amber-400" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
            </span>
          </span>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`e${i}`} className="size-3.5 text-amber-400" />
        ))}
      </span>
      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
        {average.toFixed(1)}
      </span>
      <span className="text-xs text-muted-foreground">({count})</span>
    </span>
  );
}

interface StarRatingInputProps {
  value: number | null;
  onChange: (rating: number) => void;
  disabled?: boolean;
  className?: string;
}

export function StarRatingInput({ value, onChange, disabled, className }: StarRatingInputProps) {
  return (
    <span className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "size-6 transition-colors",
              value !== null && star <= value
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground hover:text-amber-400"
            )}
          />
        </button>
      ))}
    </span>
  );
}
