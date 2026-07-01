"use client";

import React, { useEffect, useRef, useState } from "react";

import { Box, Fade, styled } from "@mui/material";

const TRANSITION_CONFIG = {
  FADE_DURATION: 200,
  MIN_SKELETON_TIME: 400,
};

interface StepTransitionWrapperProps {
  currentStep: number;
  isSaving: boolean;
  onTransitionComplete?: () => void;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

const ContentWrapper = styled(Box)({
  width: "100%",
  height: "100%",
});

type TransitionPhase = "content" | "fading-out" | "skeleton" | "fading-in";

const StepTransitionWrapper: React.FC<StepTransitionWrapperProps> = ({
  currentStep,
  isSaving,
  onTransitionComplete,
  skeleton,
  children,
}) => {
  const [phase, setPhase] = useState<TransitionPhase>("content");
  const [displayedStep, setDisplayedStep] = useState(currentStep);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skeletonStartTimeRef = useRef<number>(0);
  const wasEverSaving = useRef(false);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fadeDuration = prefersReducedMotion
    ? 0
    : TRANSITION_CONFIG.FADE_DURATION;

  // Clear any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Handle transition start when save begins
  useEffect(() => {
    if (isSaving && phase === "content") {
      wasEverSaving.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- effect-driven transition state machine: starting the fade-out when a save begins cannot be derived during render
      setPhase("fading-out");
    }
  }, [isSaving, phase]);

  // Handle fading-out -> skeleton transition
  useEffect(() => {
    if (phase === "fading-out") {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        skeletonStartTimeRef.current = Date.now();
        setPhase("skeleton");
      }, fadeDuration);
    }
  }, [phase, fadeDuration]);

  // Handle skeleton phase - wait for save to complete AND minimum time
  useEffect(() => {
    if (phase === "skeleton" && !isSaving && wasEverSaving.current) {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      const elapsed = Date.now() - skeletonStartTimeRef.current;
      const remainingTime = Math.max(
        0,
        TRANSITION_CONFIG.MIN_SKELETON_TIME - elapsed,
      );

      transitionTimeoutRef.current = setTimeout(() => {
        setDisplayedStep(currentStep);
        setPhase("fading-in");
        wasEverSaving.current = false;
      }, remainingTime);
    }
  }, [phase, isSaving, currentStep]);

  // Handle fade-in completion
  useEffect(() => {
    if (phase === "fading-in") {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        setPhase("content");
        onTransitionComplete?.();
      }, fadeDuration);
    }
  }, [phase, fadeDuration, onTransitionComplete]);

  // Reset displayed step when not saving and step changes (for direct navigation)
  useEffect(() => {
    if (!isSaving && phase === "content" && currentStep !== displayedStep) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs displayed step to currentStep only for direct navigation (not mid-transition); deriving would bypass the transition machine
      setDisplayedStep(currentStep);
    }
  }, [currentStep, displayedStep, isSaving, phase]);

  const showSkeleton = phase === "skeleton";
  const isFadingOut = phase === "fading-out";

  return (
    <ContentWrapper>
      {showSkeleton ? (
        <Fade in={true} timeout={fadeDuration}>
          <Box sx={{ width: "100%", height: "100%" }}>{skeleton}</Box>
        </Fade>
      ) : (
        <Fade in={!isFadingOut} timeout={fadeDuration}>
          <Box sx={{ width: "100%", height: "100%" }}>{children}</Box>
        </Fade>
      )}
    </ContentWrapper>
  );
};

export default StepTransitionWrapper;
