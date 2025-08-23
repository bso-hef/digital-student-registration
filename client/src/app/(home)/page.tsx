"use client";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

export default function Home() {
  return (
    <Wrapper>
      <RocketLaunchIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Your Fullstack Template
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth="sm">
        This template is ready to scale with: Next.js, Material-UI, Redux,
        MongoDB, Socket.IO and more. You can now start building your app with
        best practices already in place.
      </Typography>

      <Stack direction="row" spacing={2} mt={4}>
        <Button
          component={Link}
          href="/auth"
          variant="contained"
          color="primary"
        >
          Go to Auth Example
        </Button>
        <Button
          component={Link}
          href="https://github.com"
          target="_blank"
          variant="outlined"
        >
          View Docs
        </Button>
      </Stack>
    </Wrapper>
  );
}
