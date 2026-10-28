import type { ProjectCategory } from "@/lib/content/projects";

const paths: Record<ProjectCategory, string> = {
  // a phone
  Mobile: "M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3Zm3 15h2",
  // three linked nodes
  Networking: "M12 5.5a2 2 0 1 0 0 .01M5.5 17.5a2 2 0 1 0 0 .01M18.5 17.5a2 2 0 1 0 0 .01M12 7.5l-5.2 8.3M12 7.5l5.2 8.3M7.5 17.5h9",
  // a shield
  Security: "M12 3.5 5 6v5.5c0 4.2 2.9 7.3 7 9 4.1-1.7 7-4.8 7-9V6l-7-2.5Zm-2.5 8.2 2 2 3.2-3.6",
  // stacked servers
  Infrastructure: "M5 5h14v4.5H5ZM5 14.5h14V19H5ZM8 7.25h.01M8 16.75h.01M5 9.5v5M19 9.5v5",
};

type CategoryGlyphProps = {
  category: ProjectCategory;
  className?: string;
};

export function CategoryGlyph({ category, className = "size-5" }: CategoryGlyphProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[category]} />
    </svg>
  );
}
