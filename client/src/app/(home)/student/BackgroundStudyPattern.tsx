import React, { useEffect, useMemo, useRef, useState } from "react";

import { Box } from "@mui/material";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const strokeCommon = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

interface IconProps {
  strokeWidth?: number;
}

function BookIcon({ strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g stroke="currentColor" {...strokeCommon} strokeWidth={strokeWidth}>
        <path d="M6 14v36c9-5 17-5 26 0V14c-9-5-17-5-26 0Z" />
        <path d="M32 14v36c9-5 17-5 26 0V14c-9-5-17-5-26 0Z" />
        <path d="M12 22h10M12 28h10M12 34h10M12 40h10" />
        <path d="M38 22h10M38 28h10M38 34h10M38 40h10" />
      </g>
    </svg>
  );
}

function PencilIcon({ strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g stroke="currentColor" {...strokeCommon} strokeWidth={strokeWidth}>
        <path d="M12 52l8-2 28-28-6-6-28 28-2 8Z" />
        <path d="M42 10l6 6" />
        <path d="M20 50l-6-6" />
      </g>
    </svg>
  );
}

function DocIcon({ strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g stroke="currentColor" {...strokeCommon} strokeWidth={strokeWidth}>
        <path d="M14 10h24l12 12v32a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6Z" />
        <path d="M38 10v12h12" />
        <path d="M22 30h20M22 38h20M22 46h12" />
        <circle cx="46" cy="50" r="6" />
        <path d="M43 50l2 2 4-5" />
      </g>
    </svg>
  );
}

type BackgroundStudyPatternProps = {
  gradient?: [string, string, string];
  density?: number;
  minSize?: number;
  maxSize?: number;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
  rotate?: boolean;
  seed?: number;
  zIndex?: number;
  icons?: React.ComponentType<IconProps>[];
  className?: string;
  style?: React.CSSProperties;

  gapPx?: number;
  gapRatio?: number;
  maxIcons?: number;
  angleMaxDeg?: number;
};

interface Placement {
  Icon: React.ComponentType<IconProps>;
  size: number;
  leftPct: number;
  topPct: number;
  rot: number;
  key: number;
}

export default function BackgroundStudyPattern({
  gradient = ["#d8e0ff", "#c2ccff", "#aebdff"],
  density = 1.0,
  minSize = 56,
  maxSize = 140,
  opacity = 0.08,
  stroke = "#0f172a",
  strokeWidth = 2,
  rotate = true,
  seed = 1337,
  icons,
  className = "",
  gapPx = 12,
  gapRatio = 0.25,
  maxIcons = 16,
  angleMaxDeg = 25,
  style = {},
}: BackgroundStudyPatternProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ w: 0, h: 0 });

  const IconSet = useMemo(
    () => (icons && icons.length ? icons : [BookIcon, PencilIcon, DocIcon]),
    [icons],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setRect({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const targetCount = useMemo(() => {
    const base = (rect.w * rect.h) / 220000;
    const bp = rect.w < 480 ? 0.6 : rect.w < 900 ? 0.85 : 1;
    return Math.min(maxIcons, Math.max(3, Math.round(base * density * bp * 6)));
  }, [rect, density, maxIcons]);

  const collide = React.useCallback(
    (a: Placement, b: Placement, w: number, h: number) => {
      const ax = (a.leftPct / 100) * w;
      const ay = (a.topPct / 100) * h;
      const bx = (b.leftPct / 100) * w;
      const by = (b.topPct / 100) * h;
      const ra = a.size * 0.45;
      const rb = b.size * 0.45;
      const minDist =
        ra + rb + Math.max(gapPx, Math.min(a.size, b.size) * gapRatio);
      const dx = ax - bx;
      const dy = ay - by;
      return dx * dx + dy * dy < minDist * minDist;
    },
    [gapPx, gapRatio],
  );

  const placements: Placement[] = useMemo(() => {
    const rnd = mulberry32(seed);
    const items: Placement[] = [];
    const maxAttempts = targetCount * 25;

    for (
      let attempts = 0;
      attempts < maxAttempts && items.length < targetCount;
      attempts++
    ) {
      const Icon = IconSet[items.length % IconSet.length];

      const k = Math.min(1, Math.max(0.6, (rect.w + rect.h) / 2000));
      const size = Math.round(minSize + (maxSize - minSize) * rnd() * k);

      const padX = Math.max(16, size * 0.3);
      const padY = Math.max(16, size * 0.3);

      const leftPct =
        ((padX + (rect.w - padX * 2) * rnd()) / Math.max(rect.w, 1)) * 100;
      const topPct =
        ((padY + (rect.h - padY * 2) * rnd()) / Math.max(rect.h, 1)) * 100;

      const rot = rotate ? (rnd() * 2 - 1) * angleMaxDeg : 0;

      const candidate: Placement = {
        Icon,
        size,
        leftPct,
        topPct,
        rot,
        key: items.length,
      };

      let ok = true;
      for (let j = 0; j < items.length; j++) {
        if (collide(candidate, items[j], rect.w, rect.h)) {
          ok = false;
          break;
        }
      }
      if (ok) items.push(candidate);
    }
    return items;
  }, [
    IconSet,
    seed,
    rect.w,
    rect.h,
    minSize,
    maxSize,
    rotate,
    angleMaxDeg,
    targetCount,
    collide,
  ]);

  return (
    <Box
      ref={ref}
      className={className}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: `linear-gradient(to bottom, ${gradient[0]} 0%, ${gradient[1]} 50%, ${gradient[2]} 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        ...style,
      }}
      aria-hidden="true"
    >
      {placements.map(({ Icon, size, leftPct, topPct, rot, key }) => (
        <div
          key={key}
          style={{
            position: "absolute",
            left: `${leftPct}%`,
            top: `${topPct}%`,
            width: size,
            height: size,
            transform: `translate(-50%, -50%) rotate(${rot}deg)`,
            opacity,
            color: stroke,
            pointerEvents: "none",
            filter: "saturate(0.6)",
          }}
        >
          <Icon strokeWidth={strokeWidth} />
        </div>
      ))}
    </Box>
  );
}
