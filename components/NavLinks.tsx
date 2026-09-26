"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { buttonVariants } from "./ui/button";

/**
 * Client only for the one thing a server component cannot know: which page
 * is open. Writing stays lit across every /blog route, so the nav says where
 * you are as well as where you can go.
 */
export function NavLinks({
  items,
  email,
}: {
  items: { label: string; href: string }[];
  email: string;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    !href.startsWith("/#") && href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`signal type-label-sm rounded-control-sm px-2 py-1.5 transition-colors duration-quick ${
              active ? "bg-gray-tint text-foreground" : "text-subtle-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <a
        href={`mailto:${email}`}
        // Through cn, not string concatenation: buttonVariants carries `inline-flex`,
        // and without a merge both display classes survive and stylesheet order
        // decides — which showed this button on mobile and pushed the nav wide.
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "ml-2 hidden sm:inline-flex")}
      >
        Get in touch
      </a>
    </nav>
  );
}
