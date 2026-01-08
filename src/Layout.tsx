import React from "react";
import { Layout as RALayout, AppBar } from "react-admin";
import { Box, Typography } from "@mui/material";

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
    userMenu
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
