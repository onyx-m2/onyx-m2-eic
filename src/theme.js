/**
 * Color RGB values used by all themes. There are thematic colors (primary, highlight,
 * muted, and background) that are mapped to the appropriate colors in this list, and
 * app can also used these directly as "hard coded" colors where that makes more sense.
 */
const colors = {
  BLACK: 'rgb(0, 0, 0, 1.0)',
  GREY: 'rgb(178, 178, 178, 1.0)',
  DARK_GREY: 'rgb(90, 90, 90, 1.0)',
  WHITE: 'rgb(255, 255, 255, 1.0)',
  YELLOW: 'rgb(251, 190, 8, 1.0)',
  ORANGE: 'rgb(242, 113, 28, 1.0)',
  RED: 'rgb(219, 40, 40, 1.0)',
  GREEN: 'rgb(33, 186, 69, 1.0)',
  BLUE: 'rgb(9, 192, 255, 1.0)'
}

/**
 * Geometry of the interface. The architecture is that there is a `center` cluster
 * and 2 `side` clusters, drawn using the values below.
 */
const geometry = {
  center: {
    indicators: {
      primary: {
        horizontal: 0,
        value: -20,
        caption: -17
      },
      secondary: {
        vertical: 23,
        left: -25,
        middle: 0,
        right: 25
      }
    }
  },
  side: {
    outline: {
      left: 46,
      right: 88,
      height: 60,
      radius: 88,
      width: 2,
    },
    indicators: {
      primary: {
        horizontal: 70,
        value: -10,
        caption: -7
      },
      secondary: {
        top: {x: 70, y: 12},
        bottom: {x: 65, y: 24}
      }
    },
    gauge: {
      width: 3,
      radius: 96,
      height: 64
    }
  }
}

/**
 * Font definitions, there are two families (normal and bold) and 3 sizes corresponding
 * to the intended importance of the rendered text (hero, primary, secondary), and 2
 * caption sizes.
 */
const font = {
  family: {
    normal: 'Gotham Light',
    bold: 'Gotham Bold'
  },
  size: {
    hero: '150%',
    heroCaption: '35%',
    primary: '100%',
    secondary: '50%',
    caption: '25%'
  }
}

/**
 * Night theme is the "super black" theme that looks great on an amoled screen.
 */
export const NIGHT_THEME = {
  name: 'night',
  font,
  geometry,
  colors,
  color: {
    primary: colors.WHITE,
    highlight: colors.BLUE,
    muted: colors.GREY,
    background: colors.BLACK
  }
}

/**
 * Day theme uses a white background for better visibility in direct sunlight.
 */
 export const DAY_THEME = {
  name: 'day',
  font,
  geometry,
  colors,
  color: {
    primary: colors.DARK_GREY,
    highlight: colors.BLUE,
    muted: colors.GREY,
    background: colors.WHITE
  }
}
