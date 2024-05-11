import { createTheme } from '@mui/material/styles';
import { Theme } from './theme.vm';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#201f20',
    },
    secondary: {
      main: '#e8eaeb',
    },
  },
});

export const theme: Theme = defaultTheme;
