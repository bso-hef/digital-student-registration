import { LANGUAGES, THEME } from "@/constants/general.constants";
import Brightness6RoundedIcon from "@mui/icons-material/Brightness6Rounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { TFunction } from "i18next";
import ReactCountryFlag from "react-country-flag";

export const applicationThemeOptions = (t: TFunction) => [
  {
    value: THEME.LIGHT,
    label: t("general.Light Theme"),
    leftIcon: <LightModeRoundedIcon />,
  },
  {
    value: THEME.DARK,
    label: t("general.Dark Theme"),
    leftIcon: <DarkModeRoundedIcon />,
  },
  {
    value: THEME.AUTO,
    label: t("general.System"),
    leftIcon: <Brightness6RoundedIcon />,
  },
];

export const appLanguageOptions = [
  {
    value: LANGUAGES.GERMAN.isoCode,
    label: "German",
    leftIcon: (
      <ReactCountryFlag
        countryCode="DE"
        title="DE"
        svg
        style={{
          width: "18px",
          height: "18px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
    ),
  },
  {
    value: LANGUAGES.ENGLISH.isoCode,
    label: "English",
    leftIcon: (
      <ReactCountryFlag
        countryCode="GB"
        title="EN"
        svg
        style={{
          width: "18px",
          height: "18px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
    ),
  },
];
