import { ReactElement, ReactNode, memo } from "react";

import { Theme, Zoom, styled } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

const CustomTooltip = styled(
  ({ className, ...props }: TooltipProps & { biggerTooltip?: boolean }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
  { shouldForwardProp: (prop) => prop !== "biggerTooltip" },
)(({ theme, biggerTooltip }: { theme: Theme; biggerTooltip?: boolean }) => ({
  [`&[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]: {
    marginBottom: theme.spacing(1),
  },
  [`&[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
    marginTop: theme.spacing(1),
  },

  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.surface.button.hoverLight,
    backgroundImage: "unset",
    color: theme.palette.text.default,
    boxShadow: "none",
    fontSize: biggerTooltip ? 22 : 14,
    lineHeight: biggerTooltip ? "30px" : "20px",
    fontWeight: 500,
    fontFamily: "Inter",
    padding: biggerTooltip ? theme.spacing(0.5) : undefined,
  },

  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.surface.button.hoverLight,
  },
}));

interface ActionsTooltipProps extends Omit<TooltipProps, "title" | "children"> {
  children: ReactElement;
  title: ReactNode;
  withTransition?: boolean;
  biggerTooltip?: boolean;
}

const ActionsTooltip = ({
  children,
  arrow = true,
  title,
  placement,
  leaveDelay = 0,
  withTransition = true,
  open,
  biggerTooltip = false,
  ...otherProps
}: ActionsTooltipProps) => {
  const transitionProps = withTransition
    ? { TransitionComponent: Zoom, TransitionProps: { timeout: 300 } }
    : {};

  return (
    <CustomTooltip
      arrow={arrow}
      placement={placement}
      leaveDelay={leaveDelay}
      open={open}
      title={title}
      biggerTooltip={biggerTooltip}
      {...transitionProps}
      {...otherProps}
    >
      {children}
    </CustomTooltip>
  );
};

export default memo(ActionsTooltip);
