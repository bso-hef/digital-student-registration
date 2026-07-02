import React, { useEffect, useState } from "react";

import { NO_AVATAR_FOUND } from "@/constants/general.constants";
import { getAvatarFullURL } from "@/utils/general.utils";
import { userInitials } from "@/utils/string.utils";
import { Avatar, styled } from "@mui/material";
import NextImage from "next/image";

const StyledAvatar = styled(Avatar)<{ width?: number; height?: number }>(
  ({ theme, width, height }) => ({
    width: width || 200,
    height: height || 200,
    objectFit: "cover",
    borderRadius: "50% !important",
    background: theme.palette.surface.interface.background,
    color: theme.palette.text.default,
  }),
);

const StyledAvatarImage = styled(NextImage)<{
  width?: number;
  height?: number;
}>(({ theme, width, height }) => ({
  width: width || 200,
  height: height || 200,
  objectFit: "cover",
  borderRadius: "50% !important",
  background: theme.palette.surface.interface.background,
  color: theme.palette.text.default,
}));

interface ProfileAvatarProps {
  avatar?: string | null;
  clickAction?: React.MouseEventHandler<HTMLImageElement | HTMLDivElement>;
  size?: number;
  loading?: "eager" | "lazy";
  initialsFallback?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatar,
  clickAction,
  size,
  loading = "lazy",
  initialsFallback,
}) => {
  const [isImageValid, setIsImageValid] = useState(false);

  const imageUrl = avatar ? getAvatarFullURL(avatar) : null;

  useEffect(() => {
    if (!imageUrl) {
      // No URL to validate. The valid-image branch below is also gated on
      // imageUrl, so an explicit synchronous reset here is unnecessary.
      return;
    }

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsImageValid(true);
    img.onerror = () => setIsImageValid(false);
  }, [imageUrl]);

  if (isImageValid && imageUrl) {
    return (
      <StyledAvatarImage
        alt="avatar"
        onClick={clickAction}
        src={imageUrl ?? NO_AVATAR_FOUND}
        loading={loading}
        width={size}
        height={size}
      />
    );
  }

  if (initialsFallback) {
    return (
      <StyledAvatar width={size} height={size}>
        {userInitials(initialsFallback, "")}
      </StyledAvatar>
    );
  }

  return (
    <StyledAvatarImage
      alt="avatar"
      onClick={clickAction}
      src={NO_AVATAR_FOUND}
      loading={loading}
      width={size}
      height={size}
    />
  );
};

export default ProfileAvatar;
