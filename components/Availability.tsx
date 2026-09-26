import { site } from "@/lib/site";
import { Status } from "./ui/status";

/** Open for work, as a state: Minima's success chip with a live dot. */
export function Availability() {
  const { open, label } = site.availability;
  if (!open) return null;

  return (
    <Status tone="success" dot className="max-w-full whitespace-normal">
      {label}
    </Status>
  );
}
