'use client'
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Box, createTheme, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import UserProvider from '@/context/UserContext';
import TopBar from './topbar';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import 'moment/locale/pt-br';
import { LocalizationProvider } from "@mui/x-date-pickers"
import { ptBR as gridLocale } from '@mui/x-data-grid/locales';
import { ptBR as dateLocale } from '@mui/x-date-pickers/locales';


export default function Layout(props: { children: React.ReactNode, topBar: boolean }) {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const defaultTheme = createTheme({ palette: { mode } }, gridLocale, dateLocale);
  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
  };

  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={defaultTheme}>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="pt-br">
              <UserProvider>
                <CssBaseline enableColorScheme />
                <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
                  {props.topBar && <TopBar mode={mode} toggleColorMode={toggleColorMode} />}
                  <Box sx={{ flex: '1 1', overflow: 'auto' }}>{props.children}</Box>
                </Box>
              </UserProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
