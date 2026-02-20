import { defaultTheme } from "react-admin";
import { createTheme } from "@mui/material/styles";

/**
 * HireMeUp Brand Color Palette
 *
 * Colors sourced from the HireMeUp email template brand guidelines.
 * All colors maintain proper contrast ratios for WCAG AA accessibility compliance.
 */
const hiremeColors = {
  primary: "#211B43", // Dark purple/navy - header background, primary actions
  secondary: "#8759F2", // Bright purple - OTP box, accents, interactive elements
  textPrimary: "#211B43", // Dark purple for headings and emphasized text
  textSecondary: "#1C4A72", // Dark blue for body text and secondary content
  textTertiary: "#8997A4", // Gray for footer text and disabled content
} as const;

/**
 * HireMeUp Admin Panel Theme
 *
 * Material-UI theme configuration for the HireMeUp admin dashboard. Extends react-admin's
 * default theme with HireMeUp brand colors and customized component styles for consistency
 * with the HireMeUp design system.
 *
 * ## Features
 * - **Brand Colors**: Primary dark purple (#211B43) and secondary bright purple (#8759F2)
 * - **Typography**: Encode Sans font family with consistent heading and body text styling
 * - **Component Customization**: Styled Material-UI components (buttons, cards, inputs, etc.)
 * - **React-Admin Integration**: Custom overrides for react-admin specific components
 *   (RaDatagrid, RaMenuItemLink, RaFilterForm, etc.)
 *
 * ## Usage
 * ```tsx
 * import { ThemeProvider } from '@mui/material/styles';
 * import { theme } from './theme';
 *
 * <ThemeProvider theme={theme}>
 *   <Admin>...</Admin>
 * </ThemeProvider>
 * ```
 */
export const theme = createTheme({
  ...defaultTheme,
  palette: {
    primary: {
      main: hiremeColors.primary,
      light: "#3a2f5f",
      dark: "#15101f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: hiremeColors.secondary,
      light: "#a57ff5",
      dark: "#6842c9",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: hiremeColors.textPrimary,
      secondary: hiremeColors.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Encode Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: hiremeColors.textPrimary,
      fontWeight: 600,
    },
    h2: {
      color: hiremeColors.textPrimary,
      fontWeight: 600,
    },
    h3: {
      color: hiremeColors.textPrimary,
      fontWeight: 600,
    },
    h4: {
      color: hiremeColors.textPrimary,
      fontWeight: 600,
    },
    h5: {
      color: hiremeColors.textPrimary,
      fontWeight: 600,
    },
    h6: {
      color: hiremeColors.textPrimary,
      fontWeight: 600,
    },
    body1: {
      color: hiremeColors.textSecondary,
    },
    body2: {
      color: hiremeColors.textSecondary,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: hiremeColors.primary,
          color: "#ffffff",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: hiremeColors.secondary,
          "&:hover": {
            backgroundColor: "#6842c9",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
          height: 28,
        },
        colorPrimary: {
          backgroundColor: hiremeColors.secondary,
          color: "#ffffff",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(33, 27, 67, 0.08)",
          borderRadius: 12,
          transition: "box-shadow 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0px 4px 16px rgba(33, 27, 67, 0.12)",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid rgba(135, 89, 242, 0.1)",
          fontWeight: 600,
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          "&.RaMenuItemLink-active": {
            backgroundColor: hiremeColors.secondary,
            color: "#ffffff",
            "& .MuiListItemIcon-root": {
              color: "#ffffff",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(135, 89, 242, 0.1)",
          },
        },
      },
    },
    RaLayout: {
      styleOverrides: {
        root: {
          "& .RaLayout-appFrame": {
            marginTop: 0,
          },
        },
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .RaDatagrid-headerCell": {
            backgroundColor: "#f8f7fa",
            borderBottom: "2px solid rgba(135, 89, 242, 0.2)",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "16px 12px",
          },
          "& .RaDatagrid-rowCell": {
            borderBottom: "1px solid rgba(33, 27, 67, 0.08)",
            padding: "16px 12px",
          },
          "& .RaDatagrid-row": {
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(135, 89, 242, 0.04)",
              boxShadow: "0 2px 8px rgba(135, 89, 242, 0.12)",
              transform: "translateY(-1px)",
              cursor: "pointer",
            },
          },
        },
      },
    },
    RaFilterForm: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          flexWrap: "wrap",
          "& .RaFilterFormInput-body": {
            display: "flex",
            alignItems: "flex-end",
          },
          "& .MuiFormControl-root": {
            marginTop: 0,
            marginBottom: 0,
          },
          "& .MuiInputBase-root": {
            marginTop: 0,
          },
          "& .MuiFormHelperText-root": {
            display: "none",
          },
        },
      },
    },
    RaFilterFormInput: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "flex-end",
          "& .MuiFormControl-root": {
            marginTop: 0,
            marginBottom: 0,
          },
        },
      },
    },
    RaList: {
      styleOverrides: {
        root: {
          "& .RaList-actions": {
            display: "flex",
            alignItems: "flex-end",
            minHeight: "56px",
            paddingTop: "8px",
            paddingBottom: "8px",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            minHeight: "40px",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          minHeight: "40px",
        },
      },
    },
  },
});
