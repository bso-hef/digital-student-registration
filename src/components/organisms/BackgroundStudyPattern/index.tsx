import React, { useEffect, useMemo, useRef, useState } from "react";

import DocumentScannerRoundedIcon from "@mui/icons-material/DocumentScannerRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { Box, SvgIconProps, useTheme } from "@mui/material";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

interface IconProps {
  strokeWidth?: number;
}

type PatternIcon = React.ComponentType<IconProps>;

const isMuiIcon = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>,
): Icon is React.ComponentType<SvgIconProps> =>
  typeof (Icon as { muiName?: string }).muiName === "string";

const wrapMuiIcon = (MuiIcon: React.ComponentType<SvgIconProps>): PatternIcon =>
  function WrappedMuiIcon() {
    return (
      <MuiIcon style={{ width: "100%", height: "100%" }} fontSize="inherit" />
    );
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeIcons = (arr: Array<React.ComponentType<any>>): PatternIcon[] =>
  arr.map((I) => (isMuiIcon(I) ? wrapMuiIcon(I) : (I as PatternIcon)));

type BackgroundStudyPatternProps = {
  haveGradient?: boolean;
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
  haveGradient = true,
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

  const theme = useTheme();

  const IconSet = useMemo<PatternIcon[]>(() => {
    if (icons && icons.length) {
      return normalizeIcons(icons);
    }
    return [
      wrapMuiIcon(SchoolRoundedIcon),
      wrapMuiIcon(ModeOutlinedIcon),
      wrapMuiIcon(MenuBookRoundedIcon),
      wrapMuiIcon(DocumentScannerRoundedIcon),
      wrapMuiIcon(PushPinRoundedIcon),
    ];
  }, [icons]);

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
        background: haveGradient
          ? `linear-gradient(to bottom, ${gradient[0]} 0%, ${gradient[1]} 50%, ${gradient[2]} 100%)`
          : theme.palette.surface.interface.background,
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
