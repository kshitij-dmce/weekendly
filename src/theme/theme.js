// Sophisticated color scheme with accessibility in mind
export const theme = {
  colors: {
    primary: {
      main: '#3a86ff',      // Vibrant blue for primary actions
      light: '#8bb8ff',
      dark: '#0043cb',
    },
    secondary: {
      main: '#ff006e',      // Energetic pink for weekend vibes
      light: '#ff5a9d',
      dark: '#c50054',
    },
    accent: {
      yellow: '#ffbe0b',    // Sunny weekend feel
      green: '#38b000',     // Outdoor activities
      purple: '#8338ec',    // Night/entertainment activities
    },
    neutral: {
      white: '#ffffff',
      lightest: '#f8f9fa',
      light: '#e9ecef',
      medium: '#ced4da',
      dark: '#6c757d',
      darkest: '#212529',
      black: '#000000',
    },
    feedback: {
      success: '#38b000',
      warning: '#ffbe0b',
      error: '#ff006e',
      info: '#3a86ff',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Montserrat', sans-serif",
    headings: {
      fontWeight: 700,
    },
    body: {
      fontWeight: 400,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2rem',
    circle: '50%',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
    lg: '0 10px 25px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.05)',
    xl: '0 20px 40px rgba(0,0,0,0.1)',
  },
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  }
};