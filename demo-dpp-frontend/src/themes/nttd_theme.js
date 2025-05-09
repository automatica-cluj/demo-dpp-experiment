export const nttd_theme = {
  name: 'nttd',
  colors: {
    primary: {
      main: '#005b96', // 500
      light: '#4d8cb6', // 300
      dark: '#004079', // 800
      contrastText: '#ffffff',
      shades: {
        50: '#e0ebf2',
        100: '#b3cee0',
        200: '#80adcb',
        300: '#4d8cb6',
        400: '#2674a6',
        500: '#005b96',
        600: '#00538e',
        700: '#004983',
        800: '#004079',
        900: '#002f68',
        A100: '#97bdff',
        A200: '#649dff',
        A400: '#317cff',
        A700: '#186cff'
      }
    },
    secondary: {
      main: '#070f26', // 500
      light: '#515767', // 300
      dark: '#040817', // 800
      contrastText: '#ffffff',
      shades: {
        50: '#e1e2e5',
        100: '#b5b7be',
        200: '#838793',
        300: '#515767',
        400: '#2c3347',
        500: '#070f26',
        600: '#060d22',
        700: '#050b1c',
        800: '#040817',
        900: '#02040d'
      }
    },
    grey: {
      main: '#2e404d', // 500
      light: '#6d7982', // 300
      dark: '#1d2a34', // 800
      contrastText: '#ffffff',
      shades: {
        50: '#e8e8e8',
        100: '#c0c6ca',
        200: '#8B959C',
        300: '#6d7982',
        400: '#4d5d68',
        500: '#2e404d',
        600: '#293a46',
        700: '#23323d',
        800: '#1d2a34',
        900: '#121c25'
      }
    },
    error: {
      main: '#e42600', // 500
      light: '#ec674d', // 300
      dark: '#d91700', // 800
      contrastText: '#ffffff',
      shades: {
        50: '#fce5e0',
        100: '#f7beb3',
        200: '#f29380',
        300: '#ec674d',
        400: '#e84726',
        500: '#e42600',
        600: '#e12200',
        700: '#dd1c00',
        800: '#d91700',
        900: '#A80B00',
        A100: '#fff9f9',
        A200: '#ffc7c6',
        A400: '#ff9693',
        A700: '#ff7d7a'
      }
    },
    background: {
      default: '#ffffff',
      paper: '#F0F5F7',
    },
    text: {
      primary: '#2e404d', // grey 500
      secondary: '#6d7982', // grey 300
      disabled: '#c0c6ca', // grey 100
    },
    border: {
      default: '#8B959C', // grey 200
      focus: '#005b96', // primary 500
    }
  },
  typography: {
    fontFamily: '"Noto Sans", "Helvetica", "Arial", sans-serif',
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      md: '1rem',      // 16px
      lg: '1.25rem',   // 20px
      xl: '1.5rem',    // 24px
    },
    fontWeight: {
      regular: 400,
      bold: 700,
    },
    lineHeight: {
      normal: 1.5,
      heading: 1.2,
    }
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
  borderRadius: {
    small: '0.125rem', // 2px
    medium: '0.25rem', // 4px
    large: '0.5rem',   // 8px
  },
  shadows: {
    none: 'none',
    small: '0 1px 3px rgba(0,0,0,0.12)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 10px 15px rgba(0,0,0,0.1)',
  },
  components: {
    button: {
      borderRadius: '0.125rem',
      padding: {
        small: '0.25rem 0.5rem',
        medium: '0.375rem 0.75rem',
        large: '0.5rem 1rem',
      }
    },
    input: {
      borderRadius: '0.125rem',
      borderColor: '#8B959C',
      focusBorderColor: '#005b96',
    },
    table: {
      headerBackground: '#BB1919',//'#F0F5F7',
      rowHoverBackground: '#e0ebf2',
      borderColor: '#8B959C',
    }
  }
}; 