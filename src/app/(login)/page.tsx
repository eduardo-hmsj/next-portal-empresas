'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Content from '@/components/Login/Content';
import SignInCard from '@/components/Login/SignInCard';
 
export default function Login() {
  return (
    <Stack
      direction="column"
      component="main"
      sx={[
        {
          justifyContent: 'space-between',
          height: { xs: 'auto', md: '100%' },
        },
        (theme) => ({
          backgroundImage:
            'radial-gradient(ellipse at 70% 51%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
          backgroundSize: 'cover',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(at 70% 51%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
          }),
        }),
      ]}
    >
      <Stack
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{
          justifyContent: 'center',
          gap: { xs: 6, sm: 12 },
          p: { xs: 2, sm: 4 },
          m: 'auto',
        }}
      >
        <Content />
        <SignInCard />
      </Stack>
    </Stack>
  );
}
