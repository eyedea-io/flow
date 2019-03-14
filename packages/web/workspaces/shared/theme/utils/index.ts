import {css} from 'styled-components'
import tinycolor from 'tinycolor2'
import {colors, fills, scales} from '../foundational-styles'
import {fontFamilies, headings, paragraph, text} from '../typography'

const themedProperty = (object, keyOrValue) => {
  if (Object.prototype.hasOwnProperty.call(object, keyOrValue)) {
    return object[keyOrValue]
  }

  return keyOrValue
}

export const getTextColor = (color) => {
  return themedProperty(colors.text, color)
}

export const getLinkColor = (color) => {
  return themedProperty(colors.link, color)
}

export const getLinkFocusColor = (color) => {
  const opt = {
    danger: fills.subtle.red,
    default: fills.subtle.blue,
    info: fills.subtle.blue,
    neutral: fills.subtle.neutral,
    success: fills.subtle.green,
    warning: fills.subtle.orange,
  }[color]

  return `
    color: ${opt.color};
    background-color: ${opt.backgroundColor};
  `
}

export const getFontFamily = (fontFamily) => {
  return themedProperty(fontFamilies, fontFamily)
}

export const getHeadingStyle = (style) => {
  return themedProperty(headings, style)
}

export const getTextStyle = (style) => {
  return themedProperty(text, style)
}

export const getParagraphStyle = (style) => {
  return themedProperty(paragraph, style)
}

export const getTextColorForIntent = (intent: string, defaultColor?: string) => {
  switch (intent) {
    case 'success':
      return colors.text.success
    case 'danger':
      return colors.text.danger
    case 'warning':
      return colors.text.warning
    default:
      return defaultColor || colors.text.default
  }
}

export const linearGradient = (top: string, bottom: string) => {
 return `linear-gradient(to bottom, ${top}, ${bottom})`
}

export const getLinearGradientWithStates = (
  startColor: string,
  endColor: string,
  intensityMultiplier = 1
) => {
  return {
    base: linearGradient(startColor, endColor),
    hover: linearGradient(
      tinycolor(startColor)
        .darken(intensityMultiplier * 5)
        .toString(),
      tinycolor(endColor)
        .darken(intensityMultiplier * 5)
        .toString()
    ),
    active: linearGradient(
      tinycolor(endColor)
        .darken(intensityMultiplier * 5)
        .toString(),
      tinycolor(endColor)
        .darken(intensityMultiplier * 5)
        .toString()
    ),
  }
}

export const getPrimaryButtonStylesForIntent = (intent: string) => {
  switch (intent) {
    case 'success': {
      const startColor = '#23C277'
      const endColor = '#399D6C'

      return {
        linearGradient: getLinearGradientWithStates(startColor, endColor),
        focusColor: tinycolor(startColor)
          .setAlpha(0.4)
          .toString(),
      }
    }
    case 'warning': {
      const startColor = '#EE9913'
      const endColor = '#D9822B'

      return {
        linearGradient: getLinearGradientWithStates(startColor, endColor),
        focusColor: tinycolor(startColor)
          .setAlpha(0.4)
          .toString(),
      }
    }
    case 'danger': {
      const startColor = '#EC4C47'
      const endColor = '#D64540'

      return {
        linearGradient: getLinearGradientWithStates(startColor, endColor),
        focusColor: tinycolor(startColor)
          .setAlpha(0.4)
          .toString(),
      }
    }
    default: {
      const startColor = '#0788DE'
      const endColor = '#116AB8'

      return {
        linearGradient: getLinearGradientWithStates(startColor, endColor),
        focusColor: tinycolor(startColor)
          .setAlpha(0.4)
          .toString(),
      }
    }
  }
}

export const getButtonStyle = (appearance: string = 'default', intent: string = 'default') => {
  const disabled = css`
    opacity: 0.8;
    background-image: none;
    background-color: ${scales.neutral.N2A};
    box-shadow: none;
    color: ${scales.neutral.N7A};
  `

  switch (appearance) {
    case 'primary':
      const {linearGradient: gradient, focusColor} = getPrimaryButtonStylesForIntent(
        intent
      )

      return css`
        color: white;
        background-color: white;
        background-image: ${gradient.base};
        box-shadow: ${`inset 0 0 0 1px ${scales.neutral.N5A}, inset 0 -1px 1px 0 ${scales.neutral.N2A}`};

        &:disabled {
          ${disabled};
        }

        &:hover {
          background-image: ${gradient.hover};
        }

        &:focus {
          outline: none;
          box-shadow: ${`0 0 0 3px ${focusColor}, inset 0 0 0 1px ${scales
            .neutral.N4A}, inset 0 -1px 1px 0 ${scales.neutral.N5A}`};
        }

        &:active {
          background-image: ${gradient.active};
          box-shadow: ${`inset 0 0 0 1px ${scales.neutral
            .N4A}, inset 0 1px 1px 0 ${scales.neutral.N2A}`};
        }

        &:focus:active {
          box-shadow: ${`0 0 0 3px ${focusColor}, inset 0 0 0 1px ${scales
            .neutral.N4A}, inset 0 1px 1px 0 ${scales.neutral.N2A}`};
        }
      `
    case 'minimal':
      const minimalIntentTextColor = getTextColorForIntent(intent, scales.blue.B9)

      return css`
        color: ${minimalIntentTextColor};
        background-color: transparent;

        &:disabled {
          ${disabled};
        }

        &:hover {
          background-color: ${scales.neutral.N2A};
        }

        &:focus {
          outline: none;
          box-shadow: ${`0 0 0 3px ${scales.blue.B5A}`};
        }

        &:active {
          background-image: none;
          background-color: ${scales.blue.B3A};
        }
      `
    case 'default':
    default:
      const intentTextColor = getTextColorForIntent(intent)

      return css`
        color: ${intentTextColor};
        background-color: white;
        background-image: ${linearGradient('#FFFFFF', '#F4F5F7')};
        box-shadow: ${`inset 0 0 0 1px ${scales.neutral.N4A}, inset 0 -1px 1px 0 ${scales.neutral.N2A}`};

        &:disabled {
          ${disabled}
        }

        &:hover {
          background-image: ${linearGradient('#FAFBFB', '#EAECEE')};
        }

        &:focus {
          outline: none;
          box-shadow: ${`0 0 0 3px ${scales.blue
            .B4A}, inset 0 0 0 1px ${scales.neutral
            .N5A}, inset 0 -1px 1px 0 ${scales.neutral.N4A}`};
        }

        &:active {
          background-image: none;
          background-color: ${scales.blue.B3A};
          box-shadow: ${`inset 0 0 0 1px ${scales.neutral
            .N4A}, inset 0 1px 1px 0 ${scales.neutral.N2A}`};
        }

        &:focus:active {
          box-shadow: ${`0 0 0 3px ${scales.blue
            .B4A}, inset 0 0 0 1px ${scales.neutral
            .N5A}, inset 0 1px 1px 0 ${scales.neutral.N2A}`};
        }
      `
  }
}

/**
 * Get the text size for a control with a certain height.
 * @return {number} text size of the control height.
 */
export const getTextSizeForControlHeight = (height: number):  number => {
  if (height <= 24) { return 300 }
  if (height <= 28) { return 300 }
  if (height <= 32) { return 300 }
  if (height <= 36) { return 400 }
  if (height <= 40) { return 400 }

  return 500
}
