"use client";

import { MagicLayer } from "./MagicLayer";
import { MarauderMap } from "./MarauderMap";
import { SpellListener } from "./SpellListener";
import { Toasts } from "./Toasts";

/** Everything hidden and sparkly, mounted once for the whole page. */
export function MagicRoot() {
  return (
    <>
      <MagicLayer />
      <SpellListener />
      <Toasts />
      <MarauderMap />
    </>
  );
}
