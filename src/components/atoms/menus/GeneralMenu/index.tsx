import {
  Box,
  Fade,
  Menu,
  MenuItem,
  MenuProps,
  Typography,
  styled,
} from "@mui/material";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.surface.interface.base,
    backgroundImage: "unset",
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[2],
    padding: "0px",
  },
  "& .MuiList-root": {
    padding: "0px",
    borderRadius: theme.spacing(1),
  },
}));

const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== "width",
})<{ width: string }>(({ theme, width }) => ({
  minWidth: 246,
  height: 50,
  maxHeight: 50,
  width: width || "100%",
  display: "flex",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.border.seperator}`,
  ":last-child": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: theme.palette.surface.button.hoverLight,
  },
  "&:active": {
    backgroundColor: theme.palette.surface.button.focused,
  },
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  fontSize: 24,
  width: 24,
  height: 24,
  color: theme.palette.icon.secondary,
  lineHeight: 1,
  "& svg": {
    fontSize: 24,
    width: 24,
    height: 24,
    color: theme.palette.icon.secondary,
  },
}));

const StyledLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.default,
  fontSize: "18px !important",
  fontFamily: "Inter",
  fontWeight: 400,
  lineHeight: "24px",
  flexGrow: 1,
  textAlign: "left",
  marginLeft: theme.spacing(1),
}));
interface GeneralMenuProps extends MenuProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  autoFocus?: boolean;
  withTransition?: boolean;
  width?: string;
  menuItems: {
    label: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }[];
}

const GeneralMenu: React.FC<GeneralMenuProps> = ({
  menuItems,
  open,
  onClose,
  anchorEl,
  autoFocus = true,
  withTransition = true,
  width = "246px",
  ...otherProps
}) => {
  const transitionProps = withTransition
    ? {
        slots: { transition: Fade },
        slotProps: { transition: { timeout: 300 } },
      }
    : {};

  const handleItemClick = (itemOnClick: () => void) => {
    itemOnClick();
    onClose();
  };

  const children = menuItems.flatMap((item, index) => {
    const itemElement = (
      <StyledMenuItem
        key={`menu-item-${index}`}
        onClick={() => handleItemClick(item.onClick)}
        disabled={item.disabled}
        width={width}
      >
        {item.startIcon && <StyledIcon>{item.startIcon}</StyledIcon>}
        <StyledLabel>{item.label}</StyledLabel>
        {item.endIcon && <StyledIcon>{item.endIcon}</StyledIcon>}
      </StyledMenuItem>
    );

    return itemElement;
  });

  return (
    <StyledMenu
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      autoFocus={autoFocus}
      disableAutoFocusItem
      {...transitionProps}
      {...otherProps}
    >
      {children}
    </StyledMenu>
  );
};

export default GeneralMenu;
