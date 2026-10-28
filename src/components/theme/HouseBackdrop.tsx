import type { CSSProperties } from "react";
import { HOUSES, houseScenes } from "@/lib/theme/houses";
import { AstroRing } from "./AstroRing";

/**
 * The stage behind the whole page. It is a plain server component with no state:
 *
 *  - Four photo layers exist, but each only receives its image while it is the active (or outgoing) house,
 *    through CSS rules keyed to <html data-bg> (see houses.css). The browser therefore downloads one house
 *    photograph at a time, and the first paint is correct without waiting for React.
 *  - The image paths come from `houseScenes`, the single source of truth, handed to CSS as variables.
 *  - Ambient light is switched per house with data-h, so inactive houses cost nothing.
 */
export function HouseBackdrop() {
  return (
    <div aria-hidden className="house-backdrop">
      {HOUSES.map((house) => {
        const { photo } = houseScenes[house];
        const style = {
          "--bg": `url("${photo.src}")`,
          "--bg-sm": `url("${photo.srcSm}")`,
          "--pos": photo.position,
        } as CSSProperties;
        return <div key={house} className="house-photo" data-for={house} style={style} />;
      })}

      <div className="house-grade" />

      <div className="amb amb-fire" data-h="gryffindor" />

      <div className="amb amb-caustic" data-h="slytherin">
        <i />
        <i />
      </div>

      <div className="amb amb-stars" data-h="ravenclaw">
        <AstroRing className="amb-astro" />
      </div>

      <div className="amb amb-shafts" data-h="hufflepuff">
        <i />
        <i />
        <i />
      </div>

      <div className="house-vignette" />
    </div>
  );
}
