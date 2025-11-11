import React, { useMemo } from "react";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GavelIcon from "@mui/icons-material/Gavel";
import GroupsIcon from "@mui/icons-material/Groups";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SchoolIcon from "@mui/icons-material/School";
import { SvgIconProps } from "@mui/material";

/**
 * Map of icon names to actual MUI icon components
 * Add more icons here as needed for agreements
 */
const ICON_MAP: Record<string, React.ComponentType<SvgIconProps>> = {
  PrivacyTip: PrivacyTipIcon,
  School: SchoolIcon,
  Gavel: GavelIcon,
  CameraAlt: CameraAltIcon,
  Groups: GroupsIcon,
  CheckCircle: CheckCircleIcon,
  // Fallback icon
  HelpOutline: HelpOutlineIcon,
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
