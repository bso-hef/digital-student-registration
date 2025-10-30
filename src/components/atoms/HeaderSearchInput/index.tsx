import React, { memo } from "react";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputAdornment, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

interface HeaderSearchInputProps
  extends React.ComponentProps<typeof TextField> {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}

const HeaderSearchInput: React.FC<HeaderSearchInputProps> = ({
  onChange,
  placeholder,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <TextField
      variant="outlined"
      inputProps={{
        style: { padding: "10px 16px 10px 0", fontSize: 14 },
      }}
      onChange={onChange}
      placeholder={placeholder || t("general.Search")}
      InputProps={{
        startAdornment: (
          <InputAdornment style={{ color: "#F4F6F8" }} position="start">
            <SearchRoundedIcon />
          </InputAdornment>
        ),
      }}
      {...otherProps}
    />
  );
};

export default memo(HeaderSearchInput);
