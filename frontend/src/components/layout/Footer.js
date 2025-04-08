import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          Fitness Workout Tracker - {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Built with React, Flask, and '}
          <Link color="inherit" href="https://azure.microsoft.com/en-us/services/devops/">
            Azure DevOps
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
