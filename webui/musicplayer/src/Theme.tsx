import { createLightTheme, createDarkTheme } from "baseui/themes";

export const BaseUIDarktheme = createDarkTheme(
  {
    primaryFontFamily: "RockfordSansRegular",
  },
  {
    colors: {
      buttonPrimaryFill: "#ab28fc",
      buttonPrimaryText: "#fff",
      buttonPrimaryHover: "#ab28fcbe",
      buttonSecondaryFill: "rgba(171, 40, 252, 0.052)",
      buttonSecondaryText: "#ab28fc",
      buttonSecondaryHover: "rgba(171, 40, 252, 0.107)",
      buttonTertiaryText: "#fff",
      buttonTertiaryFill: "#000",
      buttonTertiaryHover: "#0000009700044",
    },
  }
);

export const BaseUILighttheme = createLightTheme(
  {
    primaryFontFamily: "RockfordSansRegular",
  },
  {
    colors: {
      buttonPrimaryFill: "#ab28fc",
      buttonPrimaryHover: "#ab28fcbe",
      buttonSecondaryFill: "rgba(171, 40, 252, 0.052)",
      buttonSecondaryText: "#ab28fc",
      buttonSecondaryHover: "rgba(171, 40, 252, 0.107)",
      buttonTertiaryText: "#fff",
      buttonTertiaryFill: "#000",
      buttonTertiaryHover: "#0000009700044",
    },
  }
);

export const LightTheme = {
  colors: {
    text: "#000",
    background: "#fff",
    icon: "#000",
    searchBackground: "#fff",
    secondaryBackground: "#fbf5ff",
    secondaryText: "rgba(0, 0, 0, 0.542)",
    backButton: "#f7f7f8",
    currentTrackBorder: "rgba(177, 178, 181, 0.25)",
    popoverBackground: "#fff",
    separator: "#e0e0e0cc",
    hover: "",
  },
};

export const DarkTheme = {
  colors: {
    text: "#fff",
    background: "#000",
    icon: "#828282",
    searchBackground: "#0f1010",
    secondaryBackground: "#281832",
    secondaryText: "#828282",
    backButton: "#242429",
    currentTrackBorder: "rgba(177, 178, 181, 0.15)",
    popoverBackground: "#141414",
    separator: "rgba(177, 178, 181, 0.15)",
    hover: "#0f1010",
  },
};
