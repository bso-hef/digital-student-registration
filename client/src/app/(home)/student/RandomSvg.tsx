"use client";

import React, { memo, useEffect, useState } from "react";

import { Box, styled } from "@mui/material";
import Image from "next/image";

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size?: string }>(({ size }) => ({
  width: size || "250px",
  height: size || "250px",
  position: "relative",
}));

const randomSvgs = [
  "/svg/certificate.svg",
  "/svg/exams.svg",
  "/svg/innovation.svg",
  "/svg/maths.svg",
  "/svg/professor.svg",
  "/svg/programmer.svg",
  "/svg/scrum.svg",
  "/svg/thesis.svg",
  "/svg/website.svg",
];

const RandomSvg = ({ size = "350px" }) => {
  const [randomSvg, setRandomSvg] = useState<string | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * randomSvgs.length);
    setRandomSvg(randomSvgs[randomIndex]);
  }, []);

  if (!randomSvg) return null;

  return (
    <StyledBox size={size}>
      <Image
        src={randomSvg}
        alt="Random SVG"
        fill
        style={{ objectFit: "contain" }}
      />
    </StyledBox>
  );
};

export default memo(RandomSvg);
