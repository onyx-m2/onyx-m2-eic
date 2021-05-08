/**
 * Instrument cluster theme (super black)
 */
export const INSTRUMENTS_THEME = {
  name: 'instruments',
  primary: 'white',
  scale: {
    white: 'rgb(255, 255, 255, 0.8)',
    yellow: 'rgb(251, 190, 8, 0.8)',
    orange: 'rgb(242, 113, 28, 0.8)',
    red: 'rgb(219, 40, 40, 0.8)',
    green: 'rgb(33, 186, 69, 0.8)',
    blue: 'rgb(9, 192, 255, 0.8)'
  },
  indicator: {
    grey: 'rgb(255, 255, 255, 0.7)',
    white: 'rgb(255, 255, 255, 1.0)',
    yellow: 'rgb(251, 190, 8, 1.0)',
    orange: 'rgb(242, 113, 28, 1.0)',
    red: 'rgb(219, 40, 40, 1.0)',
    green: 'rgb(33, 186, 69, 1.0)',
    blue: 'rgb(9, 192, 255, 1.0)'
    //blue: 'rgb(0, 146, 193, 1.0)'
  },
  font: {
    size: {
      hero: '64px',
      large: '36px',
      medium: '24px',
      small: '14px'
    },
  },
  text: {
    dark: 'rgba(255, 255, 255, 0.9)',
    muted: 'rgba(255, 255, 255, 0.8)',
    light: 'rgba(255, 255, 255, 0.7)',
    unselected: 'rgba(255, 255, 255, 0.5)',
    hovered: 'rgba(255, 255, 255, 1)',
    pressed: 'rgba(255, 255, 255, 1)',
    selected: 'rgba(255, 255, 255, 1)',
    disabled: 'rgba(255, 255, 255, 0.2)'
  },
  background: {
    panel: 'black',
    component: 'black',
    button: '#E0E1E2',
    selected: 'rgba(255, 255, 255, 0.15);'
  },
  divider: 'rgba(255, 255, 255, 0.08)',
  colours: {
    green: 'rgb(91, 194, 54)',

  },
  circular: {
    size: '320px',
    colour: 'white'
  },
  linear: {

  },
  // side panels showing secondary stats
  panel: {
    left: 46,
    right: 88,
    height: 60,
    radius: 88,
    width: 2,
  }
}
