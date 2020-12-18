const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: colors.white,
      primary: colors.cyan,
      "on-primary": {
        500: "#ffffff",
        600: "#ffffff",
        700: "#ffffff"
      },
      "on-primary-hover": {
        500: colors.blueGray["700"]
      },
      surface: colors.coolGray,
      "on-surface": {
        50: colors.blueGray["700"]
      },
      "sub-text-on-surface": {
        50: colors.blueGray[400]
      },
      "error":  colors.rose["50"],
      "error-icon": colors.red["600"],
      "on-error": colors.blueGray["700"],

      "destructive-icon": colors.red["600"]
    },
    extend: {
      fontFamily: {
        sans: [
          'Roboto',
          ...defaultTheme.fontFamily.sans,
        ],
        header: [
          'Rubik',
          ...defaultTheme.fontFamily.sans,
        ]
      },
      fontSize: {
        // equal to height.icon-sm
        'spinner-box': "12px"
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing'
      },
      height: {
        "icon-sm": '12px',
        icon: '24px',
        "icon-lg": '48px',
        fit: 'fit-content'
      },
      width: {
        "icon-sm": '12px',
        icon: '24px',
        "icon-lg": '48px',
        fit: 'fit-content'
      }
    },
  },
  variants: {
    extend: {
      cursor: ['active', 'hover'],
      display: ['hover']
    },
  },
  plugins: [require('@tailwindcss/forms')]
}
