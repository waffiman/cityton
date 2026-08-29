import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware Link/router — swaps the `/en` prefix while preserving the
 * rest of the path, so the header's locale switcher lands on the same page
 * instead of always going to the locale's home. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
