// Centralized Design Tokens for the Chess Platform

const theme = {
    colors: {
        primary: '#00d9ff',
        secondary: '#ec4899',
        blue: '#60a5fa',
        purple: '#a855f7',
        background: {
            light: '#f9fafb',
            dark: '#1e293b',
        },
        text: {
            light: '#1e293b',
            dark: '#f9fafb',
        },
        success: '#34d399',
        error: '#f87171',
        warning: '#fbbf24',
        info: '#60a5fa',
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
        fontSizes: {
            small: '0.875rem',
            base: '1rem',
            large: '1.25rem',
            xlarge: '1.5rem',
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            bold: 700,
        },
    },
    borderRadius: {
        small: '4px',
        medium: '8px',
        large: '16px',
    },
    shadows: {
        light: '0 1px 3px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
        heavy: '0 10px 15px rgba(0, 0, 0, 0.2)',
    },
    animations: {
        duration: {
            short: '150ms',
            medium: '300ms',
            long: '500ms',
        },
        easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        },
    },
    zIndex: {
        dropdown: 1000,
        modal: 1050,
        toast: 1100,
    },
};

export default theme;