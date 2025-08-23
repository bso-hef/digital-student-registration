"use client";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={3} alignItems="center" textAlign="center">
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
        <Typography variant="h3" component="h1" color="text.primary">
          404 – Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sorry, the page you’re looking for does not exist or has been moved.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
}
