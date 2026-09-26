import type { ComponentType } from "react";
import { expertise } from "@/lib/site";
import {
  CloudIcon,
  ProductEngineeringIcon,
  SparkleIcon,
  SystemDesignIcon,
  UxUiIcon,
} from "./ui/ExpertiseIcons";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  "Product Engineering": ProductEngineeringIcon,
  "UX/UI Design": UxUiIcon,
  "System Design": SystemDesignIcon,
  "Cloud Infra": CloudIcon,
  "Applied AI": SparkleIcon,
};

/**
 * Capability areas with their one-line descriptions in view. They used to
 * hide behind hover tooltips, which kept the claim from anyone on touch and
 * made a reader work for the sentence that makes each label mean something.
 */
export function Expertise() {
  if (expertise.length === 0) return null;

  return (
    <ul className="grid gap-px overflow-hidden rounded-panel border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
      {expertise.map((item) => {
        const Icon = icons[item.label];
        return (
          <li key={item.label} className="flex gap-gutter bg-background p-gutter sm:block">
            {Icon && (
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-control-md border border-border bg-card text-muted-foreground">
                <Icon className="size-4" />
              </span>
            )}
            <div className="min-w-0">
              <p className="type-subheading text-foreground sm:mt-gutter">{item.label}</p>
              <p className="mt-1 type-caption text-subtle-foreground">{item.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
