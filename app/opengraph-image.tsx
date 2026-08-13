import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={site.role}
        title="Production software, end to end."
        footer={`${site.name} · ${site.location}`}
      />
    ),
    { ...size, fonts: ogFonts() },
  );
}
