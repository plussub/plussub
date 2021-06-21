const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.vue', './src/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    spacing: {
      '0': '0px',
      'px': '1px',
      '0.5': '2px',
      '1': '4px',
      '1.5': '6px',
      '2': '8px',
      '2.5': '10px',
      '3': '12px',
      '3.5': '14px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '28': '112px',
      '32': '128px',
      '36': '144px',
      '40': '160px',
      '44': '176px',
      '48': '192px',
      '52': '208px',
      '56': '224px',
      '60': '240px',
      '64': '256px',
      '72': '288px',
      '80': '320px',
      '96': '384px'
    },
    fontSize: {
      'xs': '12px',
      'sm': '14px',
      'lg': '18px',
      'xl': '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '64px'
    },
    colors: {
      white: colors.white,
      primary: colors.cyan,
      'on-primary': {
        500: '#ffffff',
        600: '#ffffff',
        700: '#ffffff'
      },
      'on-primary-hover': {
        500: colors.blueGray['700']
      },
      surface: colors.coolGray,
      'on-surface': {
        50: colors.blueGray['700']
      },
      'sub-text-on-surface': {
        50: colors.blueGray[400]
      },
      error: colors.rose['50'],
      'error-icon': colors.red['600'],
      'on-error': colors.blueGray['700'],

      'destructive-icon': colors.red['600']
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        header: ['Rubik', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        // equal to height.icon-sm
        'spinner-box': '12px'
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing'
      },
      height: {
        'icon-sm': '12px',
        icon: '24px',
        'icon-lg': '48px',
        fit: 'fit-content'
      },
      width: {
        'icon-sm': '12px',
        icon: '24px',
        'icon-lg': '48px',
        fit: 'fit-content'
      }
    }
  },
  variants: {
    extend: {
      cursor: ['active', 'hover'],
      display: ['hover']
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
