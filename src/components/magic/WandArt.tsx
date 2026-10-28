import { wandMarkup, type WandId } from "@/lib/magic/wands";

/** A wand drawn horizontally, tip on the left. The artwork lives in lib/magic/wands.ts so the cursor shares it. */
export function WandArt({ id, className = "h-6 w-full" }: { id: WandId; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 20"
      aria-hidden
      className={className}
      // Static markup authored in lib/magic/wands.ts; no user input reaches it.
      dangerouslySetInnerHTML={{ __html: wandMarkup[id] }}
    />
  );
}
