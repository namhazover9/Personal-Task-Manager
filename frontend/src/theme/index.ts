import { createTheme, ThemeOptions } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';

// ----------------------------------------------------------------------

export function useTheme() {
    const themeOptions: ThemeOptions = {
        palette: palette,
        typography,
        shape: { borderRadius: 8 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: 8,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: '0 0 2px 0 alpha(145, 158, 171, 0.2), 0 12px 24px -4px alpha(145, 158, 171, 0.12)',
                        borderRadius: 16,
                        position: 'relative',
                        zIndex: 0,
                    },
                },
            },
            MuiPaper: {
                defaultProps: {
                    elevation: 0,
                },
            },
        },
    };

    const theme = createTheme(themeOptions);

    return theme;
}
