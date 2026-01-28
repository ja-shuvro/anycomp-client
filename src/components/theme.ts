'use client';
import { createTheme } from '@mui/material/styles';
import { Red_Hat_Display } from 'next/font/google';

// Font configuration
// Ideally we would use Proxima Nova as primary, but strictly sticking to Google Fonts for now
// or allow passing it in if configured in layout.
const redHatDisplay = Red_Hat_Display({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    typography: {
        fontFamily: redHatDisplay.style.fontFamily,
        // Add Proxima Nova here if available locally
    },
    palette: {
        text: {
            primary: '#222222',
        },
        // Add other colors from design
    },
});

export default theme;
