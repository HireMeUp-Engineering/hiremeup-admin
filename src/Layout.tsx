import React, { forwardRef } from "react";
import { Layout as RALayout, AppBar, UserMenu, Logout } from "react-admin";
import { Box, Typography, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";

const TermsAndConditionsMenuItem = forwardRef<HTMLLIElement, any>((props, ref) => (
  <MenuItem
    ref={ref}
    onClick={() => window.open("https://www.hiremeup.com/hire-me-up-terms-and-conditions", "_blank")}
    {...props}
  >
    <ListItemIcon>
      <DescriptionIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText>Terms and Conditions</ListItemText>
  </MenuItem>
));

const PrivacyPolicyMenuItem = forwardRef<HTMLLIElement, any>((props, ref) => (
  <MenuItem
    ref={ref}
    onClick={() => window.open("https://www.hiremeup.com/hire-me-up-privacy-policy", "_blank")}
    {...props}
  >
    <ListItemIcon>
      <PrivacyTipIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText>Privacy Policy</ListItemText>
  </MenuItem>
));

const CustomUserMenu = () => (
  <UserMenu>
    <TermsAndConditionsMenuItem />
    <PrivacyPolicyMenuItem />
    <Logout />
  </UserMenu>
);

const CustomAppBar = () => (
  <AppBar
    sx={{
      "& .RaAppBar-title": {
        flex: 1,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
      "& .RaAppBar-toolbar": {
        paddingRight: 2,
      },
    }}
    userMenu={<CustomUserMenu />}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flex: 1,
      }}
    >
      <img
        src="/logo.png"
        alt="HireMeUp"
        style={{
          height: "32px",
          maxWidth: "150px",
          objectFit: "contain",
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: "white",
          fontWeight: 600,
        }}
      ></Typography>
    </Box>
  </AppBar>
);

export const Layout = (props: any) => (
  <RALayout
    {...props}
    appBar={CustomAppBar}
    sx={{
      "& .RaLayout-content": {
        paddingTop: "40px",
      },
      "& .RaList-main": {
        paddingLeft: "24px",
        paddingRight: "24px",
      },
      "& .RaShow-main": {
        paddingLeft: "24px",
        paddingRight: "24px",
      },
      "& .RaEdit-main": {
        paddingLeft: "24px",
        paddingRight: "24px",
      },
      "& .RaCreate-main": {
        paddingLeft: "24px",
        paddingRight: "24px",
      },
      "& .RaSidebar-fixed": {
        paddingTop: "24px",
        marginTop: "6px",
      },
      "& .MuiDrawer-root .MuiPaper-root": {
        paddingTop: "24px",
        marginTop: "6px",
      },
    }}
  />
);
