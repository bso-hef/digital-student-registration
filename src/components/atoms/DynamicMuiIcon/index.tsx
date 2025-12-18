import React, { useMemo } from "react";

import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { SvgIconProps } from "@mui/material";

/**
 * Map of icon names to actual MUI icon components
 * Add more icons here as needed for agreements
 */
const ICON_MAP: Record<string, React.ComponentType<SvgIconProps>> = {
  PrivacyTip: PrivacyTipRoundedIcon,
  School: SchoolRoundedIcon,
  Gavel: GavelRoundedIcon,
  CameraAlt: CameraAltRoundedIcon,
  Groups: GroupsRoundedIcon,
  CheckCircle: CheckCircleRoundedIcon,
  // Fallback icon
  HelpOutline: HelpOutlineRoundedIcon,
};

interface DynamicMuiIconProps extends SvgIconProps {
  iconName?: string;
}

/**
 * Dynamically renders a MUI icon based on the icon name string
 * Used for agreements where admin can specify icon name
 *
 * @param {string} iconName - Name of the MUI icon (e.g., "PrivacyTip", "School")
 * @param {SvgIconProps} ...props - Additional props passed to the icon component
 * @returns {JSX.Element} Rendered icon or fallback icon if not found
 */
const DynamicMuiIcon: React.FC<DynamicMuiIconProps> = ({
  iconName,
  ...props
}) => {
  const IconComponent = useMemo(() => {
    if (!iconName || !ICON_MAP[iconName]) {
      // Fallback to question mark icon if icon not found
      return ICON_MAP.HelpOutline;
    }
    return ICON_MAP[iconName];
  }, [iconName]);

  return <IconComponent {...props} />;
};

export default DynamicMuiIcon;
