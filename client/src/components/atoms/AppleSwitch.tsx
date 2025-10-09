import React, { forwardRef } from "react";

import { Switch, SwitchProps, styled } from "@mui/material";

const StyledSwitch = styled(Switch)(({ theme }) => {
  return {
    width: 50,
    height: 28,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "150ms",
      "&.Mui-checked": {
        transform: "translateX(22px)",
        color: theme.palette.text.contrast,
        backgroundImage: "unset",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.text.primary,
          opacity: 1,
          border: `1px solid ${theme.palette.border.seperator}`,
        },
      },
      "& .MuiSwitch-thumb": { boxShadow: "0 1px 2px rgba(0,0,0,.35)" },
    },
    "& .MuiSwitch-thumb": {
      width: 24,
      height: 24,
      color: theme.palette.text.contrast,
    },
    "& .MuiSwitch-track": {
      borderRadius: 14,
      backgroundColor: theme.palette.surface.interface.background,
      border: `1px solid ${theme.palette.border.seperator}`,
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 150,
      }),
    },
  };
});

const AppleSwitch = forwardRef<HTMLButtonElement, SwitchProps>(
  function AppleSwitch(
    {
      disableRipple = true,
      focusVisibleClassName = ".Mui-focusVisible",
      ...props
    },
    ref,
  ) {
    return (
      <StyledSwitch
        ref={ref}
        disableRipple={disableRipple}
        focusVisibleClassName={focusVisibleClassName}
        {...props}
      />
    );
  },
);

export default AppleSwitch;
